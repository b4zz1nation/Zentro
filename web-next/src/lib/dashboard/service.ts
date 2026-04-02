import { createReadOnlyClient } from "@/lib/supabase/server";

type ActivityItem = {
  id: string;
  label: string;
  detail: string;
  createdAt: string;
};

export type DashboardData = {
  activeMembers: number;
  totalMembers: number;
  todaysCheckins: number;
  todaysRevenue: number;
  recentPayments: ActivityItem[];
  recentActivity: ActivityItem[];
};

function startOfTodayIso() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

export async function getDashboardData(
  tenantId: string,
): Promise<DashboardData> {
  const supabase = await createReadOnlyClient();
  const todayIso = startOfTodayIso();

  const [
    activeMembersResult,
    totalMembersResult,
    todaysCheckinsResult,
    todaysPaymentsResult,
    recentPaymentsResult,
    recentCheckinsResult,
  ] = await Promise.all([
    supabase
      .from("members")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "active"),
    supabase
      .from("members")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId),
    supabase
      .from("checkins")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .gte("created_at", todayIso)
      .eq("result", "success"),
    supabase
      .from("payments")
      .select("amount")
      .eq("tenant_id", tenantId)
      .gte("paid_at", todayIso)
      .eq("status", "paid"),
    supabase
      .from("payments")
      .select("id, amount, currency, payment_type, paid_at")
      .eq("tenant_id", tenantId)
      .order("paid_at", { ascending: false })
      .limit(5),
    supabase
      .from("checkins")
      .select("id, result, result_reason, created_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const firstError = [
    activeMembersResult.error,
    totalMembersResult.error,
    todaysCheckinsResult.error,
    todaysPaymentsResult.error,
    recentPaymentsResult.error,
    recentCheckinsResult.error,
  ].find(Boolean);

  if (firstError) {
    throw new Error(`Failed to load dashboard data: ${firstError.message}`);
  }

  const todaysRevenue = (todaysPaymentsResult.data ?? []).reduce(
    (sum, payment) => sum + Number(payment.amount ?? 0),
    0,
  );

  return {
    activeMembers: activeMembersResult.count ?? 0,
    totalMembers: totalMembersResult.count ?? 0,
    todaysCheckins: todaysCheckinsResult.count ?? 0,
    todaysRevenue,
    recentPayments: (recentPaymentsResult.data ?? []).map((item) => ({
      id: item.id,
      label: item.payment_type.replaceAll("_", " "),
      detail: `${item.currency} ${item.amount}`,
      createdAt: item.paid_at,
    })),
    recentActivity: (recentCheckinsResult.data ?? []).map((item) => ({
      id: item.id,
      label: item.result === "success" ? "Check-in success" : "Check-in failed",
      detail: item.result_reason || "No reason recorded",
      createdAt: item.created_at,
    })),
  };
}
