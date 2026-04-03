import { createAdminClient } from "@/lib/supabase/admin";
import { computeMembershipStatus } from "@/lib/memberships/status";
import { getLatestMemberMembership } from "@/lib/memberships/service";
import {
  getMemberById,
  listMemberCheckins,
  listMemberMembershipHistory,
  listMemberPayments,
} from "@/lib/members/service";
import { createReadOnlyClient } from "@/lib/supabase/server";

async function getMemberRecordByUserId(input: {
  tenantId: string;
  userId: string;
}) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("members")
    .select("id")
    .eq("tenant_id", input.tenantId)
    .eq("user_id", input.userId)
    .neq("status", "archived")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to resolve linked member record: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return getMemberById(data.id as string, input.tenantId);
}

export async function getMemberRecordForPortal(input: {
  tenantId: string;
  email: string | null;
  userId: string;
}) {
  const linkedMember = await getMemberRecordByUserId({
    tenantId: input.tenantId,
    userId: input.userId,
  });

  if (linkedMember) {
    return linkedMember;
  }

  if (!input.email) {
    return null;
  }

  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("members")
    .select("id")
    .eq("tenant_id", input.tenantId)
    .eq("email", input.email)
    .neq("status", "archived")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to resolve member portal record: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const admin = createAdminClient();
  await admin
    .from("members")
    .update({
      user_id: input.userId,
    })
    .eq("tenant_id", input.tenantId)
    .eq("id", data.id)
    .is("user_id", null);

  return getMemberById(data.id as string, input.tenantId);
}

export async function getMemberPortalData(input: {
  tenantId: string;
  email: string | null;
  userId: string;
}) {
  const member = await getMemberRecordForPortal(input);

  if (!member) {
    return null;
  }

  const [latestMembership, checkins, payments, memberships] = await Promise.all(
    [
      getLatestMemberMembership(input.tenantId, member.id),
      listMemberCheckins(input.tenantId, member.id),
      listMemberPayments(input.tenantId, member.id),
      listMemberMembershipHistory(input.tenantId, member.id),
    ],
  );

  return {
    member,
    latestMembership,
    currentStatus: latestMembership
      ? computeMembershipStatus({
          status: latestMembership.status,
          paymentStatus: latestMembership.payment_status,
          startAt: latestMembership.start_at,
          endAt: latestMembership.end_at,
        })
      : null,
    checkins,
    payments,
    memberships,
  };
}
