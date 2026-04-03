"use client";

import { useState } from "react";
import {
  changePassStatusAction,
  deletePassAction,
  updatePassAction,
} from "@/app/app/passes/actions";
import { PassForm } from "@/components/passes/pass-form";
import type { PassRecord } from "@/lib/passes/service";

type BranchOption = {
  id: string;
  name: string;
};

type PassCardProps = {
  pass: PassRecord & {
    pass_branch_access?: Array<{
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
};

export function PassCard({ pass, branches }: PassCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedBranchIds = (pass.pass_branch_access ?? []).map(
    (item) => item.branch_id,
  );

  return (
    <>
      <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-950">
                {pass.name}
              </h3>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                {pass.status}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {pass.description || "No description provided."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
              <span>
                {pass.validity_value} {pass.validity_unit}
                {pass.validity_value === 1 ? "" : "s"}
              </span>
              <span>{pass.access_scope.replaceAll("_", " ")}</span>
              <span>
                {pass.usage_limit ? `${pass.usage_limit} use limit` : "Unlimited uses"}
              </span>
              <span>{pass.assignment_count ?? 0} assigned</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:min-w-[220px]">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
            >
              Edit
            </button>
            <form action={changePassStatusAction}>
              <input type="hidden" name="passId" value={pass.id} />
              <select
                name="status"
                defaultValue={pass.status}
                className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
              >
                Update status
              </button>
            </form>
          </div>
        </div>
      </article>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                  Edit Pass
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  {pass.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Close
              </button>
            </div>

            <form action={updatePassAction} className="mt-6 space-y-5">
              <input type="hidden" name="passId" value={pass.id} />
              <PassForm
                mode="edit"
                branches={branches}
                defaultValues={{
                  name: pass.name,
                  description: pass.description,
                  price: pass.price,
                  validityUnit: pass.validity_unit,
                  validityValue: pass.validity_value,
                  usageLimit: pass.usage_limit,
                  accessScope: pass.access_scope,
                  branchIds: selectedBranchIds,
                }}
                submitLabel="Save pass"
              />
            </form>

            <form action={deletePassAction} className="mt-6">
              <input type="hidden" name="passId" value={pass.id} />
              <button
                type="submit"
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                Delete pass
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
