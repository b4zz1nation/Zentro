"use client";

import { useMemo, useState } from "react";
import { InfoPopover } from "@/components/forms/info-popover";
import { PLAN_PRESETS, type PlanPresetKey } from "@/lib/plans/presets";
import { PLAN_RULE_DEFINITIONS } from "@/lib/plans/rules";

type BranchOption = {
  id: string;
  name: string;
};

type PlanFormProps = {
  mode: "create" | "edit";
  branches: BranchOption[];
  defaultValues?: {
    planPreset?: PlanPresetKey;
    description?: string | null;
    price?: number;
    accessScope?: "all_branches" | "selected_branches";
    branchIds?: string[];
    supportsRenewal?: boolean;
    supportsExtension?: boolean;
    supportsFreeze?: boolean;
    supportsSuspension?: boolean;
  };
  submitLabel: string;
};

export function PlanForm({
  mode,
  branches,
  defaultValues,
  submitLabel,
}: PlanFormProps) {
  const [accessScope, setAccessScope] = useState(
    defaultValues?.accessScope ?? "all_branches",
  );
  const defaultBranchIds = useMemo(
    () => new Set(defaultValues?.branchIds ?? []),
    [defaultValues?.branchIds],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block space-y-2 sm:col-span-2">
        <span className="text-sm font-medium text-slate-700">Plan type</span>
        <select
          name="planPreset"
          defaultValue={defaultValues?.planPreset ?? "monthly"}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
          required
        >
          {PLAN_PRESETS.map((preset) => (
            <option key={preset.key} value={preset.key}>
              {preset.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2 sm:col-span-2">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Price</span>
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={defaultValues?.price ?? 0}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
          required
        />
      </label>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        Duration is set automatically from the selected plan type.
      </div>

      <fieldset className="space-y-2 sm:col-span-2">
        <legend className="text-sm font-medium text-slate-700">
          Access scope
        </legend>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <input
            type="radio"
            name="accessScope"
            value="all_branches"
            defaultChecked={accessScope === "all_branches"}
            onChange={() => setAccessScope("all_branches")}
          />
          All branches
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <input
            type="radio"
            name="accessScope"
            value="selected_branches"
            defaultChecked={accessScope === "selected_branches"}
            onChange={() => setAccessScope("selected_branches")}
          />
          Selected branches
        </label>
      </fieldset>

      <fieldset className="space-y-2 sm:col-span-2">
        <legend className="text-sm font-medium text-slate-700">
          Branch access
        </legend>
        <div className="space-y-2">
          {branches.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
              No branches available yet.
            </div>
          ) : (
            branches.map((branch) => (
              <label
                key={`${mode}-${branch.id}`}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
                  accessScope === "selected_branches"
                    ? "border-slate-200 bg-slate-50 text-slate-700"
                    : "border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  name="branchIds"
                  value={branch.id}
                  defaultChecked={defaultBranchIds.has(branch.id)}
                  disabled={accessScope !== "selected_branches"}
                />
                {branch.name}
              </label>
            ))
          )}
        </div>
        {accessScope === "all_branches" ? (
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Branch selection is ignored while all branches is enabled.
          </p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-2 sm:col-span-2">
        <legend className="text-sm font-medium text-slate-700">Rules</legend>
        {PLAN_RULE_DEFINITIONS.map((rule) => (
          <label
            key={`${mode}-${rule.name}`}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          >
            <input
              type="checkbox"
              name={rule.name}
              defaultChecked={
                rule.name === "supportsRenewal"
                  ? (defaultValues?.supportsRenewal ?? true)
                  : rule.name === "supportsExtension"
                    ? (defaultValues?.supportsExtension ?? false)
                    : rule.name === "supportsFreeze"
                      ? (defaultValues?.supportsFreeze ?? false)
                      : (defaultValues?.supportsSuspension ?? true)
              }
            />
            <span className="inline-flex items-center gap-2">
              <span>{rule.label}</span>
              <InfoPopover
                title={rule.label}
                description={rule.description}
              />
            </span>
          </label>
        ))}
      </fieldset>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
