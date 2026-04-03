import { membershipHistoryLabel } from "@/lib/memberships/status";
import { createReadOnlyClient } from "@/lib/supabase/server";

export type MemberRecord = {
  id: string;
  tenant_id: string;
  user_id: string | null;
  home_branch_id: string | null;
  external_member_code: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  notes: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  status: "active" | "inactive" | "archived";
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  branches?: {
    id: string;
    name: string;
    code: string | null;
  } | null;
};

export type MemberHistoryItem = {
  id: string;
  label: string;
  detail: string;
  created_at: string;
};

type RawMemberRecord = Omit<MemberRecord, "branches"> & {
  branches?:
    | {
        id: string;
        name: string;
        code: string | null;
      }
    | {
        id: string;
        name: string;
        code: string | null;
      }[]
    | null;
};

function normalizeMember(input: RawMemberRecord): MemberRecord {
  return {
    ...input,
    branches: Array.isArray(input.branches)
      ? (input.branches[0] ?? null)
      : input.branches,
  };
}

async function generateMemberCode(tenantId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("members")
    .select("external_member_code")
    .eq("tenant_id", tenantId)
    .not("external_member_code", "is", null)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(`Failed to generate member code: ${error.message}`);
  }

  const maxNumber = (data ?? []).reduce((highest, item) => {
    const match = item.external_member_code?.match(/(\d+)$/);
    const current = match ? Number.parseInt(match[1] ?? "0", 10) : 0;
    return Number.isFinite(current) ? Math.max(highest, current) : highest;
  }, 0);

  return `M-${String(maxNumber + 1).padStart(4, "0")}`;
}

async function findWorkspaceUserIdByEmail(tenantId: string, email?: string) {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("users")
    .select(
      `
        id,
        user_roles (
          tenant_id
        )
      `,
    )
    .eq("email", normalizedEmail)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to resolve workspace user: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const roles = Array.isArray(data.user_roles) ? data.user_roles : [];
  const belongsToTenant = roles.some((role) => role.tenant_id === tenantId);

  return belongsToTenant ? (data.id as string) : null;
}

export async function listMembers(tenantId: string, query?: string) {
  const supabase = await createReadOnlyClient();
  let builder = supabase
    .from("members")
    .select(
      `
        id,
        tenant_id,
        user_id,
        home_branch_id,
        external_member_code,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        gender,
        notes,
        emergency_contact_name,
        emergency_contact_phone,
        status,
        archived_at,
        created_at,
        updated_at,
        branches:home_branch_id (
          id,
          name,
          code
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  const search = query?.trim();

  if (search) {
    builder = builder.or(
      [
        `first_name.ilike.%${search}%`,
        `last_name.ilike.%${search}%`,
        `email.ilike.%${search}%`,
        `phone.ilike.%${search}%`,
        `external_member_code.ilike.%${search}%`,
      ].join(","),
    );
  }

  const { data, error } = await builder.limit(50);

  if (error) {
    throw new Error(`Failed to load members: ${error.message}`);
  }

  return ((data ?? []) as RawMemberRecord[]).map(normalizeMember);
}

export async function getMemberById(memberId: string, tenantId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      `
        id,
        tenant_id,
        user_id,
        home_branch_id,
        external_member_code,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        gender,
        notes,
        emergency_contact_name,
        emergency_contact_phone,
        status,
        archived_at,
        created_at,
        updated_at,
        branches:home_branch_id (
          id,
          name,
          code
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .eq("id", memberId)
    .single();

  if (error || !data) {
    throw new Error(`Failed to load member: ${error?.message ?? "Not found"}`);
  }

  return normalizeMember(data as RawMemberRecord);
}

export async function createMember(input: {
  tenantId: string;
  homeBranchId?: string;
  externalMemberCode?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  notes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}) {
  const supabase = await createReadOnlyClient();
  const externalMemberCode =
    input.externalMemberCode?.trim() ||
    (await generateMemberCode(input.tenantId));
  const userId = await findWorkspaceUserIdByEmail(input.tenantId, input.email);
  const { data, error } = await supabase
    .from("members")
    .insert({
      tenant_id: input.tenantId,
      user_id: userId,
      home_branch_id: input.homeBranchId || null,
      external_member_code: externalMemberCode,
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      date_of_birth: input.dateOfBirth || null,
      gender: input.gender?.trim() || null,
      notes: input.notes?.trim() || null,
      emergency_contact_name: input.emergencyContactName?.trim() || null,
      emergency_contact_phone: input.emergencyContactPhone?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      throw new Error("A member code collision occurred. Please submit again.");
    }
    throw new Error(
      `Failed to create member: ${error?.message ?? "Unknown error"}`,
    );
  }

  return data.id as string;
}

export async function updateMember(input: {
  tenantId: string;
  memberId: string;
  homeBranchId?: string;
  externalMemberCode?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  notes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}) {
  const supabase = await createReadOnlyClient();
  const userId = await findWorkspaceUserIdByEmail(input.tenantId, input.email);
  const { error } = await supabase
    .from("members")
    .update({
      user_id: userId,
      home_branch_id: input.homeBranchId || null,
      external_member_code: input.externalMemberCode || null,
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      date_of_birth: input.dateOfBirth || null,
      gender: input.gender?.trim() || null,
      notes: input.notes?.trim() || null,
      emergency_contact_name: input.emergencyContactName?.trim() || null,
      emergency_contact_phone: input.emergencyContactPhone?.trim() || null,
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", input.memberId);

  if (error) {
    throw new Error(`Failed to update member: ${error.message}`);
  }
}

export async function archiveMember(input: {
  tenantId: string;
  memberId: string;
}) {
  const supabase = await createReadOnlyClient();
  const { error } = await supabase
    .from("members")
    .update({
      status: "archived",
      archived_at: new Date().toISOString(),
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", input.memberId);

  if (error) {
    throw new Error(`Failed to archive member: ${error.message}`);
  }
}

export async function listMemberCheckins(tenantId: string, memberId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("checkins")
    .select("id, result, result_reason, created_at")
    .eq("tenant_id", tenantId)
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(`Failed to load member check-ins: ${error.message}`);
  }

  return (
    (data ?? []) as Array<{
      id: string;
      result: string;
      result_reason: string | null;
      created_at: string;
    }>
  ).map(
    (item): MemberHistoryItem => ({
      id: item.id,
      label: item.result === "success" ? "Check-in success" : "Check-in failed",
      detail: item.result_reason || "No reason recorded",
      created_at: item.created_at,
    }),
  );
}

export async function listMemberPayments(tenantId: string, memberId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("payments")
    .select("id, amount, currency, payment_type, paid_at")
    .eq("tenant_id", tenantId)
    .eq("member_id", memberId)
    .order("paid_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(`Failed to load member payments: ${error.message}`);
  }

  return (
    (data ?? []) as Array<{
      id: string;
      amount: number;
      currency: string;
      payment_type: string;
      paid_at: string;
    }>
  ).map(
    (item): MemberHistoryItem => ({
      id: item.id,
      label: item.payment_type.replaceAll("_", " "),
      detail: `${item.currency} ${item.amount}`,
      created_at: item.paid_at,
    }),
  );
}

export async function listMemberMembershipHistory(
  tenantId: string,
  memberId: string,
) {
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
          name
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(`Failed to load membership history: ${error.message}`);
  }

  return (
    (data ?? []) as Array<{
      id: string;
      status: string;
      payment_status: string;
      start_at: string;
      end_at: string;
      membership_plans: { name: string } | { name: string }[] | null;
    }>
  ).map((item): MemberHistoryItem => {
    const plan = Array.isArray(item.membership_plans)
      ? item.membership_plans[0]
      : item.membership_plans;

    return {
      id: item.id,
      label: plan?.name || "Membership",
      detail: `${membershipHistoryLabel({
        status: item.status as
          | "active"
          | "expired"
          | "inactive"
          | "suspended"
          | "frozen"
          | "pending_payment"
          | "trial",
        paymentStatus: item.payment_status,
        startAt: item.start_at,
        endAt: item.end_at,
      })} | ${item.start_at.slice(0, 10)} to ${item.end_at.slice(0, 10)}`,
      created_at: item.start_at,
    };
  });
}

export async function listMemberPassHistory(
  tenantId: string,
  memberId: string,
) {
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
          name
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(`Failed to load pass history: ${error.message}`);
  }

  return (
    (data ?? []) as Array<{
      id: string;
      status: string;
      payment_status: string;
      start_at: string;
      end_at: string;
      remaining_uses: number | null;
      passes: { name: string } | { name: string }[] | null;
    }>
  ).map((item): MemberHistoryItem => {
    const pass = Array.isArray(item.passes) ? item.passes[0] : item.passes;

    return {
      id: item.id,
      label: pass?.name || "Pass",
      detail: `${membershipHistoryLabel({
        status: item.status as
          | "active"
          | "expired"
          | "inactive"
          | "suspended"
          | "frozen"
          | "pending_payment"
          | "trial",
        paymentStatus: item.payment_status,
        startAt: item.start_at,
        endAt: item.end_at,
      })} | ${item.remaining_uses ?? "unlimited"} use(s) remaining`,
      created_at: item.start_at,
    };
  });
}
