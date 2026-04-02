import { createAdminClient } from "@/lib/supabase/admin";

type CreateOwnerWorkspaceInput = {
  profileId: string;
  workspaceName: string;
  workspaceSlug: string;
  contactEmail?: string;
  contactPhone?: string;
  brandingPrimaryColor?: string;
  branchName: string;
  branchAddress?: string;
  branchCode?: string;
};

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export async function createOwnerWorkspace(input: CreateOwnerWorkspaceInput) {
  const admin = createAdminClient();
  const workspaceSlug = normalizeSlug(
    input.workspaceSlug || input.workspaceName,
  );

  if (!workspaceSlug) {
    throw new Error("Workspace slug is required.");
  }

  const { data: existingRole, error: existingRoleError } = await admin
    .from("user_roles")
    .select("id")
    .eq("user_id", input.profileId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (existingRoleError) {
    throw new Error(
      `Failed to check existing roles: ${existingRoleError.message}`,
    );
  }

  if (existingRole) {
    throw new Error("This user already belongs to a workspace.");
  }

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .insert({
      name: input.workspaceName.trim(),
      slug: workspaceSlug,
      contact_email: input.contactEmail?.trim() || null,
      contact_phone: input.contactPhone?.trim() || null,
      branding_primary_color: input.brandingPrimaryColor?.trim() || null,
    })
    .select("id, name")
    .single();

  if (tenantError || !tenant) {
    throw new Error(
      `Failed to create workspace: ${tenantError?.message ?? "Unknown error"}`,
    );
  }

  const cleanup = async () => {
    await admin.from("tenants").delete().eq("id", tenant.id);
  };

  const { data: branch, error: branchError } = await admin
    .from("branches")
    .insert({
      tenant_id: tenant.id,
      name: input.branchName.trim(),
      code: input.branchCode?.trim() || null,
      address: input.branchAddress?.trim() || null,
    })
    .select("id")
    .single();

  if (branchError || !branch) {
    await cleanup();
    throw new Error(
      `Failed to create first branch: ${branchError?.message ?? "Unknown error"}`,
    );
  }

  const { error: roleError } = await admin.from("user_roles").insert({
    tenant_id: tenant.id,
    user_id: input.profileId,
    role: "gym_owner",
    branch_scope_type: "all",
  });

  if (roleError) {
    await cleanup();
    throw new Error(`Failed to assign owner role: ${roleError.message}`);
  }

  return {
    tenantId: tenant.id,
    branchId: branch.id,
    workspaceName: tenant.name,
  };
}
