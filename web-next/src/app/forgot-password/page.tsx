import Link from "next/link";
import { forgotPasswordAction } from "@/app/forgot-password/actions";

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { error, success } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Password Reset
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Reset access
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Request a password reset email through Supabase Auth.
        </p>
        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}
        <form action={forgotPasswordAction} className="mt-8 space-y-4">
          <input
            name="email"
            type="email"
            placeholder="owner@gym.com"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            required
          />
          <button
            type="submit"
            className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Send reset link
          </button>
        </form>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-cyan-700"
        >
          Return to login
        </Link>
      </div>
    </main>
  );
}