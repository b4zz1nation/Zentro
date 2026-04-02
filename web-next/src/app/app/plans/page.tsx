import { createPlanAction } from "@/app/app/plans/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { PlanCard } from "@/components/plans/plan-card";
import { PlanForm } from "@/components/plans/plan-form";
import { requireRole } from "@/lib/auth/guards";
import { listWorkspaceBranches } from "@/lib/invitations/service";
import { PLAN_RULE_DEFINITIONS } from "@/lib/plans/rules";
import { listPlans } from "@/lib/plans/service";

type PlansPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function PlansPage({ searchParams }: PlansPageProps) {
  const context = await requireRole(["gym_owner", "super_admin"]);
  const { error, success } = await searchParams;
  const branches = context.workspaceId
    ? await listWorkspaceBranches(context.workspaceId)
    : [];
  const plans = context.workspaceId ? await listPlans(context.workspaceId) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Plans"
        title="Membership plan management"
        description="Create, edit, archive, and assign membership plans with branch-aware access rules."
        actionLabel="Create Plan"
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Create plan</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Configure pricing, branch access, and operational rules. Duration is
            driven by the selected plan type.
          </p>

          <form action={createPlanAction} className="mt-6 space-y-5">
            <PlanForm mode="create" branches={branches} submitLabel="Save plan" />
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Plans</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Review plan status, branch scope, enabled rules, and assignment
                usage at a glance.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm text-slate-500">
              {plans.length} total plan{plans.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {plans.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
                No plans created yet.
              </div>
            ) : (
              plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  branches={branches}
                  ruleDefinitions={PLAN_RULE_DEFINITIONS}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
