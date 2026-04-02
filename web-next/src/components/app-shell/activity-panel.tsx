type ActivityPanelProps = {
  title: string;
  description: string;
  items: Array<{
    id: string;
    label: string;
    detail: string;
    createdAt: string;
  }>;
};

export function ActivityPanel({
  title,
  description,
  items,
}: ActivityPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
            No records yet.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <p className="text-sm font-semibold text-slate-950">{item.label}</p>
              <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                {item.createdAt.slice(0, 10)}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
