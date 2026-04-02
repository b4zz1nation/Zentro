import { SidebarNav } from "@/components/app-shell/sidebar-nav";
import { Topbar } from "@/components/app-shell/topbar";
import { requireWorkspace } from "@/lib/auth/guards";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const context = await requireWorkspace();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,#f8fafc_18%,#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <div className="lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:flex-none">
          <SidebarNav
            className="max-w-none lg:w-72"
            workspaceName={context.workspaceName}
            roleLabel={context.role.replace("_", " ")}
          />
        </div>

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar
            title="Operations Workspace"
            description="Shared shell baseline for dashboard, members, products, and reporting routes."
            branchLabel={
              context.branchIds.length > 0
                ? `${context.branchIds.length} assigned branch${
                    context.branchIds.length === 1 ? "" : "es"
                  }`
                : "All Branches"
            }
            userLabel={context.email ?? context.fullName}
          />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
