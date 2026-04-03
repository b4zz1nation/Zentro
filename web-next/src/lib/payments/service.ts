import { getLatestMemberMembership } from "@/lib/memberships/service";
import { createReadOnlyClient } from "@/lib/supabase/server";

export type PaymentSearchMember = {
  id: string;
  external_member_code: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: "active" | "inactive" | "archived";
  branches:
    | {
        id: string;
        name: string;
      }
    | null;
  latestMembership:
    | {
        id: string;
        planName: string;
        paymentStatus: string;
      }
    | null;
};

export type PaymentLogItem = {
  id: string;
  amount: number;
  currency: string;
  payment_type: "membership_sale" | "pass_sale" | "renewal" | "adjustment";
  payment_method: "cash" | "card" | "bank_transfer" | "mobile_wallet" | "other";
  receipt_reference: string | null;
  status: "paid" | "pending" | "failed" | "refunded" | "void";
  paid_at: string;
  members:
    | {
        id: string;
        external_member_code: string | null;
        first_name: string;
        last_name: string;
      }
    | null;
};

type RawPaymentMember = Omit<PaymentSearchMember, "branches" | "latestMembership"> & {
  branches:
    | PaymentSearchMember["branches"]
    | PaymentSearchMember["branches"][]
    | null;
};

type RawPaymentLogItem = Omit<PaymentLogItem, "members"> & {
  members:
    | PaymentLogItem["members"]
    | PaymentLogItem["members"][]
    | null;
};

function normalizePaymentMember(record: RawPaymentMember): Omit<PaymentSearchMember, "latestMembership"> {
  return {
    ...record,
    branches: Array.isArray(record.branches)
      ? (record.branches[0] ?? null)
      : record.branches,
  };
}

function normalizePaymentLogItem(record: RawPaymentLogItem): PaymentLogItem {
  return {
    ...record,
    members: Array.isArray(record.members)
      ? (record.members[0] ?? null)
      : record.members,
  };
}

export async function searchMembersForPayments(
  tenantId: string,
  query?: string,
) {
  const search = query?.trim();

  if (!search) {
    return [] as PaymentSearchMember[];
  }

  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      `
        id,
        external_member_code,
        first_name,
        last_name,
        email,
        phone,
        status,
        branches:home_branch_id (
          id,
          name
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .or(
      [
        `external_member_code.ilike.%${search}%`,
        `first_name.ilike.%${search}%`,
        `last_name.ilike.%${search}%`,
        `email.ilike.%${search}%`,
        `phone.ilike.%${search}%`,
      ].join(","),
    )
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(`Failed to search members for payments: ${error.message}`);
  }

  const members = ((data ?? []) as RawPaymentMember[]).map(
    normalizePaymentMember,
  );

  const latestMemberships = await Promise.all(
    members.map(async (member) => {
      const latest = await getLatestMemberMembership(tenantId, member.id);

      return {
        memberId: member.id,
        latestMembership: latest
          ? {
              id: latest.id,
              planName: latest.membership_plans?.name ?? "Membership",
              paymentStatus: latest.payment_status,
            }
          : null,
      };
    }),
  );

  const latestMembershipByMember = new Map(
    latestMemberships.map((item) => [item.memberId, item.latestMembership]),
  );

  return members.map((member) => ({
    ...member,
    latestMembership: latestMembershipByMember.get(member.id) ?? null,
  }));
}

export async function listRecentPayments(
  tenantId: string,
  branchIds?: string[],
) {
  const supabase = await createReadOnlyClient();
  let builder = supabase
    .from("payments")
    .select(
      `
        id,
        amount,
        currency,
        payment_type,
        payment_method,
        receipt_reference,
        status,
        paid_at,
        members:member_id (
          id,
          external_member_code,
          first_name,
          last_name
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .order("paid_at", { ascending: false })
    .limit(10);

  if (branchIds && branchIds.length > 0) {
    builder = builder.in("branch_id", branchIds);
  }

  const { data, error } = await builder;

  if (error) {
    throw new Error(`Failed to load recent payments: ${error.message}`);
  }

  return ((data ?? []) as RawPaymentLogItem[]).map(normalizePaymentLogItem);
}

export async function createPayment(input: {
  tenantId: string;
  branchId?: string;
  memberId: string;
  paymentType: "membership_sale" | "pass_sale" | "renewal" | "adjustment";
  amount: number;
  currency?: string;
  paymentMethod: "cash" | "card" | "bank_transfer" | "mobile_wallet" | "other";
  receiptReference?: string;
  notes?: string;
  relatedMembershipId?: string;
  relatedMemberPassId?: string;
  createdBy?: string;
}) {
  const supabase = await createReadOnlyClient();
  const amount = Number(input.amount);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Payment amount must be a valid non-negative number.");
  }

  const { data, error } = await supabase
    .from("payments")
    .insert({
      tenant_id: input.tenantId,
      branch_id: input.branchId || null,
      member_id: input.memberId,
      payment_type: input.paymentType,
      related_membership_id: input.relatedMembershipId || null,
      related_member_pass_id: input.relatedMemberPassId || null,
      amount,
      currency: (input.currency || "USD").trim().toUpperCase(),
      payment_method: input.paymentMethod,
      receipt_reference: input.receiptReference?.trim() || null,
      status: "paid",
      notes: input.notes?.trim() || null,
      created_by: input.createdBy || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to record payment: ${error?.message ?? "Unknown error"}`,
    );
  }

  if (input.relatedMembershipId) {
    const { error: membershipError } = await supabase
      .from("member_memberships")
      .update({
        payment_status: "paid",
      })
      .eq("tenant_id", input.tenantId)
      .eq("id", input.relatedMembershipId);

    if (membershipError) {
      throw new Error(
        `Payment recorded, but membership payment status could not be updated: ${membershipError.message}`,
      );
    }
  }

  if (input.relatedMemberPassId) {
    const { error: passError } = await supabase
      .from("member_passes")
      .update({
        payment_status: "paid",
      })
      .eq("tenant_id", input.tenantId)
      .eq("id", input.relatedMemberPassId);

    if (passError) {
      throw new Error(
        `Payment recorded, but pass payment status could not be updated: ${passError.message}`,
      );
    }
  }

  return data.id as string;
}
