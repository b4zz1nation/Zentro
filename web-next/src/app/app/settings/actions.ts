"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { buildPhoneNumber } from "@/lib/phone/phone";
import { updateWorkspaceSettings } from "@/lib/tenants/settings";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export async function updateWorkspaceSettingsAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const contactPhone = buildPhoneNumber(
    String(formData.get("contactPhoneCountryCode") ?? "").trim(),
    String(formData.get("contactPhoneLocalNumber") ?? "").trim(),
  );
  const brandingPrimaryColor = String(
    formData.get("brandingPrimaryColor") ?? "",
  ).trim();

  try {
    await updateWorkspaceSettings({
      tenantId: context.workspaceId,
      name,
      slug,
      contactEmail,
      contactPhone,
      brandingPrimaryColor,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update workspace settings.";
    redirect("/app/settings?error=" + encodeMessage(message));
  }

  redirect(
    "/app/settings?success=" + encodeMessage("Workspace settings updated."),
  );
}
