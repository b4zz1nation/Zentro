create table if not exists public.invitation_branches (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (invitation_id, branch_id)
);

create index if not exists idx_invitation_branches_invitation_id
  on public.invitation_branches(invitation_id);

alter table public.invitation_branches enable row level security;

create policy "tenant_select_invitation_branches"
on public.invitation_branches
for select
to authenticated
using (
  exists (
    select 1
    from public.invitations i
    where i.id = invitation_branches.invitation_id
      and i.tenant_id = public.current_tenant_id()
  )
);

create policy "owner_manage_invitation_branches"
on public.invitation_branches
for all
to authenticated
using (
  exists (
    select 1
    from public.invitations i
    where i.id = invitation_branches.invitation_id
      and public.has_role(i.tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
  )
)
with check (
  exists (
    select 1
    from public.invitations i
    where i.id = invitation_branches.invitation_id
      and public.has_role(i.tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
  )
);
