"use server";

import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/profile";
import { buildPhoneNumber } from "@/lib/phone/phone";
import { createOwnerWorkspace } from "@/lib/tenants/onboarding";

function toQueryError(message: string) {
  return encodeURIComponent(message);
}

export async function createWorkspaceAction(formData: FormData) {
  const context = await getAuthContext();

  if (!context) {
    redirect("/login");
  }

  if (context.workspaceId) {
    redirect("/app/dashboard");
  }

  const workspaceName = String(formData.get("workspaceName") ?? "").trim();
  const workspaceSlug = String(formData.get("workspaceSlug") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const contactPhone = buildPhoneNumber(
    String(formData.get("contactPhoneCountryCode") ?? "").trim(),
    String(formData.get("contactPhoneLocalNumber") ?? "").trim(),
  );
  const brandingPrimaryColor = String(
    formData.get("brandingPrimaryColor") ?? "",
  ).trim();
  const branchName = String(formData.get("branchName") ?? "").trim();
  const branchCode = String(formData.get("branchCode") ?? "").trim();
  const branchAddress = String(formData.get("branchAddress") ?? "").trim();

  if (!workspaceName || !branchName) {
    redirect(
      "/onboarding?error=" +
        toQueryError("Workspace name and branch name are required."),
    );
  }

  try {
    await createOwnerWorkspace({
      profileId: context.profileId,
      workspaceName,
      workspaceSlug,
      contactEmail,
      contactPhone,
      brandingPrimaryColor,
      branchName,
      branchCode,
      branchAddress,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create workspace.";
    redirect("/onboarding?error=" + toQueryError(message));
  }

  redirect("/app/dashboard");
}
