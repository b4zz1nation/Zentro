import { createPassAction } from "@/app/app/passes/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { PassCard } from "@/components/passes/pass-card";
import { PassForm } from "@/components/passes/pass-form";
import { requireRole } from "@/lib/auth/guards";
import { listWorkspaceBranches } from "@/lib/invitations/service";
import { listPasses } from "@/lib/passes/service";

type PassesPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function PassesPage({ searchParams }: PassesPageProps) {
  const context = await requireRole(["gym_owner", "super_admin"]);
  const { error, success } = await searchParams;
  const [branches, passes] = context.workspaceId
    ? await Promise.all([
        listWorkspaceBranches(context.workspaceId),
        listPasses(context.workspaceId),
      ])
    : [[], []];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Passes"
        title="Pass product management"
        description="Create, edit, archive, and assign passes with validity windows, optional usage limits, and branch-aware access."
        actionLabel="Create Pass"
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
          <h2 className="text-lg font-semibold text-slate-950">Create pass</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Configure short-duration or usage-based products for members who do
            not need a full membership.
          </p>

          <form action={createPassAction} className="mt-6 space-y-5">
            <PassForm
              mode="create"
              branches={branches}
              submitLabel="Save pass"
            />
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Passes</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Review validity, branch scope, usage limits, and assignment
                counts at a glance.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm text-slate-500">
              {passes.length} total pass{passes.length === 1 ? "" : "es"}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {passes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
                No passes created yet.
              </div>
            ) : (
              passes.map((pass) => (
                <PassCard key={pass.id} pass={pass} branches={branches} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
