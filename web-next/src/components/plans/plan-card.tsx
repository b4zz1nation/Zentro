"use client";

import { useEffect, useState } from "react";
import {
  changePlanStatusAction,
  deletePlanAction,
  updatePlanAction,
} from "@/app/app/plans/actions";
import { PlanForm } from "@/components/plans/plan-form";
import { getPlanPresetForRecord } from "@/lib/plans/presets";
import type { PlanRuleDefinition } from "@/lib/plans/rules";

type BranchOption = {
  id: string;
  name: string;
};

type PlanCardProps = {
  plan: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration_unit: string;
    duration_value: number;
    supports_renewal: boolean;
    supports_extension: boolean;
    supports_freeze: boolean;
    supports_suspension: boolean;
    access_scope: "all_branches" | "selected_branches";
    status: "active" | "inactive" | "archived";
    assignment_count?: number;
    plan_branch_access?: Array<{
      branch_id: string;
      branches?:
        | {
            id: string;
            name: string;
          }
        | {
            id: string;
            name: string;
          }[]
        | null;
    }>;
  };
  branches: BranchOption[];
  ruleDefinitions: readonly PlanRuleDefinition[];
};

export function PlanCard({ plan, branches, ruleDefinitions }: PlanCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const presetKey =
    getPlanPresetForRecord({
      name: plan.name,
      durationValue: plan.duration_value,
      durationUnit: plan.duration_unit,
    })?.key ?? "monthly";
  const selectedBranchNames = (plan.plan_branch_access ?? [])
    .map((entry) =>
      Array.isArray(entry.branches)
        ? (entry.branches[0]?.name ?? null)
        : (entry.branches?.name ?? null),
    )
    .filter(Boolean) as string[];
  const enabledRules = ruleDefinitions
    .filter((rule) =>
      rule.name === "supportsRenewal"
        ? plan.supports_renewal
        : rule.name === "supportsExtension"
          ? plan.supports_extension
          : rule.name === "supportsFreeze"
            ? plan.supports_freeze
            : plan.supports_suspension,
    )
    .map((rule) => rule.label);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">{plan.name}</p>
            <p className="mt-1 text-sm text-slate-600">
              {plan.duration_value} {plan.duration_unit} | ${plan.price}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                {plan.access_scope === "all_branches"
                  ? "All branches"
                  : `${selectedBranchNames.length} selected branch${
                      selectedBranchNames.length === 1 ? "" : "es"
                    }`}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                {plan.assignment_count ?? 0} assignment
                {(plan.assignment_count ?? 0) === 1 ? "" : "s"}
              </span>
            </div>
            {enabledRules.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {enabledRules.map((rule) => (
                  <span
                    key={`${plan.id}-${rule}`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            ) : null}
            {plan.access_scope === "selected_branches" &&
            selectedBranchNames.length > 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                {selectedBranchNames.join(", ")}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              {plan.status}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-full border border-cyan-200 px-4 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-50"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {plan.status !== "active" ? (
            <form action={changePlanStatusAction}>
              <input type="hidden" name="planId" value={plan.id} />
              <input type="hidden" name="status" value="active" />
              <button
                type="submit"
                className="rounded-full border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50"
              >
                Set active
              </button>
            </form>
          ) : null}
          {plan.status !== "inactive" ? (
            <form action={changePlanStatusAction}>
              <input type="hidden" name="planId" value={plan.id} />
              <input type="hidden" name="status" value="inactive" />
              <button
                type="submit"
                className="rounded-full border border-amber-200 px-3 py-2 text-xs font-medium text-amber-700 transition hover:bg-amber-50"
              >
                Set inactive
              </button>
            </form>
          ) : null}
          {plan.status !== "archived" ? (
            <form action={changePlanStatusAction}>
              <input type="hidden" name="planId" value={plan.id} />
              <input type="hidden" name="status" value="archived" />
              <button
                type="submit"
                className="rounded-full border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Archive
              </button>
            </form>
          ) : null}
        </div>
      </article>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                  Edit Plan
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                  {plan.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <form action={updatePlanAction} className="mt-6 space-y-4">
              <input type="hidden" name="planId" value={plan.id} />
              <PlanForm
                mode="edit"
                branches={branches}
                submitLabel="Save changes"
                defaultValues={{
                  planPreset: presetKey,
                  description: plan.description,
                  price: plan.price,
                  accessScope: plan.access_scope,
                  branchIds: plan.plan_branch_access?.map(
                    (item) => item.branch_id,
                  ),
                  supportsRenewal: plan.supports_renewal,
                  supportsExtension: plan.supports_extension,
                  supportsFreeze: plan.supports_freeze,
                  supportsSuspension: plan.supports_suspension,
                }}
              />
            </form>

            <form action={deletePlanAction} className="mt-4">
              <input type="hidden" name="planId" value={plan.id} />
              <button
                type="submit"
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
              >
                Delete plan
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
