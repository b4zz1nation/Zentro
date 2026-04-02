import { createReadOnlyClient } from "@/lib/supabase/server";

export type MembershipPlanRecord = {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  price: number;
  duration_unit: string;
  duration_value: number;
  supports_renewal: boolean;
  supports_extension: boolean;
  supports_freeze: boolean;
  supports_suspension: boolean;
  access_scope: "all_branches" | "selected_branches";
  status: "active" | "inactive" | "archived";
  created_at: string;
  assignment_count?: number;
};

type RawPlanRecord = MembershipPlanRecord & {
  plan_branch_access?: Array<{
    branch_id: string;
    branches?:
      | {
          id: string;
          name: string;
        }
      | {
          id: string;
          name: string;
        }[]
      | null;
  }>;
};

export async function listPlans(tenantId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("membership_plans")
    .select(
      `
        id,
        tenant_id,
        name,
        description,
        price,
        duration_unit,
        duration_value,
        supports_renewal,
        supports_extension,
        supports_freeze,
        supports_suspension,
        access_scope,
        status,
        created_at,
        plan_branch_access (
          branch_id,
          branches:branch_id (
            id,
            name
          )
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load plans: ${error.message}`);
  }

  const plans = (data ?? []) as RawPlanRecord[];
  const { data: assignments, error: assignmentError } = await supabase
    .from("member_memberships")
    .select("membership_plan_id")
    .eq("tenant_id", tenantId);

  if (assignmentError) {
    throw new Error(
      `Failed to load plan assignments: ${assignmentError.message}`,
    );
  }

  const assignmentCounts = new Map<string, number>();

  for (const row of assignments ?? []) {
    const planId = row.membership_plan_id as string;
    assignmentCounts.set(planId, (assignmentCounts.get(planId) ?? 0) + 1);
  }

  return plans.map((plan) => ({
    ...plan,
    assignment_count: assignmentCounts.get(plan.id) ?? 0,
  }));
}

export async function createPlan(input: {
  tenantId: string;
  name: string;
  description?: string;
  price: number;
  durationUnit: string;
  durationValue: number;
  supportsRenewal: boolean;
  supportsExtension: boolean;
  supportsFreeze: boolean;
  supportsSuspension: boolean;
  accessScope: "all_branches" | "selected_branches";
  branchIds: string[];
}) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("membership_plans")
    .insert({
      tenant_id: input.tenantId,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      duration_unit: input.durationUnit,
      duration_value: input.durationValue,
      supports_renewal: input.supportsRenewal,
      supports_extension: input.supportsExtension,
      supports_freeze: input.supportsFreeze,
      supports_suspension: input.supportsSuspension,
      access_scope: input.accessScope,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to create plan: ${error?.message ?? "Unknown error"}`,
    );
  }

  if (input.accessScope === "selected_branches" && input.branchIds.length > 0) {
    const { error: branchError } = await supabase
      .from("plan_branch_access")
      .insert(
        input.branchIds.map((branchId) => ({
          membership_plan_id: data.id,
          branch_id: branchId,
        })),
      );

    if (branchError) {
      throw new Error(`Failed to assign plan branches: ${branchError.message}`);
    }
  }

  return data.id as string;
}

export async function updatePlan(input: {
  tenantId: string;
  planId: string;
  name: string;
  description?: string;
  price: number;
  durationUnit: string;
  durationValue: number;
  supportsRenewal: boolean;
  supportsExtension: boolean;
  supportsFreeze: boolean;
  supportsSuspension: boolean;
  accessScope: "all_branches" | "selected_branches";
  branchIds: string[];
}) {
  const supabase = await createReadOnlyClient();
  const { error } = await supabase
    .from("membership_plans")
    .update({
      name: input.name.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      duration_unit: input.durationUnit,
      duration_value: input.durationValue,
      supports_renewal: input.supportsRenewal,
      supports_extension: input.supportsExtension,
      supports_freeze: input.supportsFreeze,
      supports_suspension: input.supportsSuspension,
      access_scope: input.accessScope,
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", input.planId);

  if (error) {
    throw new Error(`Failed to update plan: ${error.message}`);
  }

  const { error: clearBranchError } = await supabase
    .from("plan_branch_access")
    .delete()
    .eq("membership_plan_id", input.planId);

  if (clearBranchError) {
    throw new Error(
      `Failed to update plan branches: ${clearBranchError.message}`,
    );
  }

  if (input.accessScope === "selected_branches" && input.branchIds.length > 0) {
    const { error: branchError } = await supabase
      .from("plan_branch_access")
      .insert(
        input.branchIds.map((branchId) => ({
          membership_plan_id: input.planId,
          branch_id: branchId,
        })),
      );

    if (branchError) {
      throw new Error(`Failed to assign plan branches: ${branchError.message}`);
    }
  }
}

export async function updatePlanStatus(input: {
  tenantId: string;
  planId: string;
  status: "active" | "inactive" | "archived";
}) {
  const supabase = await createReadOnlyClient();
  const { error } = await supabase
    .from("membership_plans")
    .update({
      status: input.status,
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", input.planId);

  if (error) {
    throw new Error(`Failed to update plan status: ${error.message}`);
  }
}

export async function deletePlan(input: { tenantId: string; planId: string }) {
  const supabase = await createReadOnlyClient();
  const { error } = await supabase
    .from("membership_plans")
    .delete()
    .eq("tenant_id", input.tenantId)
    .eq("id", input.planId);

  if (error) {
    if (error.code === "23503") {
      throw new Error(
        "This plan is already assigned to memberships and cannot be deleted.",
      );
    }

    throw new Error(`Failed to delete plan: ${error.message}`);
  }
}

export async function assignMembership(input: {
  tenantId: string;
  memberId: string;
  membershipPlanId: string;
  createdBy?: string;
}) {
  const supabase = await createReadOnlyClient();
  const { data: plan, error: planError } = await supabase
    .from("membership_plans")
    .select("duration_unit, duration_value, status")
    .eq("tenant_id", input.tenantId)
    .eq("id", input.membershipPlanId)
    .single();

  if (planError || !plan) {
    throw new Error(
      `Failed to load plan for assignment: ${planError?.message ?? "Unknown error"}`,
    );
  }

  if (plan.status !== "active") {
    throw new Error("Only active plans can be assigned to members.");
  }

  const startAt = new Date();
  const endAt = new Date(startAt);

  if (plan.duration_unit === "day" || plan.duration_unit === "days") {
    endAt.setDate(endAt.getDate() + plan.duration_value);
  } else if (plan.duration_unit === "week" || plan.duration_unit === "weeks") {
    endAt.setDate(endAt.getDate() + plan.duration_value * 7);
  } else if (
    plan.duration_unit === "month" ||
    plan.duration_unit === "months"
  ) {
    endAt.setMonth(endAt.getMonth() + plan.duration_value);
  } else if (plan.duration_unit === "year" || plan.duration_unit === "years") {
    endAt.setFullYear(endAt.getFullYear() + plan.duration_value);
  } else {
    endAt.setDate(endAt.getDate() + plan.duration_value);
  }

  const { data, error } = await supabase
    .from("member_memberships")
    .insert({
      tenant_id: input.tenantId,
      member_id: input.memberId,
      membership_plan_id: input.membershipPlanId,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      status: "active",
      payment_status: "pending",
      created_by: input.createdBy || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to assign membership: ${error?.message ?? "Unknown error"}`,
    );
  }

  return data.id as string;
}
