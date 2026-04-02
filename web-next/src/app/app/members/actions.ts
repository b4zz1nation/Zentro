"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { buildPhoneNumber } from "@/lib/phone/phone";
import {
  archiveMember,
  createMember,
  updateMember,
} from "@/lib/members/service";
import { assignMembership } from "@/lib/plans/service";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export async function createMemberAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const homeBranchId = String(formData.get("homeBranchId") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = buildPhoneNumber(
    String(formData.get("phoneCountryCode") ?? "").trim(),
    String(formData.get("phoneLocalNumber") ?? "").trim(),
  );
  const dateOfBirth = String(formData.get("dateOfBirth") ?? "").trim();
  const gender = String(formData.get("gender") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const membershipPlanId = String(
    formData.get("membershipPlanId") ?? "",
  ).trim();
  const emergencyContactName = String(
    formData.get("emergencyContactName") ?? "",
  ).trim();
  const emergencyContactPhone = buildPhoneNumber(
    String(formData.get("emergencyContactPhoneCountryCode") ?? "").trim(),
    String(formData.get("emergencyContactPhoneLocalNumber") ?? "").trim(),
  );

  if (!firstName || !lastName) {
    redirect(
      "/app/members?error=" +
        encodeMessage("First name and last name are required."),
    );
  }

  try {
    const memberId = await createMember({
      tenantId: context.workspaceId,
      homeBranchId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      notes,
      emergencyContactName,
      emergencyContactPhone,
    });

    if (membershipPlanId) {
      await assignMembership({
        tenantId: context.workspaceId,
        memberId,
        membershipPlanId,
        createdBy: context.profileId,
      });
    }

    redirect(
      `/app/members/${memberId}?success=${encodeMessage(
        membershipPlanId
          ? "Member created and membership assigned successfully."
          : "Member created successfully.",
      )}`,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create member.";
    redirect("/app/members?error=" + encodeMessage(message));
  }
}

export async function updateMemberAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const memberId = String(formData.get("memberId") ?? "").trim();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const homeBranchId = String(formData.get("homeBranchId") ?? "").trim();
  const externalMemberCode = String(
    formData.get("externalMemberCode") ?? "",
  ).trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = buildPhoneNumber(
    String(formData.get("phoneCountryCode") ?? "").trim(),
    String(formData.get("phoneLocalNumber") ?? "").trim(),
  );
  const dateOfBirth = String(formData.get("dateOfBirth") ?? "").trim();
  const gender = String(formData.get("gender") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const emergencyContactName = String(
    formData.get("emergencyContactName") ?? "",
  ).trim();
  const emergencyContactPhone = buildPhoneNumber(
    String(formData.get("emergencyContactPhoneCountryCode") ?? "").trim(),
    String(formData.get("emergencyContactPhoneLocalNumber") ?? "").trim(),
  );

  if (!memberId || !firstName || !lastName) {
    redirect(
      "/app/members?error=" +
        encodeMessage("Member update is missing required fields."),
    );
  }

  try {
    await updateMember({
      tenantId: context.workspaceId,
      memberId,
      homeBranchId,
      externalMemberCode,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      notes,
      emergencyContactName,
      emergencyContactPhone,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update member.";
    redirect(`/app/members/${memberId}?error=${encodeMessage(message)}`);
  }

  redirect(
    `/app/members/${memberId}?success=${encodeMessage("Member updated successfully.")}`,
  );
}

export async function archiveMemberAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const memberId = String(formData.get("memberId") ?? "").trim();

  if (!memberId) {
    redirect(
      "/app/members?error=" + encodeMessage("Missing member to archive."),
    );
  }

  try {
    await archiveMember({
      tenantId: context.workspaceId,
      memberId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to archive member.";
    redirect(`/app/members/${memberId}?error=${encodeMessage(message)}`);
  }

  redirect("/app/members?error=" + encodeMessage("Member archived."));
}
