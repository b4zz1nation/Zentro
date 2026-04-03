"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import {
  createBranch,
  updateBranch,
  updateBranchStatus,
} from "@/lib/branches/service";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export async function createBranchAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!name) {
    redirect("/app/branches?error=" + encodeMessage("Branch name is required."));
  }

  try {
    await createBranch({
      tenantId: context.workspaceId,
      name,
      code,
      address,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create branch.";
    redirect("/app/branches?error=" + encodeMessage(message));
  }

  redirect("/app/branches?success=" + encodeMessage("Branch created successfully."));
}

export async function updateBranchAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const branchId = String(formData.get("branchId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!branchId || !name) {
    redirect("/app/branches?error=" + encodeMessage("Branch update is missing required fields."));
  }

  try {
    await updateBranch({
      tenantId: context.workspaceId,
      branchId,
      name,
      code,
      address,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update branch.";
    redirect("/app/branches?error=" + encodeMessage(message));
  }

  redirect("/app/branches?success=" + encodeMessage("Branch updated successfully."));
}

export async function updateBranchStatusAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const branchId = String(formData.get("branchId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (
    !branchId ||
    (status !== "active" && status !== "inactive" && status !== "archived")
  ) {
    redirect("/app/branches?error=" + encodeMessage("Invalid branch status update."));
  }

  try {
    await updateBranchStatus({
      tenantId: context.workspaceId,
      branchId,
      status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update branch status.";
    redirect("/app/branches?error=" + encodeMessage(message));
  }

  redirect("/app/branches?success=" + encodeMessage("Branch status updated."));
}
