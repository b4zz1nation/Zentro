import { createAdminClient } from "@/lib/supabase/admin";
import { createReadOnlyClient } from "@/lib/supabase/server";

export type WorkspaceSettings = {
  id: string;
  name: string;
  slug: string;
  contact_email: string | null;
  contact_phone: string | null;
  branding_primary_color: string | null;
};

export async function getWorkspaceSettings(tenantId: string) {
  const supabase = await createReadOnlyClient();
  const { data, error } = await supabase
    .from("tenants")
    .select(
      "id, name, slug, contact_email, contact_phone, branding_primary_color",
    )
    .eq("id", tenantId)
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to load workspace settings: ${error?.message ?? "Unknown error"}`,
    );
  }

  return data as WorkspaceSettings;
}

export async function updateWorkspaceSettings(input: {
  tenantId: string;
  name: string;
  slug: string;
  contactEmail?: string;
  contactPhone?: string;
  brandingPrimaryColor?: string;
}) {
  const admin = createAdminClient();
  const normalizedSlug = input.slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

  if (!input.name.trim() || !normalizedSlug) {
    throw new Error("Workspace name and slug are required.");
  }

  const { error } = await admin
    .from("tenants")
    .update({
      name: input.name.trim(),
      slug: normalizedSlug,
      contact_email: input.contactEmail?.trim() || null,
      contact_phone: input.contactPhone?.trim() || null,
      branding_primary_color: input.brandingPrimaryColor?.trim() || null,
    })
    .eq("id", input.tenantId);

  if (error) {
    throw new Error(`Failed to update workspace settings: ${error.message}`);
  }
}
