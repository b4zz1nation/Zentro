import Link from "next/link";
import { acceptInviteAction } from "@/app/accept-invite/actions";
import { getAuthContext } from "@/lib/auth/profile";
import { getInvitationByToken } from "@/lib/invitations/service";

type AcceptInvitePageProps = {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
};

export default async function AcceptInvitePage({
  searchParams,
}: AcceptInvitePageProps) {
  const { token, error } = await searchParams;
  const context = await getAuthContext();
  const invitation = token ? await getInvitationByToken(token) : null;
  const loginHref = token
    ? `/login?next=${encodeURIComponent(`/accept-invite?token=${token}`)}`
    : "/login";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Invitation
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Accept workspace invitation
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Accept a staff invite after signing in with the same email address the
          owner invited.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {!token ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Missing invitation token.
          </div>
        ) : null}

        {token && !invitation ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Invitation not found.
          </div>
        ) : null}

        {invitation ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-600">
              Invited email:{" "}
              <span className="font-semibold text-slate-950">
                {invitation.email}
              </span>
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Role:{" "}
              <span className="font-semibold text-slate-950">
                {invitation.role}
              </span>
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Scope:{" "}
              <span className="font-semibold text-slate-950">
                {invitation.branch_scope_type === "all"
                  ? "All branches"
                  : "Selected branches"}
              </span>
            </p>
          </div>
        ) : null}

        {!context ? (
          <div className="mt-8 flex gap-3">
            <Link
              href={loginHref}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Sign in to accept
            </Link>
          </div>
        ) : invitation ? (
          <form action={acceptInviteAction} className="mt-8">
            <input type="hidden" name="token" value={token} />
            <button
              type="submit"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Accept invitation
            </button>
          </form>
        ) : null}
      </div>
    </main>
  );
}
