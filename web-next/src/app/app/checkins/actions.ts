"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { createManualCheckin } from "@/lib/checkins/service";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export async function createManualCheckinAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const branchId = String(formData.get("branchId") ?? "").trim();
  const memberId = String(formData.get("memberId") ?? "").trim();
  const query = String(formData.get("query") ?? "").trim();

  if (!branchId || !memberId) {
    redirect(
      `/app/checkins?branchId=${encodeURIComponent(branchId)}&q=${encodeURIComponent(query)}&error=${encodeMessage("Check-in requires a branch and a member.")}`,
    );
  }

  try {
    const result = await createManualCheckin({
      tenantId: context.workspaceId,
      branchId,
      memberId,
      createdBy: context.profileId,
    });

    redirect(
      `/app/checkins?branchId=${encodeURIComponent(branchId)}&q=${encodeURIComponent(query)}&success=${encodeMessage(result.reason)}`,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to record check-in.";

    redirect(
      `/app/checkins?branchId=${encodeURIComponent(branchId)}&q=${encodeURIComponent(query)}&error=${encodeMessage(message)}`,
    );
  }
}
