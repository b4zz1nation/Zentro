import { redirect } from "next/navigation";
import { createWorkspaceAction } from "@/app/onboarding/actions";
import { PhoneField } from "@/components/forms/phone-field";
import { requireAuth } from "@/lib/auth/guards";

type OnboardingPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const context = await requireAuth();
  const { error } = await searchParams;

  if (context.workspaceId) {
    redirect("/app/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-xl shadow-slate-900/10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Onboarding
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Set up the first workspace and branch
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Finish the owner setup by creating the first workspace and branch
            tied to your authenticated user profile.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="space-y-5">
            {[
              {
                step: "Step 1",
                title: "Workspace",
                text: "Set the gym workspace name and public-safe slug.",
              },
              {
                step: "Step 2",
                title: "First Branch",
                text: "Create the first operating branch for member and staff scope.",
              },
              {
                step: "Step 3",
                title: "Owner Role",
                text: "Your current authenticated profile will be assigned as gym owner.",
              },
            ].map((card) => (
              <article
                key={card.step}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                  {card.step}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-slate-950">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {card.text}
                </p>
              </article>
            ))}
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
              Owner Setup
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Create your workspace
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Signed in as{" "}
              <span className="font-semibold">
                {context.email ?? context.fullName}
              </span>
              .
            </p>

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <form action={createWorkspaceAction} className="mt-8 space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    Workspace name
                  </span>
                  <input
                    name="workspaceName"
                    type="text"
                    placeholder="Zentro Fitness"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                    required
                  />
                </label>

                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    Workspace slug
                  </span>
                  <input
                    name="workspaceSlug"
                    type="text"
                    placeholder="zentro-fitness"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Contact email
                  </span>
                  <input
                    name="contactEmail"
                    type="email"
                    defaultValue={context.email ?? ""}
                    placeholder="hello@gym.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>

                <PhoneField
                  label="Contact phone"
                  countryCodeName="contactPhoneCountryCode"
                  localNumberName="contactPhoneLocalNumber"
                  placeholder="555 000 0000"
                />

                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    Brand color
                  </span>
                  <input
                    name="brandingPrimaryColor"
                    type="text"
                    placeholder="#0f172a"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Branch name
                  </span>
                  <input
                    name="branchName"
                    type="text"
                    placeholder="Central Branch"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                    required
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Branch code
                  </span>
                  <input
                    name="branchCode"
                    type="text"
                    placeholder="CENTRAL"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>

                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    Branch address
                  </span>
                  <textarea
                    name="branchAddress"
                    rows={4}
                    placeholder="Street, district, city"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create workspace and continue
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
