"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { assignMembership } from "@/lib/plans/service";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export async function assignMembershipAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const memberId = String(formData.get("memberId") ?? "").trim();
  const membershipPlanId = String(formData.get("membershipPlanId") ?? "").trim();

  if (!memberId || !membershipPlanId) {
    redirect(
      `/app/members/${memberId || ""}?error=${encodeMessage("Plan assignment requires a member and a plan.")}`,
    );
  }

  try {
    await assignMembership({
      tenantId: context.workspaceId,
      memberId,
      membershipPlanId,
      createdBy: context.profileId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to assign membership.";
    redirect(`/app/members/${memberId}?error=${encodeMessage(message)}`);
  }

  redirect(
    `/app/members/${memberId}?success=${encodeMessage("Membership assigned successfully.")}`,
  );
}
