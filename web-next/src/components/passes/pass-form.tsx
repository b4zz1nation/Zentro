"use client";

import { useMemo, useState } from "react";

type BranchOption = {
  id: string;
  name: string;
};

type PassFormProps = {
  mode: "create" | "edit";
  branches: BranchOption[];
  defaultValues?: {
    name?: string;
    description?: string | null;
    price?: number;
    validityUnit?: string;
    validityValue?: number;
    usageLimit?: number | null;
    accessScope?: "all_branches" | "selected_branches";
    branchIds?: string[];
  };
  submitLabel: string;
};

export function PassForm({
  mode,
  branches,
  defaultValues,
  submitLabel,
}: PassFormProps) {
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
        <span className="text-sm font-medium text-slate-700">Pass name</span>
        <input
          name="name"
          type="text"
          defaultValue={defaultValues?.name ?? ""}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
          required
        />
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

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Usage limit</span>
        <input
          name="usageLimit"
          type="number"
          min="1"
          step="1"
          defaultValue={defaultValues?.usageLimit ?? ""}
          placeholder="Leave blank for unlimited"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Validity unit</span>
        <select
          name="validityUnit"
          defaultValue={defaultValues?.validityUnit ?? "day"}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
        >
          <option value="day">Days</option>
          <option value="week">Weeks</option>
          <option value="month">Months</option>
          <option value="year">Years</option>
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Validity value</span>
        <input
          name="validityValue"
          type="number"
          min="1"
          step="1"
          defaultValue={defaultValues?.validityValue ?? 1}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
          required
        />
      </label>

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
