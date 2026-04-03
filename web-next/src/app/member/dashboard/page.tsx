import { redirect } from "next/navigation";
import { PageHeader } from "@/components/app-shell/page-header";
import { requireAuth } from "@/lib/auth/guards";
import { getMemberPortalData } from "@/lib/member-portal/service";

export default async function MemberDashboardPage() {
  const context = await requireAuth();

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  if (context.role !== "member") {
    redirect("/app/dashboard");
  }

  const portal = await getMemberPortalData({
    tenantId: context.workspaceId,
    email: context.email,
    userId: context.profileId,
  });

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ecfeff_0%,#f8fafc_22%,#f8fafc_100%)] px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          eyebrow="Member Dashboard"
          title={
            portal
              ? `${portal.member.first_name} ${portal.member.last_name}`
              : "Member access"
          }
          description="View your membership status, recent attendance, and payment history."
        />

        {!portal ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-amber-900">
              Member record not linked yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              This account has a member role, but no member record with the same
              email was found in the workspace. Ask gym staff to update the
              member email so it matches this login.
            </p>
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Member Code",
                  value: portal.member.external_member_code ?? "Not assigned",
                  hint: "Your member reference.",
                },
                {
                  label: "Current Status",
                  value: portal.currentStatus
                    ? portal.currentStatus.replaceAll("_", " ")
                    : "No membership",
                  hint: "Computed from your latest membership.",
                },
                {
                  label: "Home Branch",
                  value: portal.member.branches?.name ?? "Not set",
                  hint: "Your current branch assignment.",
                },
                {
                  label: "Recent Check-Ins",
                  value: String(portal.checkins.length),
                  hint: "Latest attendance events loaded below.",
                },
              ].map((item) => (
                <article
                  key={item.label}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                    {item.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.hint}
                  </p>
                </article>
              ))}
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">
                  Current membership
                </h2>
                {portal.latestMembership ? (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-950">
                      {portal.latestMembership.membership_plans?.name ??
                        "Membership"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {portal.latestMembership.start_at.slice(0, 10)} to{" "}
                      {portal.latestMembership.end_at.slice(0, 10)}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Payment: {portal.latestMembership.payment_status}
                    </p>
                    {portal.latestMembership.status_reason ? (
                      <p className="mt-2 text-sm text-slate-500">
                        {portal.latestMembership.status_reason}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
                    No membership assigned yet.
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">
                  Profile summary
                </h2>
                <dl className="mt-5 space-y-4 text-sm">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <dt className="font-medium text-slate-500">Email</dt>
                    <dd className="mt-1 text-slate-950">
                      {portal.member.email || "Not set"}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <dt className="font-medium text-slate-500">Phone</dt>
                    <dd className="mt-1 text-slate-950">
                      {portal.member.phone || "Not set"}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <dt className="font-medium text-slate-500">
                      Emergency Contact
                    </dt>
                    <dd className="mt-1 text-slate-950">
                      {portal.member.emergency_contact_name || "Not set"}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              {[
                {
                  title: "Membership history",
                  items: portal.memberships,
                },
                {
                  title: "Payment history",
                  items: portal.payments,
                },
                {
                  title: "Check-in history",
                  items: portal.checkins,
                },
              ].map((section) => (
                <section
                  key={section.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-slate-950">
                    {section.title}
                  </h2>
                  <div className="mt-5 space-y-3">
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
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
