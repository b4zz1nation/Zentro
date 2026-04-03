"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import {
  freezeMembership,
  reactivateMembership,
  renewMembership,
  suspendMembership,
} from "@/lib/memberships/service";
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
  const membershipPlanId = String(
    formData.get("membershipPlanId") ?? "",
  ).trim();

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

export async function renewMembershipAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const memberId = String(formData.get("memberId") ?? "").trim();
  const membershipId = String(formData.get("membershipId") ?? "").trim();

  if (!memberId || !membershipId) {
    redirect(
      `/app/members/${memberId || ""}?error=${encodeMessage("Membership renewal requires a member and membership.")}`,
    );
  }

  try {
    await renewMembership({
      tenantId: context.workspaceId,
      membershipId,
      createdBy: context.profileId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to renew membership.";
    redirect(`/app/members/${memberId}?error=${encodeMessage(message)}`);
  }

  redirect(
    `/app/members/${memberId}?success=${encodeMessage("Membership renewed successfully.")}`,
  );
}

export async function freezeMembershipAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const memberId = String(formData.get("memberId") ?? "").trim();
  const membershipId = String(formData.get("membershipId") ?? "").trim();
  const freezeDays = Number(formData.get("freezeDays") ?? 7);

  if (!memberId || !membershipId) {
    redirect(
      `/app/members/${memberId || ""}?error=${encodeMessage("Membership freeze requires a member and membership.")}`,
    );
  }

  try {
    await freezeMembership({
      tenantId: context.workspaceId,
      membershipId,
      freezeDays,
      createdBy: context.profileId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to freeze membership.";
    redirect(`/app/members/${memberId}?error=${encodeMessage(message)}`);
  }

  redirect(
    `/app/members/${memberId}?success=${encodeMessage("Membership frozen successfully.")}`,
  );
}

export async function suspendMembershipAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const memberId = String(formData.get("memberId") ?? "").trim();
  const membershipId = String(formData.get("membershipId") ?? "").trim();

  if (!memberId || !membershipId) {
    redirect(
      `/app/members/${memberId || ""}?error=${encodeMessage("Membership suspension requires a member and membership.")}`,
    );
  }

  try {
    await suspendMembership({
      tenantId: context.workspaceId,
      membershipId,
      createdBy: context.profileId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to suspend membership.";
    redirect(`/app/members/${memberId}?error=${encodeMessage(message)}`);
  }

  redirect(
    `/app/members/${memberId}?success=${encodeMessage("Membership suspended successfully.")}`,
  );
}

export async function reactivateMembershipAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const memberId = String(formData.get("memberId") ?? "").trim();
  const membershipId = String(formData.get("membershipId") ?? "").trim();

  if (!memberId || !membershipId) {
    redirect(
      `/app/members/${memberId || ""}?error=${encodeMessage("Membership reactivation requires a member and membership.")}`,
    );
  }

  try {
    await reactivateMembership({
      tenantId: context.workspaceId,
      membershipId,
      createdBy: context.profileId,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to reactivate membership.";
    redirect(`/app/members/${memberId}?error=${encodeMessage(message)}`);
  }

  redirect(
    `/app/members/${memberId}?success=${encodeMessage("Membership reactivated successfully.")}`,
  );
}
