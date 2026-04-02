import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderPanel } from "@/components/app-shell/placeholder-panel";

export default function BranchesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Branches"
        title="Branch administration"
        description="Owners will manage branch records, status, and later branch-specific operational settings from this area."
        actionLabel="Add Branch"
      />

      <PlaceholderPanel
        title="Branch controls"
        description="Branch scoping is central to the multi-tenant design and will be enforced in backend logic later."
        items={[
          "Create and edit branches",
          "Activate or deactivate a branch",
          "Manage branch-aware permissions and filters",
        ]}
      />
    </div>
  );
}
