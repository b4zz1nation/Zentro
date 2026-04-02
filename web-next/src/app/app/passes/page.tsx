import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderPanel } from "@/components/app-shell/placeholder-panel";

export default function PassesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Passes"
        title="Pass product management"
        description="Passes keep separate configuration and validation logic from memberships."
        actionLabel="Create Pass"
      />

      <PlaceholderPanel
        title="Pass rules placeholder"
        description="This module will handle validity windows, usage limits, and branch-level access constraints."
        items={[
          "Usage-based and short-duration products",
          "Selected-branch or all-branch access",
          "Manual sale and assignment flow integration",
        ]}
      />
    </div>
  );
}
