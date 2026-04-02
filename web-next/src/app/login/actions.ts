"use server";

import { redirect } from "next/navigation";
import { createActionClient } from "@/lib/supabase/server";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim();

  if (!email || !password) {
    redirect(
      "/login?error=" + encodeMessage("Email and password are required."),
    );
  }

  const supabase = await createActionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=" + encodeMessage(error.message));
  }

  redirect(next || "/app/dashboard");
}
