"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/guards";
import { acceptInvitation } from "@/lib/invitations/service";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export async function acceptInviteAction(formData: FormData) {
  const context = await requireAuth();
  const token = String(formData.get("token") ?? "").trim();

  if (!token) {
    redirect("/accept-invite?error=" + encodeMessage("Invitation token is missing."));
  }

  try {
    await acceptInvitation({
      token,
      profileId: context.profileId,
      userEmail: context.email,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to accept invitation.";
    redirect(
      `/accept-invite?token=${encodeURIComponent(token)}&error=${encodeMessage(message)}`,
    );
  }

  redirect("/app/dashboard");
}
