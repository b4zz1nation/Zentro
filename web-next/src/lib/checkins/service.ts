import { computeMembershipStatus } from "@/lib/memberships/status";
import { createReadOnlyClient } from "@/lib/supabase/server";

export type CheckinSearchMember = {
  id: string;
  external_member_code: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: "active" | "inactive" | "archived";
  home_branch_id: string | null;
  branches: {
    id: string;
    name: string;
  } | null;
};

export type CheckinLogItem = {
  id: string;
  result: "success" | "failed";
  result_reason: string | null;
  checkin_method: "manual" | "qr";
  created_at: string;
  branches: {
    id: string;
    name: string;
  } | null;
  members: {
    id: string;
    external_member_code: string | null;
    first_name: string;
    last_name: string;
  } | null;
};

type RawCheckinSearchMember = Omit<CheckinSearchMember, "branches"> & {
  branches:
    | CheckinSearchMember["branches"]
    | CheckinSearchMember["branches"][]
    | null;
};

type RawCheckinLogItem = Omit<CheckinLogItem, "branches" | "members"> & {
  branches: CheckinLogItem["branches"] | CheckinLogItem["branches"][] | null;
  members: CheckinLogItem["members"] | CheckinLogItem["members"][] | null;
};

type MembershipCandidate = {
  id: string;
  status:
    | "active"
    | "expired"
    | "inactive"
    | "suspended"
    | "frozen"
    | "pending_payment"
    | "trial";
  payment_status: string;
  start_at: string;
  end_at: string;
  membership_plans: {
    id: string;
    name: string;
    access_scope: "all_branches" | "selected_branches";
    plan_branch_access: Array<{
      branch_id: string;
    }> | null;
  } | null;
};

type PassCandidate = {
  id: string;
  status:
    | "active"
    | "expired"
    | "inactive"
    | "suspended"
    | "frozen"
    | "pending_payment"
    | "trial";
  payment_status: string;
  start_at: string;
  end_at: string;
  remaining_uses: number | null;
  passes: {
    id: string;
    name: string;
    access_scope: "all_branches" | "selected_branches";
    pass_branch_access: Array<{
      branch_id: string;
    }> | null;
  } | null;
};

type RawMembershipCandidate = Omit<MembershipCandidate, "membership_plans"> & {
  membership_plans:
    | MembershipCandidate["membership_plans"]
    | MembershipCandidate["membership_plans"][]
    | null;
};

type RawPassCandidate = Omit<PassCandidate, "passes"> & {
  passes: PassCandidate["passes"] | PassCandidate["passes"][] | null;
};

export type CheckinValidationResult = {
  ok: boolean;
  reason: string;
  member: CheckinSearchMember;
  membershipId?: string;
  memberPassId?: string;
  sourceLabel?: string;
};

function normalizeMember(record: RawCheckinSearchMember): CheckinSearchMember {
  return {
    ...record,
    branches: Array.isArray(record.branches)
      ? (record.branches[0] ?? null)
      : record.branches,
  };
}

function normalizeCheckinLogItem(record: RawCheckinLogItem): CheckinLogItem {
  return {
    ...record,
    branches: Array.isArray(record.branches)
      ? (record.branches[0] ?? null)
      : record.branches,
    members: Array.isArray(record.members)
      ? (record.members[0] ?? null)
      : record.members,
  };
}

function normalizeMembershipCandidate(
  record: RawMembershipCandidate,
): MembershipCandidate {
  return {
    ...record,
    membership_plans: Array.isArray(record.membership_plans)
      ? (record.membership_plans[0] ?? null)
      : record.membership_plans,
  };
}

function normalizePassCandidate(record: RawPassCandidate): PassCandidate {
  return {
    ...record,
    passes: Array.isArray(record.passes)
      ? (record.passes[0] ?? null)
      : record.passes,
  };
}

function canUseScopedProduct(
  scope: "all_branches" | "selected_branches",
  branchAccess: Array<{ branch_id: string }> | null | undefined,
  branchId: string,
) {
  if (scope === "all_branches") {
    return true;
  }

  return (branchAccess ?? []).some((item) => item.branch_id === branchId);
}

export async function searchMembersForCheckin(
  tenantId: string,
  query?: string,
) {
  const search = query?.trim();

  if (!search) {
    return [] as CheckinSearchMember[];
  }

  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      `
        id,
        external_member_code,
        first_name,
        last_name,
        email,
        phone,
        status,
        home_branch_id,
        branches:home_branch_id (
          id,
          name
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .or(
      [
        `external_member_code.ilike.%${search}%`,
        `first_name.ilike.%${search}%`,
        `last_name.ilike.%${search}%`,
        `email.ilike.%${search}%`,
        `phone.ilike.%${search}%`,
      ].join(","),
    )
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    throw new Error(`Failed to search members: ${error.message}`);
  }

  return ((data ?? []) as RawCheckinSearchMember[]).map(normalizeMember);
}

export async function listRecentCheckins(
  tenantId: string,
  branchIds?: string[],
) {
  const supabase = await createReadOnlyClient();
  let builder = supabase
    .from("checkins")
    .select(
      `
        id,
        result,
        result_reason,
        checkin_method,
        created_at,
        branches:branch_id (
          id,
          name
        ),
        members:member_id (
          id,
          external_member_code,
          first_name,
          last_name
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (branchIds && branchIds.length > 0) {
    builder = builder.in("branch_id", branchIds);
  }

  const { data, error } = await builder;

  if (error) {
    throw new Error(`Failed to load recent check-ins: ${error.message}`);
  }

  return ((data ?? []) as RawCheckinLogItem[]).map(normalizeCheckinLogItem);
}

async function getMemberForValidation(tenantId: string, memberId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      `
        id,
        external_member_code,
        first_name,
        last_name,
        email,
        phone,
        status,
        home_branch_id,
        branches:home_branch_id (
          id,
          name
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .eq("id", memberId)
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to load member for check-in: ${error?.message ?? "Not found"}`,
    );
  }

  return normalizeMember(data as RawCheckinSearchMember);
}

async function getMembershipCandidates(tenantId: string, memberId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("member_memberships")
    .select(
      `
        id,
        status,
        payment_status,
        start_at,
        end_at,
        membership_plans (
          id,
          name,
          access_scope,
          plan_branch_access (
            branch_id
          )
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(
      `Failed to load memberships for check-in: ${error.message}`,
    );
  }

  return ((data ?? []) as RawMembershipCandidate[]).map(
    normalizeMembershipCandidate,
  );
}

async function getPassCandidates(tenantId: string, memberId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("member_passes")
    .select(
      `
        id,
        status,
        payment_status,
        start_at,
        end_at,
        remaining_uses,
        passes (
          id,
          name,
          access_scope,
          pass_branch_access (
            branch_id
          )
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(`Failed to load passes for check-in: ${error.message}`);
  }

  return ((data ?? []) as RawPassCandidate[]).map(normalizePassCandidate);
}

export async function validateMemberCheckin(input: {
  tenantId: string;
  memberId: string;
  branchId: string;
}) {
  const [member, memberships, passes] = await Promise.all([
    getMemberForValidation(input.tenantId, input.memberId),
    getMembershipCandidates(input.tenantId, input.memberId),
    getPassCandidates(input.tenantId, input.memberId),
  ]);

  if (member.status !== "active") {
    return {
      ok: false,
      reason: "Member record is not active.",
      member,
    } satisfies CheckinValidationResult;
  }

  for (const membership of memberships) {
    const status = computeMembershipStatus({
      status: membership.status,
      paymentStatus: membership.payment_status,
      startAt: membership.start_at,
      endAt: membership.end_at,
    });

    const plan = membership.membership_plans;

    if (!plan) {
      continue;
    }

    if (status !== "active" && status !== "trial") {
      continue;
    }

    if (
      !canUseScopedProduct(
        plan.access_scope,
        plan.plan_branch_access,
        input.branchId,
      )
    ) {
      continue;
    }

    return {
      ok: true,
      reason: "Check-in allowed via active membership.",
      member,
      membershipId: membership.id,
      sourceLabel: plan.name,
    } satisfies CheckinValidationResult;
  }

  for (const memberPass of passes) {
    const status = computeMembershipStatus({
      status: memberPass.status,
      paymentStatus: memberPass.payment_status,
      startAt: memberPass.start_at,
      endAt: memberPass.end_at,
    });

    const pass = memberPass.passes;

    if (!pass) {
      continue;
    }

    if ((memberPass.remaining_uses ?? 1) <= 0) {
      continue;
    }

    if (status !== "active" && status !== "trial") {
      continue;
    }

    if (
      !canUseScopedProduct(
        pass.access_scope,
        pass.pass_branch_access,
        input.branchId,
      )
    ) {
      continue;
    }

    return {
      ok: true,
      reason: "Check-in allowed via active pass.",
      member,
      memberPassId: memberPass.id,
      sourceLabel: pass.name,
    } satisfies CheckinValidationResult;
  }

  return {
    ok: false,
    reason: "No active membership or pass allows access at this branch.",
    member,
  } satisfies CheckinValidationResult;
}

export async function createManualCheckin(input: {
  tenantId: string;
  branchId: string;
  memberId: string;
  createdBy?: string;
}) {
  const supabase = await createReadOnlyClient();
  const validation = await validateMemberCheckin({
    tenantId: input.tenantId,
    branchId: input.branchId,
    memberId: input.memberId,
  });

  const { error } = await supabase.from("checkins").insert({
    tenant_id: input.tenantId,
    branch_id: input.branchId,
    member_id: input.memberId,
    checkin_method: "manual",
    result: validation.ok ? "success" : "failed",
    result_reason: validation.reason,
    source_membership_id: validation.membershipId ?? null,
    source_member_pass_id: validation.memberPassId ?? null,
    created_by: input.createdBy || null,
  });

  if (error) {
    throw new Error(`Failed to record check-in: ${error.message}`);
  }

  if (validation.ok && validation.memberPassId) {
    const { data: passRow, error: passError } = await supabase
      .from("member_passes")
      .select("remaining_uses")
      .eq("tenant_id", input.tenantId)
      .eq("id", validation.memberPassId)
      .single();

    if (passError) {
      throw new Error(`Failed to load pass usage state: ${passError.message}`);
    }

    if (typeof passRow.remaining_uses === "number") {
      const nextUses = Math.max(0, passRow.remaining_uses - 1);
      const { error: updatePassError } = await supabase
        .from("member_passes")
        .update({
          remaining_uses: nextUses,
        })
        .eq("tenant_id", input.tenantId)
        .eq("id", validation.memberPassId);

      if (updatePassError) {
        throw new Error(
          `Failed to update remaining pass uses: ${updatePassError.message}`,
        );
      }
    }
  }

  return validation;
}
