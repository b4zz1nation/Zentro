import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createReadOnlyClient } from "@/lib/supabase/server";

type BranchRow = {
  id: string;
  name: string;
  code: string | null;
};

type InvitationRow = {
  id: string;
  email: string;
  role: "staff" | "gym_owner" | "member" | "super_admin";
  branch_scope_type: "all" | "selected";
  status: "pending" | "accepted" | "expired" | "revoked";
  token: string;
  expires_at: string;
  created_at: string;
  invitation_branches?: Array<{
    branch_id: string;
    branches?: BranchRow | BranchRow[] | null;
  }>;
};

export async function listWorkspaceBranches(tenantId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("branches")
    .select("id, name, code")
    .eq("tenant_id", tenantId)
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load branches: ${error.message}`);
  }

  return (data ?? []) as BranchRow[];
}

export async function listWorkspaceInvitations(tenantId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("invitations")
    .select(
      `
        id,
        email,
        role,
        branch_scope_type,
        status,
        token,
        expires_at,
        created_at,
        invitation_branches (
          branch_id,
          branches (
            id,
            name,
            code
          )
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load invitations: ${error.message}`);
  }

  return (data ?? []) as InvitationRow[];
}

export async function createStaffInvitation(input: {
  tenantId: string;
  actorUserId: string;
  email: string;
  branchScopeType: "all" | "selected";
  branchIds: string[];
}) {
  const admin = createAdminClient();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data: invitation, error } = await admin
    .from("invitations")
    .insert({
      tenant_id: input.tenantId,
      email: input.email.trim().toLowerCase(),
      role: "staff",
      branch_scope_type: input.branchScopeType,
      status: "pending",
      expires_at: expiresAt.toISOString(),
      created_by: input.actorUserId,
    })
    .select("id, token")
    .single();

  if (error || !invitation) {
    throw new Error(
      `Failed to create invitation: ${error?.message ?? "Unknown error"}`,
    );
  }

  if (input.branchScopeType === "selected" && input.branchIds.length > 0) {
    const { error: branchError } = await admin
      .from("invitation_branches")
      .insert(
        input.branchIds.map((branchId) => ({
          invitation_id: invitation.id,
          branch_id: branchId,
        })),
      );

    if (branchError) {
      throw new Error(
        `Failed to save invitation branches: ${branchError.message}`,
      );
    }
  }

  return {
    inviteLink: `${env.appUrl}/accept-invite?token=${invitation.token}`,
    token: invitation.token,
  };
}

export async function getInvitationByToken(token: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("invitations")
    .select(
      `
        id,
        tenant_id,
        email,
        role,
        branch_scope_type,
        status,
        token,
        expires_at,
        invitation_branches (
          branch_id
        )
      `,
    )
    .eq("token", token)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load invitation: ${error.message}`);
  }

  return data as
    | (InvitationRow & {
        tenant_id: string;
      })
    | null;
}

export async function acceptInvitation(input: {
  token: string;
  profileId: string;
  userEmail: string | null;
}) {
  const admin = createAdminClient();
  const invitation = await getInvitationByToken(input.token);

  if (!invitation) {
    throw new Error("Invitation not found.");
  }

  if (invitation.status !== "pending") {
    throw new Error("Invitation is no longer active.");
  }

  if (new Date(invitation.expires_at).getTime() < Date.now()) {
    throw new Error("Invitation has expired.");
  }

  if (
    !input.userEmail ||
    input.userEmail.toLowerCase() !== invitation.email.toLowerCase()
  ) {
    throw new Error("Authenticated email does not match the invitation email.");
  }

  const { data: existingRole, error: existingRoleError } = await admin
    .from("user_roles")
    .select("id")
    .eq("tenant_id", invitation.tenant_id)
    .eq("user_id", input.profileId)
    .eq("role", invitation.role)
    .maybeSingle();

  if (existingRoleError) {
    throw new Error(
      `Failed to check existing role: ${existingRoleError.message}`,
    );
  }

  let roleId = existingRole?.id;

  if (!roleId) {
    const { data: insertedRole, error: roleError } = await admin
      .from("user_roles")
      .insert({
        tenant_id: invitation.tenant_id,
        user_id: input.profileId,
        role: invitation.role,
        branch_scope_type: invitation.branch_scope_type,
      })
      .select("id")
      .single();

    if (roleError || !insertedRole) {
      throw new Error(
        `Failed to create user role: ${roleError?.message ?? "Unknown error"}`,
      );
    }

    roleId = insertedRole.id;
  }

  if (invitation.branch_scope_type === "selected") {
    const branchIds = (invitation.invitation_branches ?? []).map(
      ({ branch_id }) => branch_id,
    );

    if (branchIds.length === 0) {
      throw new Error("Invitation is missing branch assignments.");
    }

    const { error: branchInsertError } = await admin
      .from("user_role_branches")
      .upsert(
        branchIds.map((branchId) => ({
          user_role_id: roleId,
          branch_id: branchId,
        })),
        {
          onConflict: "user_role_id,branch_id",
          ignoreDuplicates: true,
        },
      );

    if (branchInsertError) {
      throw new Error(
        `Failed to assign invitation branches: ${branchInsertError.message}`,
      );
    }
  }

  const { error: invitationError } = await admin
    .from("invitations")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", invitation.id);

  if (invitationError) {
    throw new Error(
      `Failed to finalize invitation: ${invitationError.message}`,
    );
  }
}
