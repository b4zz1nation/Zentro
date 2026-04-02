"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { getPlanPreset } from "@/lib/plans/presets";
import {
  createPlan,
  deletePlan,
  updatePlan,
  updatePlanStatus,
} from "@/lib/plans/service";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

function readPlanForm(formData: FormData) {
  const preset = getPlanPreset(String(formData.get("planPreset") ?? "").trim());
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
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
    preset,
    description,
    price,
    accessScope,
    branchIds,
    supportsRenewal: formData.get("supportsRenewal") === "on",
    supportsExtension: formData.get("supportsExtension") === "on",
    supportsFreeze: formData.get("supportsFreeze") === "on",
    supportsSuspension: formData.get("supportsSuspension") === "on",
  };
}

function validatePlanInput(input: ReturnType<typeof readPlanForm>) {
  if (!input.preset || Number.isNaN(input.price) || input.price < 0) {
    return "Plan type and price are required.";
  }

  if (
    input.accessScope === "selected_branches" &&
    input.branchIds.length === 0
  ) {
    return "Select at least one branch for branch-restricted plans.";
  }

  return null;
}

export async function createPlanAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const input = readPlanForm(formData);
  const validationError = validatePlanInput(input);

  if (validationError) {
    redirect("/app/plans?error=" + encodeMessage(validationError));
  }

  try {
    await createPlan({
      tenantId: context.workspaceId,
      name: input.preset!.name,
      description: input.description,
      price: input.price,
      durationUnit: input.preset!.durationUnit,
      durationValue: input.preset!.durationValue,
      supportsRenewal: input.supportsRenewal,
      supportsExtension: input.supportsExtension,
      supportsFreeze: input.supportsFreeze,
      supportsSuspension: input.supportsSuspension,
      accessScope: input.accessScope,
      branchIds: input.branchIds,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create plan.";
    redirect("/app/plans?error=" + encodeMessage(message));
  }

  redirect("/app/plans?success=" + encodeMessage("Plan created successfully."));
}

export async function updatePlanAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const planId = String(formData.get("planId") ?? "").trim();
  const input = readPlanForm(formData);
  const validationError = validatePlanInput(input);

  if (!planId || validationError) {
    redirect(
      "/app/plans?error=" +
        encodeMessage(validationError ?? "Missing plan to update."),
    );
  }

  try {
    await updatePlan({
      tenantId: context.workspaceId,
      planId,
      name: input.preset!.name,
      description: input.description,
      price: input.price,
      durationUnit: input.preset!.durationUnit,
      durationValue: input.preset!.durationValue,
      supportsRenewal: input.supportsRenewal,
      supportsExtension: input.supportsExtension,
      supportsFreeze: input.supportsFreeze,
      supportsSuspension: input.supportsSuspension,
      accessScope: input.accessScope,
      branchIds: input.branchIds,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update plan.";
    redirect("/app/plans?error=" + encodeMessage(message));
  }

  redirect("/app/plans?success=" + encodeMessage("Plan updated successfully."));
}

export async function deletePlanAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const planId = String(formData.get("planId") ?? "").trim();

  if (!planId) {
    redirect("/app/plans?error=" + encodeMessage("Missing plan to delete."));
  }

  try {
    await deletePlan({
      tenantId: context.workspaceId,
      planId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete plan.";
    redirect("/app/plans?error=" + encodeMessage(message));
  }

  redirect("/app/plans?success=" + encodeMessage("Plan deleted successfully."));
}

export async function changePlanStatusAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const planId = String(formData.get("planId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (
    !planId ||
    (status !== "active" && status !== "inactive" && status !== "archived")
  ) {
    redirect(
      "/app/plans?error=" + encodeMessage("Invalid plan status update."),
    );
  }

  try {
    await updatePlanStatus({
      tenantId: context.workspaceId,
      planId,
      status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update plan status.";
    redirect("/app/plans?error=" + encodeMessage(message));
  }

  redirect("/app/plans?success=" + encodeMessage("Plan status updated."));
}
