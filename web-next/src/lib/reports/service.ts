import { computeMembershipStatus } from "@/lib/memberships/status";
import { createReadOnlyClient } from "@/lib/supabase/server";

type ReportBranchRow = {
  id: string;
  name: string;
};

type ReportPaymentRow = {
  id: string;
  amount: number;
  paid_at: string;
  branch_id: string | null;
  created_by: string | null;
  related_membership_id: string | null;
  related_member_pass_id: string | null;
  member_memberships:
    | {
        membership_plans:
          | {
              name: string;
            }
          | {
              name: string;
            }[]
          | null;
      }
    | {
        membership_plans:
          | {
              name: string;
            }
          | {
              name: string;
            }[]
          | null;
      }[]
    | null;
  users:
    | {
        full_name: string;
      }
    | {
        full_name: string;
      }[]
    | null;
};

type ReportCheckinRow = {
  id: string;
  created_at: string;
  branch_id: string;
  created_by: string | null;
  result: "success" | "failed";
  users:
    | {
        full_name: string;
      }
    | {
        full_name: string;
      }[]
    | null;
};

type ReportMembershipRow = {
  id: string;
  member_id: string;
  status:
    | "active"
    | "expired"
    | "inactive"
    | "suspended"
    | "frozen"
    | "pending_payment"
    | "trial";
  payment_status: string;
  start_at: string;
  end_at: string;
  created_at: string;
};

export type ReportDateRange = {
  from: string;
  to: string;
};

export type ReportsData = {
  range: ReportDateRange;
  activeMembers: number;
  expiredMembers: number;
  dailyCheckins: number;
  weeklyCheckins: number;
  monthlyCheckins: number;
  revenueByPlan: Array<{
    label: string;
    amount: number;
  }>;
  branchPerformance: Array<{
    branchId: string;
    branchName: string;
    revenue: number;
    checkins: number;
  }>;
  recentStaffActivity: Array<{
    id: string;
    label: string;
    detail: string;
    createdAt: string;
  }>;
};

function normalizeSingle<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toRangeBounds(range?: Partial<ReportDateRange>) {
  const today = new Date();
  const defaultFrom = new Date(today);
  defaultFrom.setDate(defaultFrom.getDate() - 29);

  const from = range?.from ? new Date(`${range.from}T00:00:00.000Z`) : defaultFrom;
  const to = range?.to ? new Date(`${range.to}T23:59:59.999Z`) : today;

  return {
    fromIso: from.toISOString(),
    toIso: to.toISOString(),
    from: formatDateInput(from),
    to: formatDateInput(to),
  };
}

export async function getReportsData(
  tenantId: string,
  branchIds?: string[],
  range?: Partial<ReportDateRange>,
): Promise<ReportsData> {
  const supabase = await createReadOnlyClient();
  const { fromIso, toIso, from, to } = toRangeBounds(range);
  const today = new Date();
  const startTodayIso = startOfDay(today).toISOString();
  const startWeekIso = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
    .toISOString();
  const startMonthIso = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000)
    .toISOString();

  let branchBuilder = supabase
    .from("branches")
    .select("id, name")
    .eq("tenant_id", tenantId)
    .eq("status", "active")
    .order("name", { ascending: true });

  let paymentsBuilder = supabase
    .from("payments")
    .select(
      `
        id,
        amount,
        paid_at,
        branch_id,
        created_by,
        related_membership_id,
        related_member_pass_id,
        member_memberships:related_membership_id (
          membership_plans (
            name
          )
        ),
        users:created_by (
          full_name
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .eq("status", "paid")
    .gte("paid_at", fromIso)
    .lte("paid_at", toIso);

  let checkinsRangeBuilder = supabase
    .from("checkins")
    .select(
      `
        id,
        created_at,
        branch_id,
        created_by,
        result,
        users:created_by (
          full_name
        )
      `,
    )
    .eq("tenant_id", tenantId)
    .eq("result", "success")
    .gte("created_at", fromIso)
    .lte("created_at", toIso);

  let todayCheckinsBuilder = supabase
    .from("checkins")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("result", "success")
    .gte("created_at", startTodayIso);

  let weekCheckinsBuilder = supabase
    .from("checkins")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("result", "success")
    .gte("created_at", startWeekIso);

  let monthCheckinsBuilder = supabase
    .from("checkins")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("result", "success")
    .gte("created_at", startMonthIso);

  if (branchIds && branchIds.length > 0) {
    branchBuilder = branchBuilder.in("id", branchIds);
    paymentsBuilder = paymentsBuilder.in("branch_id", branchIds);
    checkinsRangeBuilder = checkinsRangeBuilder.in("branch_id", branchIds);
    todayCheckinsBuilder = todayCheckinsBuilder.in("branch_id", branchIds);
    weekCheckinsBuilder = weekCheckinsBuilder.in("branch_id", branchIds);
    monthCheckinsBuilder = monthCheckinsBuilder.in("branch_id", branchIds);
  }

  const [
    branchesResult,
    activeMembersResult,
    membershipsResult,
    paymentsResult,
    checkinsRangeResult,
    dailyCheckinsResult,
    weeklyCheckinsResult,
    monthlyCheckinsResult,
  ] = await Promise.all([
    branchBuilder,
    supabase
      .from("members")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "active"),
    supabase
      .from("member_memberships")
      .select(
        "id, member_id, status, payment_status, start_at, end_at, created_at",
      )
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false }),
    paymentsBuilder,
    checkinsRangeBuilder.order("created_at", { ascending: false }).limit(50),
    todayCheckinsBuilder,
    weekCheckinsBuilder,
    monthCheckinsBuilder,
  ]);

  const firstError = [
    branchesResult.error,
    activeMembersResult.error,
    membershipsResult.error,
    paymentsResult.error,
    checkinsRangeResult.error,
    dailyCheckinsResult.error,
    weeklyCheckinsResult.error,
    monthlyCheckinsResult.error,
  ].find(Boolean);

  if (firstError) {
    throw new Error(`Failed to load reports data: ${firstError.message}`);
  }

  const branches = (branchesResult.data ?? []) as ReportBranchRow[];
  const payments = (paymentsResult.data ?? []) as ReportPaymentRow[];
  const rangeCheckins = (checkinsRangeResult.data ?? []) as ReportCheckinRow[];
  const memberships = (membershipsResult.data ?? []) as ReportMembershipRow[];

  const latestMembershipByMember = new Map<string, ReportMembershipRow>();

  for (const membership of memberships) {
    if (!latestMembershipByMember.has(membership.member_id)) {
      latestMembershipByMember.set(membership.member_id, membership);
    }
  }

  let expiredMembers = 0;

  for (const membership of latestMembershipByMember.values()) {
    const status = computeMembershipStatus({
      status: membership.status,
      paymentStatus: membership.payment_status,
      startAt: membership.start_at,
      endAt: membership.end_at,
    });

    if (status === "expired") {
      expiredMembers += 1;
    }
  }

  const revenueByPlanMap = new Map<string, number>();

  for (const payment of payments) {
    const membership = normalizeSingle(payment.member_memberships);
    const plan = membership
      ? normalizeSingle(membership.membership_plans)
      : null;
    const label = plan?.name ?? "Unlinked revenue";
    revenueByPlanMap.set(label, (revenueByPlanMap.get(label) ?? 0) + Number(payment.amount ?? 0));
  }

  const branchPerformanceMap = new Map<
    string,
    {
      branchId: string;
      branchName: string;
      revenue: number;
      checkins: number;
    }
  >();

  for (const branch of branches) {
    branchPerformanceMap.set(branch.id, {
      branchId: branch.id,
      branchName: branch.name,
      revenue: 0,
      checkins: 0,
    });
  }

  for (const payment of payments) {
    if (!payment.branch_id) {
      continue;
    }

    const current = branchPerformanceMap.get(payment.branch_id);

    if (current) {
      current.revenue += Number(payment.amount ?? 0);
    }
  }

  for (const checkin of rangeCheckins) {
    const current = branchPerformanceMap.get(checkin.branch_id);

    if (current) {
      current.checkins += 1;
    }
  }

  const recentStaffActivity = [
    ...payments
      .filter((payment) => payment.created_by)
      .slice(0, 5)
      .map((payment) => ({
        id: `payment-${payment.id}`,
        label: "Payment recorded",
        detail: `${normalizeSingle(payment.users)?.full_name ?? "Staff"} recorded ${Number(payment.amount).toFixed(2)}`,
        createdAt: payment.paid_at,
      })),
    ...rangeCheckins
      .filter((checkin) => checkin.created_by)
      .slice(0, 5)
      .map((checkin) => ({
        id: `checkin-${checkin.id}`,
        label: "Check-in processed",
        detail: `${normalizeSingle(checkin.users)?.full_name ?? "Staff"} recorded a ${checkin.result} check-in`,
        createdAt: checkin.created_at,
      })),
  ]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);

  return {
    range: { from, to },
    activeMembers: activeMembersResult.count ?? 0,
    expiredMembers,
    dailyCheckins: dailyCheckinsResult.count ?? 0,
    weeklyCheckins: weeklyCheckinsResult.count ?? 0,
    monthlyCheckins: monthlyCheckinsResult.count ?? 0,
    revenueByPlan: [...revenueByPlanMap.entries()]
      .map(([label, amount]) => ({ label, amount }))
      .sort((a, b) => b.amount - a.amount),
    branchPerformance: [...branchPerformanceMap.values()].sort(
      (a, b) => b.revenue - a.revenue || b.checkins - a.checkins,
    ),
    recentStaffActivity,
  };
}
