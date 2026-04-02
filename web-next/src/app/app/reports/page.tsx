import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderPanel } from "@/components/app-shell/placeholder-panel";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Operational and revenue reporting"
        description="Branch performance, active members, expired members, and revenue views will land here after the backend foundation is in place."
      />

      <PlaceholderPanel
        title="Report categories"
        description="The initial MVP reporting set is intentionally operational rather than deeply analytical."
        items={[
          "Active and expired members",
          "Daily, weekly, and monthly check-ins",
          "Revenue by plan, pass, and branch",
        ]}
      />
    </div>
  );
}
