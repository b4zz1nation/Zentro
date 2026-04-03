import { createReadOnlyClient } from "@/lib/supabase/server";

export type PassRecord = {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  price: number;
  validity_unit: string;
  validity_value: number;
  usage_limit: number | null;
  access_scope: "all_branches" | "selected_branches";
  status: "active" | "inactive" | "archived";
  created_at: string;
  assignment_count?: number;
};

type RawPassRecord = PassRecord & {
  pass_branch_access?: Array<{
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

function addValidity(startAt: Date, validityUnit: string, validityValue: number) {
  const next = new Date(startAt);

  if (validityUnit === "day" || validityUnit === "days") {
    next.setDate(next.getDate() + validityValue);
    return next;
  }

  if (validityUnit === "week" || validityUnit === "weeks") {
    next.setDate(next.getDate() + validityValue * 7);
    return next;
  }

  if (validityUnit === "month" || validityUnit === "months") {
    next.setMonth(next.getMonth() + validityValue);
    return next;
  }

  if (validityUnit === "year" || validityUnit === "years") {
    next.setFullYear(next.getFullYear() + validityValue);
    return next;
  }

  next.setDate(next.getDate() + validityValue);
  return next;
}

export async function listPasses(tenantId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("passes")
    .select(
      `
        id,
        tenant_id,
        name,
        description,
        price,
        validity_unit,
        validity_value,
        usage_limit,
        access_scope,
        status,
        created_at,
        pass_branch_access (
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
    throw new Error(`Failed to load passes: ${error.message}`);
  }

  const passes = (data ?? []) as RawPassRecord[];
  const { data: assignments, error: assignmentError } = await supabase
    .from("member_passes")
    .select("pass_id")
    .eq("tenant_id", tenantId);

  if (assignmentError) {
    throw new Error(
      `Failed to load pass assignments: ${assignmentError.message}`,
    );
  }

  const assignmentCounts = new Map<string, number>();

  for (const row of assignments ?? []) {
    const passId = row.pass_id as string;
    assignmentCounts.set(passId, (assignmentCounts.get(passId) ?? 0) + 1);
  }

  return passes.map((pass) => ({
    ...pass,
    assignment_count: assignmentCounts.get(pass.id) ?? 0,
  }));
}

export async function createPass(input: {
  tenantId: string;
  name: string;
  description?: string;
  price: number;
  validityUnit: string;
  validityValue: number;
  usageLimit?: number | null;
  accessScope: "all_branches" | "selected_branches";
  branchIds: string[];
}) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("passes")
    .insert({
      tenant_id: input.tenantId,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      validity_unit: input.validityUnit,
      validity_value: input.validityValue,
      usage_limit: input.usageLimit ?? null,
      access_scope: input.accessScope,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to create pass: ${error?.message ?? "Unknown error"}`,
    );
  }

  if (input.accessScope === "selected_branches" && input.branchIds.length > 0) {
    const { error: branchError } = await supabase
      .from("pass_branch_access")
      .insert(
        input.branchIds.map((branchId) => ({
          pass_id: data.id,
          branch_id: branchId,
        })),
      );

    if (branchError) {
      throw new Error(`Failed to assign pass branches: ${branchError.message}`);
    }
  }

  return data.id as string;
}

export async function updatePass(input: {
  tenantId: string;
  passId: string;
  name: string;
  description?: string;
  price: number;
  validityUnit: string;
  validityValue: number;
  usageLimit?: number | null;
  accessScope: "all_branches" | "selected_branches";
  branchIds: string[];
}) {
  const supabase = await createReadOnlyClient();
  const { error } = await supabase
    .from("passes")
    .update({
      name: input.name.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      validity_unit: input.validityUnit,
      validity_value: input.validityValue,
      usage_limit: input.usageLimit ?? null,
      access_scope: input.accessScope,
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", input.passId);

  if (error) {
    throw new Error(`Failed to update pass: ${error.message}`);
  }

  const { error: clearBranchError } = await supabase
    .from("pass_branch_access")
    .delete()
    .eq("pass_id", input.passId);

  if (clearBranchError) {
    throw new Error(
      `Failed to update pass branches: ${clearBranchError.message}`,
    );
  }

  if (input.accessScope === "selected_branches" && input.branchIds.length > 0) {
    const { error: branchError } = await supabase
      .from("pass_branch_access")
      .insert(
        input.branchIds.map((branchId) => ({
          pass_id: input.passId,
          branch_id: branchId,
        })),
      );

    if (branchError) {
      throw new Error(`Failed to assign pass branches: ${branchError.message}`);
    }
  }
}

export async function updatePassStatus(input: {
  tenantId: string;
  passId: string;
  status: "active" | "inactive" | "archived";
}) {
  const supabase = await createReadOnlyClient();
  const { error } = await supabase
    .from("passes")
    .update({
      status: input.status,
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", input.passId);

  if (error) {
    throw new Error(`Failed to update pass status: ${error.message}`);
  }
}

export async function deletePass(input: { tenantId: string; passId: string }) {
  const supabase = await createReadOnlyClient();
  const { error } = await supabase
    .from("passes")
    .delete()
    .eq("tenant_id", input.tenantId)
    .eq("id", input.passId);

  if (error) {
    if (error.code === "23503") {
      throw new Error(
        "This pass is already assigned to members and cannot be deleted.",
      );
    }

    throw new Error(`Failed to delete pass: ${error.message}`);
  }
}

export async function assignPass(input: {
  tenantId: string;
  memberId: string;
  passId: string;
  createdBy?: string;
}) {
  const supabase = await createReadOnlyClient();
  const { data: pass, error: passError } = await supabase
    .from("passes")
    .select("validity_unit, validity_value, usage_limit, status")
    .eq("tenant_id", input.tenantId)
    .eq("id", input.passId)
    .single();

  if (passError || !pass) {
    throw new Error(
      `Failed to load pass for assignment: ${passError?.message ?? "Unknown error"}`,
    );
  }

  if (pass.status !== "active") {
    throw new Error("Only active passes can be assigned to members.");
  }

  const startAt = new Date();
  const endAt = addValidity(startAt, pass.validity_unit, pass.validity_value);

  const { data, error } = await supabase
    .from("member_passes")
    .insert({
      tenant_id: input.tenantId,
      member_id: input.memberId,
      pass_id: input.passId,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      remaining_uses: pass.usage_limit,
      status: "active",
      payment_status: "pending",
      created_by: input.createdBy || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to assign pass: ${error?.message ?? "Unknown error"}`,
    );
  }

  return data.id as string;
}
