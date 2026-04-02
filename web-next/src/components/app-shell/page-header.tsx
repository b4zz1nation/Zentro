type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>

      {actionLabel ? (
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
