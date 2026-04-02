import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAction } from "@/app/login/actions";
import { getAuthContext } from "@/lib/auth/profile";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const context = await getAuthContext();
  const { error, next } = await searchParams;

  if (context?.workspaceId) {
    redirect("/app/dashboard");
  }

  if (context && !context.workspaceId) {
    redirect("/onboarding");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#cffafe_0%,#f8fafc_45%,#e2e8f0_100%)] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-2xl shadow-slate-900/10 backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <section className="bg-slate-950 px-8 py-10 text-slate-100 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Zentro
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">
            Gym operations without the spreadsheet drag.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            Sign in with your Supabase email and password to enter onboarding or
            the authenticated workspace.
          </p>
          <div className="mt-10 space-y-4">
            {[
              "Role-aware workspace access",
              "Branch-aware front desk workflows",
              "Member, payment, and check-in operations",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="px-8 py-10 sm:px-10">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-medium text-slate-500">
              Sign in to continue
            </p>
            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
            <form action={signInAction} className="mt-8 space-y-5">
              <input type="hidden" name="next" value={next ?? ""} />
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="owner@gym.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  required
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Password
                </span>
                <input
                  name="password"
                  type="password"
                  placeholder="********"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  required
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm">
              <Link
                href="/"
                className="text-slate-500 transition hover:text-slate-950"
              >
                Back to home
              </Link>
              <Link
                href="/forgot-password"
                className="font-medium text-cyan-700 transition hover:text-cyan-900"
              >
                Forgot password
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
