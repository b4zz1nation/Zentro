import { PageHeader } from "@/components/app-shell/page-header";
import { requireRole } from "@/lib/auth/guards";
import { listWorkspaceBranches } from "@/lib/invitations/service";
import { getReportsData } from "@/lib/reports/service";

type ReportsPageProps = {
  searchParams: Promise<{
    from?: string;
    to?: string;
    branchId?: string;
  }>;
};

function formatAmount(value: number) {
  return `$${value.toFixed(2)}`;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);
  const { from, to, branchId } = await searchParams;

  if (!context.workspaceId) {
    return null;
  }

  const branches = await listWorkspaceBranches(context.workspaceId);
  const allowedBranches =
    context.branchIds.length > 0
      ? branches.filter((branch) => context.branchIds.includes(branch.id))
      : branches;
  const effectiveBranchIds =
    branchId && allowedBranches.some((branch) => branch.id === branchId)
      ? [branchId]
      : context.branchIds.length > 0
        ? context.branchIds
        : undefined;

  const reports = await getReportsData(
    context.workspaceId,
    effectiveBranchIds,
    {
      from,
      to,
    },
  );

  const maxPlanRevenue = Math.max(
    ...reports.revenueByPlan.map((item) => item.amount),
    1,
  );
  const maxBranchRevenue = Math.max(
    ...reports.branchPerformance.map((item) => item.revenue),
    1,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Operational and revenue reporting"
        description="Track member health, attendance, branch performance, and revenue using live workspace data."
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-4 md:grid-cols-[1fr_1fr_1.2fr_auto]">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">From</span>
            <input
              name="from"
              type="date"
              defaultValue={reports.range.from}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">To</span>
            <input
              name="to"
              type="date"
              defaultValue={reports.range.to}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Branch</span>
            <select
              name="branchId"
              defaultValue={branchId ?? ""}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
            >
              <option value="">All accessible branches</option>
              {allowedBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Apply filters
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          {
            label: "Active Members",
            value: String(reports.activeMembers),
            hint: "Current active member records.",
          },
          {
            label: "Expired Members",
            value: String(reports.expiredMembers),
            hint: "Members whose latest membership is expired.",
          },
          {
            label: "Daily Check-Ins",
            value: String(reports.dailyCheckins),
            hint: "Successful check-ins today.",
          },
          {
            label: "Weekly Check-Ins",
            value: String(reports.weeklyCheckins),
            hint: "Successful check-ins in the last 7 days.",
          },
          {
            label: "Monthly Check-Ins",
            value: String(reports.monthlyCheckins),
            hint: "Successful check-ins in the last 30 days.",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {item.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.hint}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Revenue by plan
          </h2>
          <div className="mt-5 space-y-4">
            {reports.revenueByPlan.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
                No revenue in the selected date range.
              </div>
            ) : (
              reports.revenueByPlan.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-slate-800">
                      {item.label}
                    </span>
                    <span className="text-slate-600">
                      {formatAmount(item.amount)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-cyan-500"
                      style={{
                        width: `${Math.max((item.amount / maxPlanRevenue) * 100, 6)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Branch performance
          </h2>
          <div className="mt-5 space-y-4">
            {reports.branchPerformance.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
                No branch data found.
              </div>
            ) : (
              reports.branchPerformance.map((branch) => (
                <div
                  key={branch.branchId}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-slate-950">
                      {branch.branchName}
                    </p>
                    <p className="text-sm text-slate-600">
                      {formatAmount(branch.revenue)}
                    </p>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-slate-200">
                    <div
                      className="h-3 rounded-full bg-emerald-500"
                      style={{
                        width: `${Math.max((branch.revenue / maxBranchRevenue) * 100, 6)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    {branch.checkins} successful check-in
                    {branch.checkins === 1 ? "" : "s"} in range
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Recent staff activity
          </h2>
          <div className="mt-5 space-y-3">
            {reports.recentStaffActivity.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
                No staff activity found for the selected range.
              </div>
            ) : (
              reports.recentStaffActivity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <p className="text-sm font-semibold text-slate-950">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {item.createdAt.slice(0, 16).replace("T", " ")}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Report summary
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              The date filter currently drives branch performance, revenue by
              plan, and recent staff activity.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              Daily, weekly, and monthly check-ins are always calculated from
              live attendance records relative to today.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              Expired members are based on the latest membership record per
              member and the same live status engine used elsewhere in the app.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
