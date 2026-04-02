import Link from "next/link";
import { getAuthContext } from "@/lib/auth/profile";

export default async function AuthDebugPage() {
  const context = await getAuthContext();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Auth Debug
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Current auth bootstrap state
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          This is a temporary internal page to verify Supabase session, profile
          bootstrap, and workspace role resolution.
        </p>

        <pre className="mt-8 overflow-x-auto rounded-3xl bg-slate-950 p-6 text-sm text-slate-100">
          {JSON.stringify(context, null, 2)}
        </pre>

        <div className="mt-6 flex gap-3">
          <Link
            href="/login"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Login
          </Link>
          <Link
            href="/app/dashboard"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
