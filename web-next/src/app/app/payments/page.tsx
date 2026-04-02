import { PageHeader } from "@/components/app-shell/page-header";
import { SectionGrid } from "@/components/app-shell/section-grid";

const sections = [
  {
    title: "Payment Entry",
    description:
      "Payments are manual in MVP and must link back to the member and related membership or pass context.",
    items: [
      "Amount, method, paid date, and receipt reference",
      "Related member and product linkage",
      "Later support for renewal and sale flows",
    ],
  },
  {
    title: "Payment History",
    description:
      "This section becomes the operational ledger for owners and staff with proper filters in later phases.",
    items: [
      "Recent payments list",
      "Revenue summary widgets",
      "Member-level payment drill-in",
    ],
  },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Payments"
        title="Manual revenue capture"
        description="The baseline route matches the Phase 0 decision to keep MVP payments manual before gateway work."
        actionLabel="Record Payment"
      />
      <SectionGrid sections={sections} />
    </div>
  );
}
