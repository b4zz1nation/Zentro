import type { User } from "@supabase/supabase-js";
import { cache } from "react";
import type { AppRole, AuthContext } from "@/lib/auth/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createReadOnlyClient } from "@/lib/supabase/server";

type UserProfileRow = {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  email: string | null;
};

type UserRoleRow = {
  id: string;
  role: AppRole;
  tenant_id: string;
  branch_scope_type: "all" | "selected";
  tenants:
    | {
        id: string;
        name: string;
      }
    | {
        id: string;
        name: string;
      }[]
    | null;
  user_role_branches: Array<{
    branch_id: string;
  }>;
};

function deriveFullName(user: User) {
  const metadataName =
    typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata.name === "string"
        ? user.user_metadata.name
        : null;

  return metadataName?.trim() || user.email?.split("@")[0] || "New User";
}

async function bootstrapUserProfile(user: User) {
  const admin = createAdminClient();
  const fullName = deriveFullName(user);

  const { data: inserted, error } = await admin
    .from("users")
    .insert({
      auth_user_id: user.id,
      email: user.email ?? null,
      full_name: fullName,
    })
    .select("id, auth_user_id, full_name, email")
    .single();

  if (error) {
    throw new Error(`Failed to create user profile: ${error.message}`);
  }

  return inserted satisfies UserProfileRow;
}

async function getOrCreateUserProfile(user: User) {
  const supabase = await createReadOnlyClient();
  const { data: profile, error } = await supabase
    .from("users")
    .select("id, auth_user_id, full_name, email")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load user profile: ${error.message}`);
  }

  if (profile) {
    return profile satisfies UserProfileRow;
  }

  return bootstrapUserProfile(user);
}

async function getPrimaryUserRole(profileId: string) {
  const supabase = await createReadOnlyClient();
  const { data: roles, error } = await supabase
    .from("user_roles")
    .select(
      `
        id,
        role,
        tenant_id,
        branch_scope_type,
        tenants (
          id,
          name
        ),
        user_role_branches (
          branch_id
        )
      `,
    )
    .eq("user_id", profileId)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load user roles: ${error.message}`);
  }

  const firstRole = ((roles ?? [])[0] ?? null) as UserRoleRow | null;

  if (!firstRole) {
    return null;
  }

  return {
    ...firstRole,
    tenants: Array.isArray(firstRole.tenants)
      ? (firstRole.tenants[0] ?? null)
      : firstRole.tenants,
  };
}

export const getAuthContext = cache(
  async function getAuthContext(): Promise<AuthContext | null> {
    const supabase = await createReadOnlyClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      const message = error.message.toLowerCase();

      // Missing or expired sessions should behave like signed-out state,
      // not crash the route through the app error boundary.
      if (
        message.includes("auth session missing") ||
        message.includes("session") ||
        message.includes("jwt")
      ) {
        return null;
      }

      throw new Error(`Failed to resolve authenticated user: ${error.message}`);
    }

    if (!user) {
      return null;
    }

    const profile = await getOrCreateUserProfile(user);
    const primaryRole = await getPrimaryUserRole(profile.id);

    return {
      authUserId: user.id,
      profileId: profile.id,
      email: profile.email ?? user.email ?? null,
      fullName: profile.full_name,
      role: primaryRole?.role ?? "member",
      workspaceId: primaryRole?.tenant_id,
      workspaceName: primaryRole?.tenants?.name,
      branchIds:
        primaryRole?.branch_scope_type === "all"
          ? []
          : (primaryRole?.user_role_branches ?? []).map(
              ({ branch_id }) => branch_id,
            ),
    };
  },
);
