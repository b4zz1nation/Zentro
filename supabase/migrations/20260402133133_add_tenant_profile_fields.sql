alter table public.tenants
  add column if not exists contact_email citext,
  add column if not exists contact_phone text,
  add column if not exists branding_primary_color text;
