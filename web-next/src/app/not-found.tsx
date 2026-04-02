import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Route not found
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          The requested route does not exist yet or was typed incorrectly.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Go home
          </Link>
          <Link
            href="/app/dashboard"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
