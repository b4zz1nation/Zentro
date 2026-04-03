import { describe, expect, it } from "vitest";
import {
  getPlanPreset,
  getPlanPresetForRecord,
  PLAN_PRESETS,
} from "@/lib/plans/presets";

describe("PLAN_PRESETS", () => {
  it("exposes the expected fixed plan choices", () => {
    expect(PLAN_PRESETS.map((preset) => preset.label)).toEqual([
      "Day Pass",
      "Half Month",
      "Monthly",
      "6 Months",
      "1 Year",
    ]);
  });
});

describe("getPlanPreset", () => {
  it("finds a preset by key", () => {
    expect(getPlanPreset("monthly")?.durationUnit).toBe("month");
  });

  it("returns null for an unknown key", () => {
    expect(getPlanPreset("unknown")).toBeNull();
  });
});

describe("getPlanPresetForRecord", () => {
  it("matches a plan record to a preset", () => {
    expect(
      getPlanPresetForRecord({
        name: "6 Months",
        durationValue: 6,
        durationUnit: "month",
      })?.key,
    ).toBe("six_months");
  });

  it("returns null when the record does not match a preset", () => {
    expect(
      getPlanPresetForRecord({
        name: "Custom",
        durationValue: 2,
        durationUnit: "month",
      }),
    ).toBeNull();
  });
});
