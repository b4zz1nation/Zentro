export type PlanRuleDefinition = {
  name:
    | "supportsRenewal"
    | "supportsExtension"
    | "supportsFreeze"
    | "supportsSuspension";
  label: string;
  description: string;
};

export const PLAN_RULE_DEFINITIONS: readonly PlanRuleDefinition[] = [
  {
    name: "supportsRenewal",
    label: "Supports renewal",
    description:
      "Allows staff to extend an active or expired membership by starting a new billing cycle from the renewal flow.",
  },
  {
    name: "supportsExtension",
    label: "Supports extension",
    description:
      "Allows staff to manually add extra validity without running a full renewal sale.",
  },
  {
    name: "supportsFreeze",
    label: "Supports freeze",
    description:
      "Allows the membership to be paused temporarily while preserving remaining time for later reactivation.",
  },
  {
    name: "supportsSuspension",
    label: "Supports suspension",
    description:
      "Allows staff to block access temporarily for policy or payment reasons without deleting the record.",
  },
] as const;
