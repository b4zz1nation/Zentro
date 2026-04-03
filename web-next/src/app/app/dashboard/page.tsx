import { ActivityPanel } from "@/components/app-shell/activity-panel";
import { MetricCard } from "@/components/app-shell/metric-card";
import { PageHeader } from "@/components/app-shell/page-header";
import { requireWorkspace } from "@/lib/auth/guards";
import { getDashboardData } from "@/lib/dashboard/service";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const context = await requireWorkspace();

  if (context.role === "member") {
    redirect("/member/dashboard");
  }

  const dashboard = await getDashboardData(context.workspaceId!);
  const metrics = [
    {
      label: "Active Members",
      value: String(dashboard.activeMembers),
      hint: `${dashboard.totalMembers} total member records in this workspace.`,
    },
    {
      label: "Today's Check-Ins",
      value: String(dashboard.todaysCheckins),
      hint: "Successful check-ins recorded since midnight.",
    },
    {
      label: "Today's Revenue",
      value: `$${dashboard.todaysRevenue.toFixed(2)}`,
      hint: "Paid transactions recorded today.",
    },
    {
      label: "Recent Payments",
      value: String(dashboard.recentPayments.length),
      hint: "Latest payment entries shown below.",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Daily operating view"
        description="Live workspace metrics and recent operational activity from Supabase."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ActivityPanel
          title="Recent Payments"
          description="Latest payment records across the current workspace."
          items={dashboard.recentPayments}
        />
        <ActivityPanel
          title="Recent Check-Ins"
          description="Latest attendance events from the front desk."
          items={dashboard.recentActivity}
        />
      </div>
    </div>
  );
}
