import {
  createBranchAction,
  updateBranchAction,
  updateBranchStatusAction,
} from "@/app/app/branches/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { requireRole } from "@/lib/auth/guards";
import { listBranches } from "@/lib/branches/service";

type BranchesPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function BranchesPage({
  searchParams,
}: BranchesPageProps) {
  const context = await requireRole(["gym_owner", "super_admin"]);
  const { error, success } = await searchParams;
  const branches = context.workspaceId
    ? await listBranches(context.workspaceId)
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Branches"
        title="Branch administration"
        description="Create branches, update branch details, and control branch status from a single owner-only workspace screen."
        actionLabel="Add Branch"
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

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Add branch</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Create additional operating branches for staff access, members, and
            reporting scope.
          </p>

          <form action={createBranchAction} className="mt-6 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                name="name"
                type="text"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Code</span>
              <input
                name="code"
                type="text"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Address</span>
              <textarea
                name="address"
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
              />
            </label>

            <button
              type="submit"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Create branch
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Branches</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Update branch identity, address, and active status.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              {branches.length} total
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {branches.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
                No branches found.
              </div>
            ) : (
              branches.map((branch) => (
                <article
                  key={branch.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">
                        {branch.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {branch.code || "No code"} | {branch.status}
                      </p>
                    </div>
                    <form action={updateBranchStatusAction} className="flex items-center gap-2">
                      <input type="hidden" name="branchId" value={branch.id} />
                      <select
                        name="status"
                        defaultValue={branch.status}
                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Save
                      </button>
                    </form>
                  </div>

                  <form action={updateBranchAction} className="mt-5 grid gap-4 sm:grid-cols-2">
                    <input type="hidden" name="branchId" value={branch.id} />
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-700">Name</span>
                      <input
                        name="name"
                        type="text"
                        defaultValue={branch.name}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                        required
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-700">Code</span>
                      <input
                        name="code"
                        type="text"
                        defaultValue={branch.code ?? ""}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                      />
                    </label>
                    <label className="block space-y-2 sm:col-span-2">
                      <span className="text-sm font-medium text-slate-700">Address</span>
                      <textarea
                        name="address"
                        rows={3}
                        defaultValue={branch.address ?? ""}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                      />
                    </label>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                      >
                        Update branch details
                      </button>
                    </div>
                  </form>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
