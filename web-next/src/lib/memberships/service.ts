import { createReadOnlyClient } from "@/lib/supabase/server";

export type MemberMembershipRecord = {
  id: string;
  member_id: string;
  membership_plan_id: string;
  status:
    | "active"
    | "expired"
    | "inactive"
    | "suspended"
    | "frozen"
    | "pending_payment"
    | "trial";
  status_reason: string | null;
  payment_status: string;
  start_at: string;
  end_at: string;
  remaining_freeze_days: number;
  membership_plans: {
    id: string;
    name: string;
    duration_unit: string;
    duration_value: number;
    supports_renewal: boolean;
    supports_extension: boolean;
    supports_freeze: boolean;
    supports_suspension: boolean;
  } | null;
};

type RawMemberMembershipRecord = Omit<MemberMembershipRecord, "membership_plans"> & {
  membership_plans:
    | MemberMembershipRecord["membership_plans"]
    | MemberMembershipRecord["membership_plans"][]
    | null;
};

function normalizeMembership(record: RawMemberMembershipRecord): MemberMembershipRecord {
  return {
    ...record,
    membership_plans: Array.isArray(record.membership_plans)
      ? (record.membership_plans[0] ?? null)
      : record.membership_plans,
  };
}

function addDuration(startAt: Date, durationUnit: string, durationValue: number) {
  const next = new Date(startAt);

  if (durationUnit === "day" || durationUnit === "days") {
    next.setDate(next.getDate() + durationValue);
    return next;
  }

  if (durationUnit === "week" || durationUnit === "weeks") {
    next.setDate(next.getDate() + durationValue * 7);
    return next;
  }

  if (durationUnit === "month" || durationUnit === "months") {
    next.setMonth(next.getMonth() + durationValue);
    return next;
  }

  if (durationUnit === "year" || durationUnit === "years") {
    next.setFullYear(next.getFullYear() + durationValue);
    return next;
  }

  next.setDate(next.getDate() + durationValue);
  return next;
}

async function recordMembershipEvent(input: {
  tenantId: string;
  membershipId: string;
  eventType: string;
  createdBy?: string;
  meta?: Record<string, unknown>;
}) {
  const supabase = await createReadOnlyClient();
  const { error } = await supabase.from("membership_events").insert({
    tenant_id: input.tenantId,
    member_membership_id: input.membershipId,
    event_type: input.eventType,
    meta: input.meta ?? {},
    created_by: input.createdBy || null,
  });

  if (error) {
    throw new Error(`Failed to record membership event: ${error.message}`);
  }
}

export async function getLatestMemberMembership(
  tenantId: string,
  memberId: string,
) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("member_memberships")
    .select(
      `
        id,
        member_id,
        membership_plan_id,
        status,
        status_reason,
        payment_status,
        start_at,
        end_at,
        remaining_freeze_days,
        membership_plans (
          id,
          name,
          duration_unit,
          duration_value,
          supports_renewal,
          supports_extension,
          supports_freeze,
          supports_suspension
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load latest membership: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return normalizeMembership(data as RawMemberMembershipRecord);
}

export async function renewMembership(input: {
  tenantId: string;
  membershipId: string;
  createdBy?: string;
}) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("member_memberships")
    .select(
      `
        id,
        member_id,
        membership_plan_id,
        status,
        status_reason,
        payment_status,
        start_at,
        end_at,
        remaining_freeze_days,
        membership_plans (
          id,
          name,
          duration_unit,
          duration_value,
          supports_renewal,
          supports_extension,
          supports_freeze,
          supports_suspension
        )
      `,
    )
    .eq("tenant_id", input.tenantId)
    .eq("id", input.membershipId)
    .single();

  if (error || !data) {
    throw new Error(`Failed to load membership for renewal: ${error?.message ?? "Unknown error"}`);
  }

  const membership = normalizeMembership(data as RawMemberMembershipRecord);

  if (!membership.membership_plans?.supports_renewal) {
    throw new Error("This membership plan does not support renewal.");
  }

  const startAt = new Date(
    Math.max(Date.now(), new Date(membership.end_at).getTime()),
  );
  const endAt = addDuration(
    startAt,
    membership.membership_plans.duration_unit,
    membership.membership_plans.duration_value,
  );

  const { data: renewed, error: insertError } = await supabase
    .from("member_memberships")
    .insert({
      tenant_id: input.tenantId,
      member_id: membership.member_id,
      membership_plan_id: membership.membership_plan_id,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      status: "active",
      payment_status: "pending",
      created_by: input.createdBy || null,
    })
    .select("id")
    .single();

  if (insertError || !renewed) {
    throw new Error(`Failed to renew membership: ${insertError?.message ?? "Unknown error"}`);
  }

  await recordMembershipEvent({
    tenantId: input.tenantId,
    membershipId: renewed.id as string,
    eventType: "renewed",
    createdBy: input.createdBy,
    meta: {
      previous_membership_id: membership.id,
    },
  });

  return renewed.id as string;
}

export async function freezeMembership(input: {
  tenantId: string;
  membershipId: string;
  freezeDays: number;
  createdBy?: string;
}) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("member_memberships")
    .select(
      `
        id,
        remaining_freeze_days,
        end_at,
        membership_plans (
          supports_freeze
        )
      `,
    )
    .eq("tenant_id", input.tenantId)
    .eq("id", input.membershipId)
    .single();

  if (error || !data) {
    throw new Error(`Failed to load membership for freeze: ${error?.message ?? "Unknown error"}`);
  }

  const plan = Array.isArray(data.membership_plans)
    ? data.membership_plans[0]
    : data.membership_plans;

  if (!plan?.supports_freeze) {
    throw new Error("This membership plan does not support freeze.");
  }

  const freezeDays = Math.max(1, Math.min(30, input.freezeDays));
  const endAt = new Date(data.end_at);
  endAt.setDate(endAt.getDate() + freezeDays);

  const { error: updateError } = await supabase
    .from("member_memberships")
    .update({
      status: "frozen",
      status_reason: `Frozen for ${freezeDays} day${freezeDays === 1 ? "" : "s"}`,
      remaining_freeze_days: Number(data.remaining_freeze_days ?? 0) + freezeDays,
      end_at: endAt.toISOString(),
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", input.membershipId);

  if (updateError) {
    throw new Error(`Failed to freeze membership: ${updateError.message}`);
  }

  await recordMembershipEvent({
    tenantId: input.tenantId,
    membershipId: input.membershipId,
    eventType: "frozen",
    createdBy: input.createdBy,
    meta: { freeze_days: freezeDays },
  });
}

export async function suspendMembership(input: {
  tenantId: string;
  membershipId: string;
  createdBy?: string;
}) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("member_memberships")
    .select(
      `
        id,
        membership_plans (
          supports_suspension
        )
      `,
    )
    .eq("tenant_id", input.tenantId)
    .eq("id", input.membershipId)
    .single();

  if (error || !data) {
    throw new Error(`Failed to load membership for suspension: ${error?.message ?? "Unknown error"}`);
  }

  const plan = Array.isArray(data.membership_plans)
    ? data.membership_plans[0]
    : data.membership_plans;

  if (!plan?.supports_suspension) {
    throw new Error("This membership plan does not support suspension.");
  }

  const { error: updateError } = await supabase
    .from("member_memberships")
    .update({
      status: "suspended",
      status_reason: "Suspended by staff",
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", input.membershipId);

  if (updateError) {
    throw new Error(`Failed to suspend membership: ${updateError.message}`);
  }

  await recordMembershipEvent({
    tenantId: input.tenantId,
    membershipId: input.membershipId,
    eventType: "suspended",
    createdBy: input.createdBy,
  });
}

export async function reactivateMembership(input: {
  tenantId: string;
  membershipId: string;
  createdBy?: string;
}) {
  const supabase = await createReadOnlyClient();
  const { error } = await supabase
    .from("member_memberships")
    .update({
      status: "active",
      status_reason: null,
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", input.membershipId);

  if (error) {
    throw new Error(`Failed to reactivate membership: ${error.message}`);
  }

  await recordMembershipEvent({
    tenantId: input.tenantId,
    membershipId: input.membershipId,
    eventType: "reactivated",
    createdBy: input.createdBy,
  });
}
