create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug citext not null unique,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  code text,
  address text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, name),
  unique (tenant_id, code)
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  full_name text not null,
  email citext not null unique,
  phone text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role public.app_role not null,
  branch_scope_type public.branch_scope_type not null default 'all',
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, user_id, role)
);

create table if not exists public.user_role_branches (
  id uuid primary key default gen_random_uuid(),
  user_role_id uuid not null references public.user_roles(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_role_id, branch_id)
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  home_branch_id uuid references public.branches(id) on delete set null,
  external_member_code text,
  first_name text not null,
  last_name text not null,
  email citext,
  phone text,
  date_of_birth date,
  gender text,
  joined_at timestamptz not null default timezone('utc', now()),
  archived_at timestamptz,
  notes text,
  emergency_contact_name text,
  emergency_contact_phone text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, external_member_code)
);

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  duration_unit text not null,
  duration_value integer not null check (duration_value > 0),
  supports_renewal boolean not null default true,
  supports_extension boolean not null default false,
  supports_freeze boolean not null default false,
  supports_suspension boolean not null default true,
  access_scope public.access_scope_type not null default 'all_branches',
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, name)
);

create table if not exists public.plan_branch_access (
  id uuid primary key default gen_random_uuid(),
  membership_plan_id uuid not null references public.membership_plans(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (membership_plan_id, branch_id)
);

create table if not exists public.member_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  membership_plan_id uuid not null references public.membership_plans(id) on delete restrict,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status public.membership_state not null default 'inactive',
  status_reason text,
  payment_status public.payment_state not null default 'pending',
  remaining_freeze_days integer not null default 0 check (remaining_freeze_days >= 0),
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (end_at > start_at)
);

create table if not exists public.membership_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  member_membership_id uuid not null references public.member_memberships(id) on delete cascade,
  event_type text not null,
  effective_at timestamptz not null default timezone('utc', now()),
  meta jsonb not null default '{}'::jsonb,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.passes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  validity_unit text not null,
  validity_value integer not null check (validity_value > 0),
  usage_limit integer,
  access_scope public.access_scope_type not null default 'all_branches',
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, name)
);

create table if not exists public.pass_branch_access (
  id uuid primary key default gen_random_uuid(),
  pass_id uuid not null references public.passes(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (pass_id, branch_id)
);

create table if not exists public.member_passes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  pass_id uuid not null references public.passes(id) on delete restrict,
  start_at timestamptz not null,
  end_at timestamptz not null,
  remaining_uses integer,
  status public.membership_state not null default 'inactive',
  status_reason text,
  payment_status public.payment_state not null default 'pending',
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (end_at >= start_at),
  check (remaining_uses is null or remaining_uses >= 0)
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete restrict,
  member_id uuid not null references public.members(id) on delete cascade,
  checkin_method public.checkin_method_type not null,
  result public.checkin_result_type not null,
  result_reason text,
  source_membership_id uuid references public.member_memberships(id) on delete set null,
  source_member_pass_id uuid references public.member_passes(id) on delete set null,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  member_id uuid not null references public.members(id) on delete cascade,
  payment_type public.payment_type not null,
  related_membership_id uuid references public.member_memberships(id) on delete set null,
  related_member_pass_id uuid references public.member_passes(id) on delete set null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'USD',
  payment_method public.payment_method_type not null default 'cash',
  receipt_reference text,
  status public.payment_state not null default 'paid',
  notes text,
  paid_at timestamptz not null default timezone('utc', now()),
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email citext not null,
  role public.app_role not null,
  branch_scope_type public.branch_scope_type not null default 'selected',
  status public.invitation_status not null default 'pending',
  token text not null default replace(gen_random_uuid()::text, '-', ''),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, email, token)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  member_id uuid references public.members(id) on delete cascade,
  type text not null,
  status public.notification_status not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  actor_user_id uuid references public.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_branches_tenant_id on public.branches(tenant_id);
create index if not exists idx_user_roles_tenant_id on public.user_roles(tenant_id);
create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_members_tenant_id on public.members(tenant_id);
create index if not exists idx_members_home_branch_id on public.members(home_branch_id);
create index if not exists idx_member_memberships_tenant_id on public.member_memberships(tenant_id);
create index if not exists idx_member_memberships_member_id on public.member_memberships(member_id);
create index if not exists idx_member_passes_tenant_id on public.member_passes(tenant_id);
create index if not exists idx_member_passes_member_id on public.member_passes(member_id);
create index if not exists idx_checkins_tenant_id on public.checkins(tenant_id);
create index if not exists idx_checkins_branch_id on public.checkins(branch_id);
create index if not exists idx_checkins_member_id on public.checkins(member_id);
create index if not exists idx_payments_tenant_id on public.payments(tenant_id);
create index if not exists idx_payments_member_id on public.payments(member_id);
create index if not exists idx_audit_logs_tenant_id on public.audit_logs(tenant_id);

create trigger set_tenants_updated_at
before update on public.tenants
for each row execute function public.set_updated_at();

create trigger set_branches_updated_at
before update on public.branches
for each row execute function public.set_updated_at();

create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger set_user_roles_updated_at
before update on public.user_roles
for each row execute function public.set_updated_at();

create trigger set_members_updated_at
before update on public.members
for each row execute function public.set_updated_at();

create trigger set_membership_plans_updated_at
before update on public.membership_plans
for each row execute function public.set_updated_at();

create trigger set_member_memberships_updated_at
before update on public.member_memberships
for each row execute function public.set_updated_at();

create trigger set_passes_updated_at
before update on public.passes
for each row execute function public.set_updated_at();

create trigger set_member_passes_updated_at
before update on public.member_passes
for each row execute function public.set_updated_at();

create or replace function public.current_user_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select ur.tenant_id
  from public.user_roles ur
  join public.users u on u.id = ur.user_id
  where u.auth_user_id = auth.uid()
    and ur.status = 'active'
  order by ur.created_at asc
  limit 1
$$;

create or replace function public.has_role(_tenant_id uuid, _roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.users u on u.id = ur.user_id
    where u.auth_user_id = auth.uid()
      and ur.tenant_id = _tenant_id
      and ur.status = 'active'
      and ur.role = any(_roles)
  )
$$;

create or replace function public.has_branch_access(_tenant_id uuid, _branch_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.users u on u.id = ur.user_id
    where u.auth_user_id = auth.uid()
      and ur.tenant_id = _tenant_id
      and ur.status = 'active'
      and (
        ur.branch_scope_type = 'all'
        or exists (
          select 1
          from public.user_role_branches urb
          where urb.user_role_id = ur.id
            and urb.branch_id = _branch_id
        )
      )
  )
$$;
