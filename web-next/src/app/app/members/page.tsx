import Link from "next/link";
import { createMemberAction } from "@/app/app/members/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { PhoneField } from "@/components/forms/phone-field";
import { requireRole } from "@/lib/auth/guards";
import { listWorkspaceBranches } from "@/lib/invitations/service";
import { listMembers } from "@/lib/members/service";
import { listPlans } from "@/lib/plans/service";

type MembersPageProps = {
  searchParams: Promise<{
    error?: string;
    q?: string;
  }>;
};

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);
  const { error, q } = await searchParams;
  const [branches, plans, members] = context.workspaceId
    ? await Promise.all([
        listWorkspaceBranches(context.workspaceId),
        listPlans(context.workspaceId),
        listMembers(context.workspaceId, q),
      ])
    : [[], [], []];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Members"
        title="Member list and search"
        description="Real member records now live here with create, search, and detail access wired to Supabase."
        actionLabel="Add Member"
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Create member
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Capture the core member record now. Memberships, passes, payments,
            and attendance will build on this.
          </p>

          <form action={createMemberAction} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  First name
                </span>
                <input
                  name="firstName"
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Last name
                </span>
                <input
                  name="lastName"
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  required
                />
              </label>

              <div className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Member code
                </span>
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Generated automatically when the member is created.
                </div>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Home branch
                </span>
                <select
                  name="homeBranchId"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                >
                  <option value="">No branch selected</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Membership
                </span>
                <select
                  name="membershipPlanId"
                  defaultValue=""
                  disabled={plans.length === 0}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    {plans.length === 0
                      ? "No plans available"
                      : "No membership yet"}
                  </option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                />
              </label>

              <PhoneField
                label="Phone"
                countryCodeName="phoneCountryCode"
                localNumberName="phoneLocalNumber"
              />

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Date of birth
                </span>
                <input
                  name="dateOfBirth"
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Gender
                </span>
                <select
                  name="gender"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  defaultValue=""
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Emergency contact
                </span>
                <input
                  name="emergencyContactName"
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                />
              </label>

              <PhoneField
                label="Emergency phone"
                countryCodeName="emergencyContactPhoneCountryCode"
                localNumberName="emergencyContactPhoneLocalNumber"
              />

              <label className="block space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">
                  Notes
                </span>
                <textarea
                  name="notes"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                />
              </label>
            </div>

            <button
              type="submit"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Save member
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Member records
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Search by name, email, phone, or member code.
              </p>
            </div>
            <form className="w-full max-w-sm">
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search members"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
              />
            </form>
          </div>

          <div className="mt-6 space-y-4">
            {members.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
                No members found yet.
              </div>
            ) : (
              members.map((member) => (
                <Link
                  key={member.id}
                  href={`/app/members/${member.id}`}
                  className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-300 hover:bg-white"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {member.email || member.phone || "No contact info"}
                      </p>
                    </div>
                    <div className="text-sm text-slate-500">
                      {member.branches?.name || "No branch"}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                    <span>{member.status}</span>
                    {member.external_member_code ? (
                      <span>{member.external_member_code}</span>
                    ) : null}
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
