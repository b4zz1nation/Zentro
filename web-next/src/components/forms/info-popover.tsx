type InfoPopoverProps = {
  title: string;
  description: string;
};

export function InfoPopover({ title, description }: InfoPopoverProps) {
  return (
    <span className="group relative inline-flex items-center">
      <span
        tabIndex={0}
        aria-label={`More info about ${title}`}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500 outline-none transition hover:border-cyan-500 hover:text-cyan-700 focus:border-cyan-500 focus:text-cyan-700"
      >
        ?
      </span>
      <span className="pointer-events-none absolute bottom-[calc(100%+0.75rem)] left-1/2 z-20 hidden w-64 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-xl group-hover:block group-focus-within:block">
        <span className="block text-sm font-semibold text-slate-950">
          {title}
        </span>
        <span className="mt-1 block text-sm leading-6 text-slate-600">
          {description}
        </span>
      </span>
    </span>
  );
}
