import { PageHeader } from "@/components/app-shell/page-header";
import { createPaymentAction } from "@/app/app/payments/actions";
import { requireRole } from "@/lib/auth/guards";
import { listWorkspaceBranches } from "@/lib/invitations/service";
import {
  listRecentPayments,
  searchMembersForPayments,
} from "@/lib/payments/service";

type PaymentsPageProps = {
  searchParams: Promise<{
    branchId?: string;
    q?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function PaymentsPage({
  searchParams,
}: PaymentsPageProps) {
  const context = await requireRole(["gym_owner", "staff", "super_admin"]);
  const { branchId, q, success, error } = await searchParams;

  if (!context.workspaceId) {
    return null;
  }

  const [branches, recentPayments] = await Promise.all([
    listWorkspaceBranches(context.workspaceId),
    listRecentPayments(
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
      ? await searchMembersForPayments(context.workspaceId, q)
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
        eyebrow="Payments"
        title="Manual revenue capture"
        description="Record membership sales, renewals, and adjustments against real members with a lightweight operational ledger."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Record payment
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Search a member first, then capture the payment details. If the
            member has a latest membership on file, the payment can clear its
            pending status automatically.
          </p>

          {availableBranches.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
              No accessible branches were found for your role.
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

              <div className="mt-6 space-y-4">
                {q?.trim() ? (
                  members.length > 0 ? (
                    members.map((member) => (
                      <div
                        key={member.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                      >
                        <div className="flex flex-col gap-4">
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
                              {member.latestMembership
                                ? `${member.latestMembership.planName} | payment ${member.latestMembership.paymentStatus}`
                                : "No linked membership yet"}
                            </p>
                          </div>

                          <form
                            action={createPaymentAction}
                            className="grid gap-4 md:grid-cols-2"
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
                            <input
                              type="hidden"
                              name="relatedMembershipId"
                              value={member.latestMembership?.id ?? ""}
                            />
                            <label className="block space-y-2">
                              <span className="text-sm font-medium text-slate-700">
                                Payment type
                              </span>
                              <select
                                name="paymentType"
                                defaultValue={
                                  member.latestMembership ? "renewal" : "adjustment"
                                }
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                              >
                                <option value="membership_sale">
                                  Membership sale
                                </option>
                                <option value="renewal">Renewal</option>
                                <option value="adjustment">Adjustment</option>
                                <option value="pass_sale">Pass sale</option>
                              </select>
                            </label>
                            <label className="block space-y-2">
                              <span className="text-sm font-medium text-slate-700">
                                Payment method
                              </span>
                              <select
                                name="paymentMethod"
                                defaultValue="cash"
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                              >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="bank_transfer">
                                  Bank transfer
                                </option>
                                <option value="mobile_wallet">
                                  Mobile wallet
                                </option>
                                <option value="other">Other</option>
                              </select>
                            </label>
                            <label className="block space-y-2">
                              <span className="text-sm font-medium text-slate-700">
                                Amount
                              </span>
                              <input
                                name="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                                required
                              />
                            </label>
                            <label className="block space-y-2">
                              <span className="text-sm font-medium text-slate-700">
                                Currency
                              </span>
                              <input
                                name="currency"
                                type="text"
                                defaultValue="USD"
                                maxLength={3}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase outline-none transition focus:border-cyan-500"
                              />
                            </label>
                            <label className="block space-y-2">
                              <span className="text-sm font-medium text-slate-700">
                                Receipt reference
                              </span>
                              <input
                                name="receiptReference"
                                type="text"
                                placeholder="Optional reference"
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                              />
                            </label>
                            <label className="block space-y-2">
                              <span className="text-sm font-medium text-slate-700">
                                Notes
                              </span>
                              <input
                                name="notes"
                                type="text"
                                placeholder="Optional note"
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                              />
                            </label>
                            <div className="md:col-span-2">
                              <button
                                type="submit"
                                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                              >
                                Record payment
                              </button>
                            </div>
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
                    Search for a member to start recording a payment.
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Recent payments
            </h2>
            <div className="mt-4 space-y-3">
              {recentPayments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
                  No payments recorded yet.
                </div>
              ) : (
                recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {payment.members
                            ? `${payment.members.first_name} ${payment.members.last_name}`
                            : "Unknown member"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {payment.payment_type.replaceAll("_", " ")} |{" "}
                          {payment.payment_method.replaceAll("_", " ")}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          {payment.receipt_reference
                            ? `Receipt: ${payment.receipt_reference}`
                            : "No receipt reference"}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                        {payment.currency} {Number(payment.amount).toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">
                      {payment.status} | {payment.paid_at.slice(0, 16).replace("T", " ")}
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
