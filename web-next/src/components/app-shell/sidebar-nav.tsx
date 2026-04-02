import Link from "next/link";

const primaryLinks = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/members", label: "Members" },
  { href: "/app/checkins", label: "Check-In" },
  { href: "/app/payments", label: "Payments" },
  { href: "/app/plans", label: "Plans" },
  { href: "/app/passes", label: "Passes" },
  { href: "/app/reports", label: "Reports" },
];

const adminLinks = [
  { href: "/app/branches", label: "Branches" },
  { href: "/app/staff", label: "Staff" },
  { href: "/app/settings", label: "Settings" },
];

type SidebarNavProps = {
  className?: string;
  workspaceName?: string;
  roleLabel?: string;
};

export function SidebarNav({
  className = "",
  workspaceName,
  roleLabel,
}: SidebarNavProps) {
  return (
    <aside
      className={[
        "flex h-full w-full max-w-72 flex-col justify-between border-r border-white/10 bg-slate-950 px-5 py-6 text-slate-200",
        className,
      ].join(" ")}
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Zentro
            </p>
            <h1 className="mt-2 text-xl font-semibold text-white">
              Gym Operations
            </h1>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Workspace
            </p>
            <p className="mt-1 text-sm font-medium text-white">
              {workspaceName ?? "Workspace Pending"}
            </p>
          </div>
        </div>

        <nav className="space-y-6">
          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Operations
            </p>
            <div className="space-y-1">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Admin
            </p>
            <div className="space-y-1">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>

      <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">
          Current Role
        </p>
        <p className="mt-1 text-sm font-medium text-white">Gym Owner</p>
        {roleLabel ? (
          <p className="mt-1 text-xs text-cyan-100">{roleLabel}</p>
        ) : null}
      </div>
    </aside>
  );
}
