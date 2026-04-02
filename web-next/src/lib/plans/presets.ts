export type PlanPresetKey =
  | "day_pass"
  | "half_month"
  | "monthly"
  | "six_months"
  | "one_year";

export type PlanPreset = {
  key: PlanPresetKey;
  label: string;
  name: string;
  durationValue: number;
  durationUnit: "day" | "month" | "year";
};

export const PLAN_PRESETS: PlanPreset[] = [
  {
    key: "day_pass",
    label: "Day Pass",
    name: "Day Pass",
    durationValue: 1,
    durationUnit: "day",
  },
  {
    key: "half_month",
    label: "Half Month",
    name: "Half Month",
    durationValue: 15,
    durationUnit: "day",
  },
  {
    key: "monthly",
    label: "Monthly",
    name: "Monthly",
    durationValue: 1,
    durationUnit: "month",
  },
  {
    key: "six_months",
    label: "6 Months",
    name: "6 Months",
    durationValue: 6,
    durationUnit: "month",
  },
  {
    key: "one_year",
    label: "1 Year",
    name: "1 Year",
    durationValue: 1,
    durationUnit: "year",
  },
];

export function getPlanPreset(value: string) {
  return PLAN_PRESETS.find((preset) => preset.key === value) ?? null;
}

export function getPlanPresetForRecord(input: {
  name: string;
  durationValue: number;
  durationUnit: string;
}) {
  return (
    PLAN_PRESETS.find(
      (preset) =>
        preset.name === input.name &&
        preset.durationValue === input.durationValue &&
        preset.durationUnit === input.durationUnit,
    ) ?? null
  );
}
