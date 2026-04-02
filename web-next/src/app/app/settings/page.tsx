import { updateWorkspaceSettingsAction } from "@/app/app/settings/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { PhoneField } from "@/components/forms/phone-field";
import { requireRole } from "@/lib/auth/guards";
import { getWorkspaceSettings } from "@/lib/tenants/settings";

type SettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const context = await requireRole(["gym_owner", "super_admin"]);
  const { error, success } = await searchParams;
  const workspace = context.workspaceId
    ? await getWorkspaceSettings(context.workspaceId)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Workspace configuration"
        description="Persisted workspace profile settings for owners now live here. This is the first real settings module, not a placeholder."
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      {workspace ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Workspace profile
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Update the gym workspace identity, contact information, and basic
              brand color.
            </p>

            <form
              action={updateWorkspaceSettingsAction}
              className="mt-6 space-y-5"
            >
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Workspace name
                </span>
                <input
                  name="name"
                  type="text"
                  defaultValue={workspace.name}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Workspace slug
                </span>
                <input
                  name="slug"
                  type="text"
                  defaultValue={workspace.slug}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  required
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Contact email
                  </span>
                  <input
                    name="contactEmail"
                    type="email"
                    defaultValue={workspace.contact_email ?? ""}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>

                <PhoneField
                  label="Contact phone"
                  countryCodeName="contactPhoneCountryCode"
                  localNumberName="contactPhoneLocalNumber"
                  defaultValue={workspace.contact_phone}
                />
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Brand color
                </span>
                <input
                  name="brandingPrimaryColor"
                  type="text"
                  defaultValue={workspace.branding_primary_color ?? ""}
                  placeholder="#0f172a"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                />
              </label>

              <button
                type="submit"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Save settings
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Current profile snapshot
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This summary reflects the persisted tenant record currently used
              by the workspace.
            </p>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <dt className="font-medium text-slate-500">Name</dt>
                <dd className="mt-1 text-slate-950">{workspace.name}</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <dt className="font-medium text-slate-500">Slug</dt>
                <dd className="mt-1 text-slate-950">{workspace.slug}</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <dt className="font-medium text-slate-500">Contact email</dt>
                <dd className="mt-1 text-slate-950">
                  {workspace.contact_email || "Not set"}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <dt className="font-medium text-slate-500">Contact phone</dt>
                <dd className="mt-1 text-slate-950">
                  {workspace.contact_phone || "Not set"}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <dt className="font-medium text-slate-500">Brand color</dt>
                <dd className="mt-1 text-slate-950">
                  {workspace.branding_primary_color || "Not set"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      ) : null}
    </div>
  );
}
