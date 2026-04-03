import { createReadOnlyClient } from "@/lib/supabase/server";

export type BranchRecord = {
  id: string;
  tenant_id: string;
  name: string;
  code: string | null;
  address: string | null;
  status: "active" | "inactive" | "archived";
  created_at: string;
  updated_at: string;
};

export async function listBranches(tenantId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("branches")
    .select("id, tenant_id, name, code, address, status, created_at, updated_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load branches: ${error.message}`);
  }

  return (data ?? []) as BranchRecord[];
}

export async function createBranch(input: {
  tenantId: string;
  name: string;
  code?: string;
  address?: string;
}) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("branches")
    .insert({
      tenant_id: input.tenantId,
      name: input.name.trim(),
      code: input.code?.trim() || null,
      address: input.address?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create branch: ${error?.message ?? "Unknown error"}`);
  }

  return data.id as string;
}

export async function updateBranch(input: {
  tenantId: string;
  branchId: string;
  name: string;
  code?: string;
  address?: string;
}) {
  const supabase = await createReadOnlyClient();
  const { error } = await supabase
    .from("branches")
    .update({
      name: input.name.trim(),
      code: input.code?.trim() || null,
      address: input.address?.trim() || null,
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", input.branchId);

  if (error) {
    throw new Error(`Failed to update branch: ${error.message}`);
  }
}

export async function updateBranchStatus(input: {
  tenantId: string;
  branchId: string;
  status: "active" | "inactive" | "archived";
}) {
  const supabase = await createReadOnlyClient();
  const { error } = await supabase
    .from("branches")
    .update({
      status: input.status,
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", input.branchId);

  if (error) {
    throw new Error(`Failed to update branch status: ${error.message}`);
  }
}
