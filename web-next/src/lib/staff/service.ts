import { createAdminClient } from "@/lib/supabase/admin";
import { createReadOnlyClient } from "@/lib/supabase/server";

export type StaffRoleRecord = {
  id: string;
  tenant_id: string;
  user_id: string;
  role: "staff" | "gym_owner" | "member" | "super_admin";
  branch_scope_type: "all" | "selected";
  status: "active" | "inactive" | "archived";
  created_at: string;
  users:
    | {
        id: string;
        full_name: string;
        email: string;
      }
    | null;
  user_role_branches: Array<{
    branch_id: string;
    branches:
      | {
          id: string;
          name: string;
          code: string | null;
        }
      | null;
  }>;
};

type RawStaffRoleRecord = Omit<StaffRoleRecord, "users" | "user_role_branches"> & {
  users:
    | StaffRoleRecord["users"]
    | StaffRoleRecord["users"][]
    | null;
  user_role_branches?: Array<{
    branch_id: string;
    branches:
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
  }>;
};

export async function listStaffRoles(tenantId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("user_roles")
    .select(
      `
        id,
        tenant_id,
        user_id,
        role,
        branch_scope_type,
        status,
        created_at,
        users:user_id (
          id,
          full_name,
          email
        ),
        user_role_branches (
          branch_id,
          branches:branch_id (
            id,
            name,
            code
          )
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .in("role", ["staff", "gym_owner"])
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load staff roles: ${error.message}`);
  }

  return ((data ?? []) as RawStaffRoleRecord[]).map((item) => ({
    ...item,
    users: Array.isArray(item.users) ? (item.users[0] ?? null) : item.users,
    user_role_branches: (item.user_role_branches ?? []).map((branch) => ({
      branch_id: branch.branch_id,
      branches: Array.isArray(branch.branches)
        ? (branch.branches[0] ?? null)
        : branch.branches,
    })),
  }));
}

export async function updateStaffRole(input: {
  roleId: string;
  tenantId: string;
  branchScopeType: "all" | "selected";
  status: "active" | "inactive" | "archived";
  branchIds: string[];
}) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("user_roles")
    .update({
      branch_scope_type: input.branchScopeType,
      status: input.status,
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", input.roleId);

  if (error) {
    throw new Error(`Failed to update staff role: ${error.message}`);
  }

  const { error: clearError } = await admin
    .from("user_role_branches")
    .delete()
    .eq("user_role_id", input.roleId);

  if (clearError) {
    throw new Error(`Failed to update role branches: ${clearError.message}`);
  }

  if (input.branchScopeType === "selected" && input.branchIds.length > 0) {
    const { error: insertError } = await admin
      .from("user_role_branches")
      .insert(
        input.branchIds.map((branchId) => ({
          user_role_id: input.roleId,
          branch_id: branchId,
        })),
      );

    if (insertError) {
      throw new Error(`Failed to save role branches: ${insertError.message}`);
    }
  }
}
