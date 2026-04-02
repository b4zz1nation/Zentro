import { signOutAction } from "@/app/app/actions";

type TopbarProps = {
  title: string;
  description: string;
  branchLabel?: string;
  userLabel?: string;
};

export function Topbar({
  title,
  description,
  branchLabel,
  userLabel,
}: TopbarProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white/90 px-6 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Active Branch
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
          {branchLabel ?? "All Branches"}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500">
            {userLabel ?? "Authenticated session"}
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
