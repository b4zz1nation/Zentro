import { PageHeader } from "@/components/app-shell/page-header";
import { createManualCheckinAction } from "@/app/app/checkins/actions";
import { requireRole } from "@/lib/auth/guards";
import {
  listRecentCheckins,
  searchMembersForCheckin,
} from "@/lib/checkins/service";
import { listWorkspaceBranches } from "@/lib/invitations/service";

type CheckinsPageProps = {
  searchParams: Promise<{
    branchId?: string;
    q?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function CheckinsPage({
  searchParams,
}: CheckinsPageProps) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);
  const { branchId, q, success, error } = await searchParams;

  if (!context.workspaceId) {
    return null;
  }

  const [branches, recentCheckins] = await Promise.all([
    listWorkspaceBranches(context.workspaceId),
    listRecentCheckins(
      context.workspaceId,
      context.branchIds.length > 0 ? context.branchIds : undefined,
    ),
  ]);

  const availableBranches =
    context.branchIds.length > 0
      ? branches.filter((branch) => context.branchIds.includes(branch.id))
      : branches;
  const selectedBranchId =
    branchId && availableBranches.some((branch) => branch.id === branchId)
      ? branchId
      : (availableBranches[0]?.id ?? "");
  const members =
    q?.trim() && selectedBranchId
      ? await searchMembersForCheckin(context.workspaceId, q)
      : [];

  return (
    <div className="space-y-6">
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

      <PageHeader
        eyebrow="Check-In"
        title="Front desk validation"
        description="Search a member, validate access for the selected branch, and log the result immediately."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Manual check-in
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Search by member code, name, email, or phone. Check-ins are logged
            as success or failure so front desk staff can see exactly what
            happened.
          </p>

          {availableBranches.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
              No accessible branches were found for your role. Add or activate a
              branch first.
            </div>
          ) : (
            <>
              <form className="mt-5 grid gap-4 md:grid-cols-[0.8fr_1.2fr_auto]">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Branch
                  </span>
                  <select
                    name="branchId"
                    defaultValue={selectedBranchId}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  >
                    {availableBranches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Search member
                  </span>
                  <input
                    name="q"
                    type="text"
                    defaultValue={q ?? ""}
                    placeholder="Member code, name, email, or phone"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div className="mt-6 space-y-3">
                {q?.trim() ? (
                  members.length > 0 ? (
                    members.map((member) => (
                      <div
                        key={member.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-950">
                              {member.first_name} {member.last_name}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {(member.external_member_code ?? "No code") +
                                " | " +
                                (member.email ?? member.phone ?? "No contact")}
                            </p>
                            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                              {member.branches?.name
                                ? `Home branch: ${member.branches.name}`
                                : "No home branch"}
                            </p>
                          </div>
                          <form
                            action={createManualCheckinAction}
                            className="flex min-w-[220px] flex-col gap-3"
                          >
                            <input
                              type="hidden"
                              name="memberId"
                              value={member.id}
                            />
                            <input
                              type="hidden"
                              name="branchId"
                              value={selectedBranchId}
                            />
                            <input
                              type="hidden"
                              name="query"
                              value={q ?? ""}
                            />
                            <button
                              type="submit"
                              className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                              Validate and check in
                            </button>
                          </form>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
                      No members matched that search.
                    </div>
                  )
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
                    Start with a member search to validate a manual check-in.
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Validation rules
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>Access is allowed when at least one active membership or pass:</p>
              <ul className="space-y-2 pl-5 text-slate-600">
                <li className="list-disc">belongs to the current workspace</li>
                <li className="list-disc">
                  is active or trial and not frozen, suspended, expired, or
                  pending payment
                </li>
                <li className="list-disc">
                  grants access to the selected branch
                </li>
              </ul>
              <p>
                Failed attempts are still logged so the front desk has a visible
                audit trail.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Recent check-ins
            </h2>
            <div className="mt-4 space-y-3">
              {recentCheckins.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
                  No check-ins recorded yet.
                </div>
              ) : (
                recentCheckins.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {item.members
                            ? `${item.members.first_name} ${item.members.last_name}`
                            : "Unknown member"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {(item.members?.external_member_code ?? "No code") +
                            " | " +
                            (item.branches?.name ?? "Unknown branch")}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          {item.result_reason ?? "No reason recorded"}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                          item.result === "success"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {item.result}
                      </span>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">
                      {item.checkin_method} | {item.created_at.slice(0, 16).replace("T", " ")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
