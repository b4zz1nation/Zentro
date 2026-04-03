"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { createPayment } from "@/lib/payments/service";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export async function createPaymentAction(formData: FormData) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const branchId = String(formData.get("branchId") ?? "").trim();
  const memberId = String(formData.get("memberId") ?? "").trim();
  const query = String(formData.get("query") ?? "").trim();
  const paymentType = String(formData.get("paymentType") ?? "").trim();
  const paymentMethod = String(formData.get("paymentMethod") ?? "").trim();
  const amount = Number(formData.get("amount") ?? 0);
  const currency = String(formData.get("currency") ?? "USD").trim();
  const receiptReference = String(
    formData.get("receiptReference") ?? "",
  ).trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const relatedMembershipId = String(
    formData.get("relatedMembershipId") ?? "",
  ).trim();

  if (!memberId || !paymentType || !paymentMethod) {
    redirect(
      `/app/payments?branchId=${encodeURIComponent(branchId)}&q=${encodeURIComponent(query)}&error=${encodeMessage("Payment entry requires a member, payment type, and method.")}`,
    );
  }

  try {
    await createPayment({
      tenantId: context.workspaceId,
      branchId,
      memberId,
      paymentType: paymentType as
        | "membership_sale"
        | "pass_sale"
        | "renewal"
        | "adjustment",
      amount,
      currency,
      paymentMethod: paymentMethod as
        | "cash"
        | "card"
        | "bank_transfer"
        | "mobile_wallet"
        | "other",
      receiptReference,
      notes,
      relatedMembershipId,
      createdBy: context.profileId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to record payment.";

    redirect(
      `/app/payments?branchId=${encodeURIComponent(branchId)}&q=${encodeURIComponent(query)}&error=${encodeMessage(message)}`,
    );
  }

  redirect(
    `/app/payments?branchId=${encodeURIComponent(branchId)}&q=${encodeURIComponent(query)}&success=${encodeMessage("Payment recorded successfully.")}`,
  );
}
