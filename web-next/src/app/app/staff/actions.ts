"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { createStaffInvitation } from "@/lib/invitations/service";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export async function createInvitationAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const email = String(formData.get("email") ?? "").trim();
  const branchScopeType =
    String(formData.get("branchScopeType") ?? "selected") === "all"
      ? "all"
      : "selected";
  const branchIds = formData
    .getAll("branchIds")
    .map((value) => String(value))
    .filter(Boolean);

  if (!email) {
    redirect("/app/staff?error=" + encodeMessage("Invitation email is required."));
  }

  if (branchScopeType === "selected" && branchIds.length === 0) {
    redirect(
      "/app/staff?error=" +
        encodeMessage("Select at least one branch or choose all branches."),
    );
  }

  try {
    const result = await createStaffInvitation({
      tenantId: context.workspaceId,
      actorUserId: context.profileId,
      email,
      branchScopeType,
      branchIds,
    });

    redirect(
      "/app/staff?success=" +
        encodeMessage(`Invitation created. Share this link: ${result.inviteLink}`),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create invitation.";
    redirect("/app/staff?error=" + encodeMessage(message));
  }
}
