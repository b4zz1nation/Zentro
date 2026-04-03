"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import {
  assignPass,
  createPass,
  deletePass,
  updatePass,
  updatePassStatus,
} from "@/lib/passes/service";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

function readPassForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const validityUnit = String(formData.get("validityUnit") ?? "day").trim();
  const validityValue = Number(formData.get("validityValue") ?? 1);
  const usageLimitRaw = String(formData.get("usageLimit") ?? "").trim();
  const accessScope: "all_branches" | "selected_branches" =
    String(formData.get("accessScope") ?? "all_branches") ===
    "selected_branches"
      ? "selected_branches"
      : "all_branches";
  const branchIds = formData
    .getAll("branchIds")
    .map((value) => String(value))
    .filter(Boolean);

  return {
    name,
    description,
    price,
    validityUnit,
    validityValue,
    usageLimit:
      usageLimitRaw === "" ? null : Number.isNaN(Number(usageLimitRaw)) ? null : Number(usageLimitRaw),
    accessScope,
    branchIds,
  };
}

function validatePassInput(input: ReturnType<typeof readPassForm>) {
  if (
    !input.name ||
    Number.isNaN(input.price) ||
    input.price < 0 ||
    Number.isNaN(input.validityValue) ||
    input.validityValue <= 0
  ) {
    return "Pass name, price, and validity are required.";
  }

  if (
    input.usageLimit !== null &&
    (Number.isNaN(input.usageLimit) || input.usageLimit <= 0)
  ) {
    return "Usage limit must be greater than zero when provided.";
  }

  if (
    input.accessScope === "selected_branches" &&
    input.branchIds.length === 0
  ) {
    return "Select at least one branch for branch-restricted passes.";
  }

  return null;
}

export async function createPassAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const input = readPassForm(formData);
  const validationError = validatePassInput(input);

  if (validationError) {
    redirect("/app/passes?error=" + encodeMessage(validationError));
  }

  try {
    await createPass({
      tenantId: context.workspaceId,
      ...input,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create pass.";
    redirect("/app/passes?error=" + encodeMessage(message));
  }

  redirect("/app/passes?success=" + encodeMessage("Pass created successfully."));
}

export async function updatePassAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const passId = String(formData.get("passId") ?? "").trim();
  const input = readPassForm(formData);
  const validationError = validatePassInput(input);

  if (!passId || validationError) {
    redirect(
      "/app/passes?error=" +
        encodeMessage(validationError ?? "Missing pass to update."),
    );
  }

  try {
    await updatePass({
      tenantId: context.workspaceId,
      passId,
      ...input,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update pass.";
    redirect("/app/passes?error=" + encodeMessage(message));
  }

  redirect("/app/passes?success=" + encodeMessage("Pass updated successfully."));
}

export async function deletePassAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const passId = String(formData.get("passId") ?? "").trim();

  if (!passId) {
    redirect("/app/passes?error=" + encodeMessage("Missing pass to delete."));
  }

  try {
    await deletePass({
      tenantId: context.workspaceId,
      passId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete pass.";
    redirect("/app/passes?error=" + encodeMessage(message));
  }

  redirect("/app/passes?success=" + encodeMessage("Pass deleted successfully."));
}

export async function changePassStatusAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const passId = String(formData.get("passId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (
    !passId ||
    (status !== "active" && status !== "inactive" && status !== "archived")
  ) {
    redirect("/app/passes?error=" + encodeMessage("Invalid pass status update."));
  }

  try {
    await updatePassStatus({
      tenantId: context.workspaceId,
      passId,
      status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update pass status.";
    redirect("/app/passes?error=" + encodeMessage(message));
  }

  redirect("/app/passes?success=" + encodeMessage("Pass status updated."));
}

export async function assignPassAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const memberId = String(formData.get("memberId") ?? "").trim();
  const passId = String(formData.get("passId") ?? "").trim();

  if (!memberId || !passId) {
    redirect(
      `/app/members/${memberId || ""}?error=${encodeMessage("Pass assignment requires a member and a pass.")}`,
    );
  }

  try {
    await assignPass({
      tenantId: context.workspaceId,
      memberId,
      passId,
      createdBy: context.profileId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to assign pass.";
    redirect(`/app/members/${memberId}?error=${encodeMessage(message)}`);
  }

  redirect(
    `/app/members/${memberId}?success=${encodeMessage("Pass assigned successfully.")}`,
  );
}
