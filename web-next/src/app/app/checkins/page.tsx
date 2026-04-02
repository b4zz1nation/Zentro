import { PageHeader } from "@/components/app-shell/page-header";
import { SectionGrid } from "@/components/app-shell/section-grid";

const sections = [
  {
    title: "Check-In Inputs",
    description:
      "This route will combine QR scanning and manual member lookup in one front-desk-safe layout.",
    items: [
      "QR scanner area above the fold",
      "Manual search by ID, name, phone, or email",
      "Branch-aware validation hooks",
    ],
  },
  {
    title: "Validation Result",
    description:
      "Result states must be immediate and large enough for quick operational decisions.",
    items: [
      "Success state with member summary",
      "Failure state with machine-readable reason codes",
      "Recent check-in history feed",
    ],
  },
];

export default function CheckinsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Check-In"
        title="Front desk validation flow"
        description="Phase 1 identified this as one of the highest-friction workflows, so the shell keeps it shallow and easy to reach."
      />
      <SectionGrid sections={sections} />
    </div>
  );
}
