import {
  createInvitationAction,
  updateStaffRoleAction,
} from "@/app/app/staff/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { requireRole } from "@/lib/auth/guards";
import {
  listWorkspaceBranches,
  listWorkspaceInvitations,
} from "@/lib/invitations/service";
import { listStaffRoles } from "@/lib/staff/service";

type StaffPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function StaffPage({ searchParams }: StaffPageProps) {
  const context = await requireRole(["gym_owner", "super_admin"]);
  const { error, success } = await searchParams;
  const [branches, invitations, staffRoles] = context.workspaceId
    ? await Promise.all([
        listWorkspaceBranches(context.workspaceId),
        listWorkspaceInvitations(context.workspaceId),
        listStaffRoles(context.workspaceId),
      ])
    : [[], [], []];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Staff"
        title="Staff roles and invitations"
        description="Invite staff, review current staff access, and manage branch scope and active status from one owner-only admin surface."
        actionLabel="Invite Staff"
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

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Create invitation
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Invite staff into the current workspace and optionally restrict
              them to selected branches.
            </p>

            <form action={createInvitationAction} className="mt-6 space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Staff email
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="staff@gym.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  required
                />
              </label>

              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-slate-700">
                  Branch scope
                </legend>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="branchScopeType"
                    value="selected"
                    defaultChecked
                  />
                  Selected branches
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <input type="radio" name="branchScopeType" value="all" />
                  All branches
                </label>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-slate-700">
                  Branch assignments
                </legend>
                <div className="space-y-2">
                  {branches.map((branch) => (
                    <label
                      key={branch.id}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      <input type="checkbox" name="branchIds" value={branch.id} />
                      <span>
                        {branch.name}
                        {branch.code ? ` (${branch.code})` : ""}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button
                type="submit"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Create invitation
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Invitations</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Current workspace invitations and branch scope.
            </p>

            <div className="mt-6 space-y-4">
              {invitations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
                  No invitations yet.
                </div>
              ) : (
                invitations.map((invitation) => (
                  <article
                    key={invitation.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {invitation.email}
                        </p>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          {invitation.status} | {invitation.branch_scope_type}
                        </p>
                      </div>
                      <a
                        href={`/accept-invite?token=${invitation.token}`}
                        className="text-sm font-medium text-cyan-700"
                      >
                        Open invite
                      </a>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Staff access management
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Update active status and branch scope for owner and staff roles.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              {staffRoles.length} role{staffRoles.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {staffRoles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
                No staff roles found yet.
              </div>
            ) : (
              staffRoles.map((role) => {
                const assignedBranchIds = role.user_role_branches.map(
                  (item) => item.branch_id,
                );

                return (
                  <article
                    key={role.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">
                          {role.users?.full_name ?? "Unknown user"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {role.users?.email ?? "No email"} | {role.role}
                        </p>
                      </div>
                      <div className="text-sm text-slate-500">{role.status}</div>
                    </div>

                    <form action={updateStaffRoleAction} className="mt-5 space-y-4">
                      <input type="hidden" name="roleId" value={role.id} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block space-y-2">
                          <span className="text-sm font-medium text-slate-700">
                            Status
                          </span>
                          <select
                            name="status"
                            defaultValue={role.status}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="archived">Archived</option>
                          </select>
                        </label>

                        <label className="block space-y-2">
                          <span className="text-sm font-medium text-slate-700">
                            Branch scope
                          </span>
                          <select
                            name="branchScopeType"
                            defaultValue={role.branch_scope_type}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                          >
                            <option value="all">All branches</option>
                            <option value="selected">Selected branches</option>
                          </select>
                        </label>
                      </div>

                      <fieldset className="space-y-2">
                        <legend className="text-sm font-medium text-slate-700">
                          Branch permissions
                        </legend>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {branches.map((branch) => (
                            <label
                              key={`${role.id}-${branch.id}`}
                              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                            >
                              <input
                                type="checkbox"
                                name="branchIds"
                                value={branch.id}
                                defaultChecked={assignedBranchIds.includes(branch.id)}
                              />
                              <span>
                                {branch.name}
                                {branch.code ? ` (${branch.code})` : ""}
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>

                      <button
                        type="submit"
                        className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                      >
                        Update access
                      </button>
                    </form>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
