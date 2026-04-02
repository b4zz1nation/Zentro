import { getAuthContext } from "@/lib/auth/profile";
import type { AppRole } from "@/lib/auth/types";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const context = await getAuthContext();

  if (!context) {
    redirect("/login");
  }

  return context;
}

export async function requireWorkspace() {
  const context = await requireAuth();

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  return context;
}

export async function requireRole(allowedRoles: AppRole[]) {
  const context = await requireWorkspace();

  if (!allowedRoles.includes(context.role)) {
    redirect("/app/dashboard");
  }

  return context;
}
