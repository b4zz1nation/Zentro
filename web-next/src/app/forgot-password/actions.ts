"use server";

import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { createActionClient } from "@/lib/supabase/server";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect("/forgot-password?error=" + encodeMessage("Email is required."));
  }

  const supabase = await createActionClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.appUrl}/login`,
  });

  if (error) {
    redirect("/forgot-password?error=" + encodeMessage(error.message));
  }

  redirect(
    "/forgot-password?success=" +
      encodeMessage("Password reset email sent if the account exists."),
  );
}
