import { PageHeader } from "@/components/app-shell/page-header";
import { assignMembershipAction } from "@/app/app/members/[id]/membership-actions";
import {
  archiveMemberAction,
  updateMemberAction,
} from "@/app/app/members/actions";
import { PhoneField } from "@/components/forms/phone-field";
import { requireRole } from "@/lib/auth/guards";
import { listWorkspaceBranches } from "@/lib/invitations/service";
import { listPlans } from "@/lib/plans/service";
import {
  getMemberById,
  listMemberCheckins,
  listMemberMembershipHistory,
  listMemberPayments,
} from "@/lib/members/service";

type MemberDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function MemberDetailPage({
  params,
  searchParams,
}: MemberDetailPageProps) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);
  const { id } = await params;
  const { success, error } = await searchParams;
  const member = context.workspaceId
    ? await getMemberById(id, context.workspaceId)
    : null;
  const branches = context.workspaceId
    ? await listWorkspaceBranches(context.workspaceId)
    : [];
  const plans = context.workspaceId ? await listPlans(context.workspaceId) : [];
  const checkins =
    context.workspaceId && member
      ? await listMemberCheckins(context.workspaceId, member.id)
      : [];
  const payments =
    context.workspaceId && member
      ? await listMemberPayments(context.workspaceId, member.id)
      : [];
  const memberships =
    context.workspaceId && member
      ? await listMemberMembershipHistory(context.workspaceId, member.id)
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
        eyebrow="Member Detail"
        title={
          member ? `${member.first_name} ${member.last_name}` : `Member ${id}`
        }
        description="Member profile, edit controls, archive action, and basic operational history."
        actionLabel="Renew Membership"
      />

      {member ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Edit member profile
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Update the core member record and save it in place.
                </p>
              </div>
              <form action={archiveMemberAction}>
                <input type="hidden" name="memberId" value={member.id} />
                <button
                  type="submit"
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                >
                  Archive
                </button>
              </form>
            </div>

            <form action={updateMemberAction} className="mt-6 space-y-5">
              <input type="hidden" name="memberId" value={member.id} />
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    First name
                  </span>
                  <input
                    name="firstName"
                    type="text"
                    defaultValue={member.first_name}
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
                    defaultValue={member.last_name}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                    required
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Member code
                  </span>
                  <input
                    name="externalMemberCode"
                    type="text"
                    defaultValue={member.external_member_code ?? ""}
                    readOnly
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Home branch
                  </span>
                  <select
                    name="homeBranchId"
                    defaultValue={member.home_branch_id ?? ""}
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
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    defaultValue={member.email ?? ""}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>
                <PhoneField
                  label="Phone"
                  countryCodeName="phoneCountryCode"
                  localNumberName="phoneLocalNumber"
                  defaultValue={member.phone}
                />
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Date of birth
                  </span>
                  <input
                    name="dateOfBirth"
                    type="date"
                    defaultValue={member.date_of_birth ?? ""}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Gender
                  </span>
                  <select
                    name="gender"
                    defaultValue={member.gender ?? ""}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
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
                    defaultValue={member.emergency_contact_name ?? ""}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>
                <PhoneField
                  label="Emergency phone"
                  countryCodeName="emergencyContactPhoneCountryCode"
                  localNumberName="emergencyContactPhoneLocalNumber"
                  defaultValue={member.emergency_contact_phone}
                />
                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    Notes
                  </span>
                  <textarea
                    name="notes"
                    rows={4}
                    defaultValue={member.notes ?? ""}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Save changes
              </button>
            </form>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">
                Assign membership
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Attach a plan to this member. Payment starts as pending until
                the sales flow is completed.
              </p>
              {plans.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
                  No plans available yet. Create a plan first in `/app/plans`.
                </div>
              ) : (
                <form
                  action={assignMembershipAction}
                  className="mt-5 space-y-4"
                >
                  <input type="hidden" name="memberId" value={member.id} />
                  <select
                    name="membershipPlanId"
                    defaultValue=""
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  >
                    <option value="" disabled>
                      Select a plan
                    </option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} | {plan.duration_value} {plan.duration_unit}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Assign membership
                  </button>
                </form>
              )}
            </div>

            {[
              {
                title: "Membership history",
                items: memberships,
              },
              {
                title: "Payment history",
                items: payments,
              },
              {
                title: "Attendance history",
                items: checkins,
              },
            ].map((section) => (
              <div
                key={section.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-950">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3">
                  {section.items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
                      No records yet.
                    </div>
                  ) : (
                    section.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                      >
                        <p className="text-sm font-semibold text-slate-950">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.detail}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                          {item.created_at.slice(0, 10)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
      ) : null}
    </div>
  );
}
