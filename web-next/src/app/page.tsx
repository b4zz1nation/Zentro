import Link from "next/link";

const highlights = [
  "Multi-tenant workspace design",
  "Branch-aware access and operations",
  "Membership, payments, and check-in workflows",
];

const nextSteps = [
  { href: "/login", label: "Open Login" },
  { href: "/onboarding", label: "View Onboarding" },
  { href: "/app/dashboard", label: "Enter App Shell" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen items-center bg-[radial-gradient(circle_at_top_left,#cffafe_0%,#eff6ff_24%,#f8fafc_58%,#e2e8f0_100%)] px-4 py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-900/15 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Zentro
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight">
            Web operations foundation for modern gym teams.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            The Phase 2 baseline now includes a public landing page, auth route
            placeholders, and a shared `/app` shell that matches the planning
            docs for dashboard, members, payments, and check-in workflows.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-xl shadow-slate-900/10 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
            Current Build
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Phase 2 app shell baseline
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The current implementation focuses on route scaffolding, layout
            consistency, and placeholder modules before backend integration.
          </p>
          <div className="mt-8 space-y-3">
            {nextSteps.map((step) => (
              <Link
                key={step.href}
                href={step.href}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-800 transition hover:border-cyan-400 hover:bg-white"
              >
                {step.label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
