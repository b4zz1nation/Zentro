export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Loading
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Preparing the workspace
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Route-level loading baseline for the App Router. Later phases can add
          section-specific skeletons.
        </p>
      </div>
    </main>
  );
}
