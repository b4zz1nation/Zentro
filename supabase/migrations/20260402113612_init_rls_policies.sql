alter table public.tenants enable row level security;
alter table public.branches enable row level security;
alter table public.users enable row level security;
alter table public.user_roles enable row level security;
alter table public.user_role_branches enable row level security;
alter table public.members enable row level security;
alter table public.membership_plans enable row level security;
alter table public.plan_branch_access enable row level security;
alter table public.member_memberships enable row level security;
alter table public.membership_events enable row level security;
alter table public.passes enable row level security;
alter table public.pass_branch_access enable row level security;
alter table public.member_passes enable row level security;
alter table public.checkins enable row level security;
alter table public.payments enable row level security;
alter table public.invitations enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "tenant_read_tenants"
on public.tenants
for select
to authenticated
using (
  id = public.current_tenant_id()
  or public.has_role(id, array['super_admin']::public.app_role[])
);

create policy "owner_update_tenants"
on public.tenants
for update
to authenticated
using (
  public.has_role(id, array['super_admin', 'gym_owner']::public.app_role[])
)
with check (
  public.has_role(id, array['super_admin', 'gym_owner']::public.app_role[])
);

create policy "tenant_select_branches"
on public.branches
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_manage_branches"
on public.branches
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
);

create policy "tenant_select_users"
on public.users
for select
to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    join public.users me on me.id = ur.user_id
    where me.auth_user_id = auth.uid()
      and ur.tenant_id in (
        select tenant_id
        from public.user_roles ur2
        where ur2.user_id = users.id
      )
  )
);

create policy "self_insert_users"
on public.users
for insert
to authenticated
with check (auth.uid() = auth_user_id);

create policy "self_update_users"
on public.users
for update
to authenticated
using (
  auth.uid() = auth_user_id
  or exists (
    select 1
    from public.user_roles ur
    join public.users me on me.id = ur.user_id
    where me.auth_user_id = auth.uid()
      and ur.tenant_id in (
        select tenant_id
        from public.user_roles ur2
        where ur2.user_id = users.id
      )
      and ur.role in ('super_admin', 'gym_owner')
  )
)
with check (
  auth.uid() = auth_user_id
  or exists (
    select 1
    from public.user_roles ur
    join public.users me on me.id = ur.user_id
    where me.auth_user_id = auth.uid()
      and ur.tenant_id in (
        select tenant_id
        from public.user_roles ur2
        where ur2.user_id = users.id
      )
      and ur.role in ('super_admin', 'gym_owner')
  )
);

create policy "tenant_select_user_roles"
on public.user_roles
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_manage_user_roles"
on public.user_roles
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
);

create policy "tenant_select_user_role_branches"
on public.user_role_branches
for select
to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.id = user_role_branches.user_role_id
      and ur.tenant_id = public.current_tenant_id()
  )
);

create policy "owner_manage_user_role_branches"
on public.user_role_branches
for all
to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.id = user_role_branches.user_role_id
      and public.has_role(ur.tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
  )
)
with check (
  exists (
    select 1
    from public.user_roles ur
    where ur.id = user_role_branches.user_role_id
      and public.has_role(ur.tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
  )
);

create policy "tenant_select_members"
on public.members
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_staff_manage_members"
on public.members
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
);

create policy "tenant_select_membership_plans"
on public.membership_plans
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_manage_membership_plans"
on public.membership_plans
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
);

create policy "tenant_select_plan_branch_access"
on public.plan_branch_access
for select
to authenticated
using (
  exists (
    select 1
    from public.membership_plans mp
    where mp.id = plan_branch_access.membership_plan_id
      and mp.tenant_id = public.current_tenant_id()
  )
);

create policy "owner_manage_plan_branch_access"
on public.plan_branch_access
for all
to authenticated
using (
  exists (
    select 1
    from public.membership_plans mp
    where mp.id = plan_branch_access.membership_plan_id
      and public.has_role(mp.tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
  )
)
with check (
  exists (
    select 1
    from public.membership_plans mp
    where mp.id = plan_branch_access.membership_plan_id
      and public.has_role(mp.tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
  )
);

create policy "tenant_select_member_memberships"
on public.member_memberships
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_staff_manage_member_memberships"
on public.member_memberships
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
);

create policy "tenant_select_membership_events"
on public.membership_events
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_staff_manage_membership_events"
on public.membership_events
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
);

create policy "tenant_select_passes"
on public.passes
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_manage_passes"
on public.passes
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
);

create policy "tenant_select_pass_branch_access"
on public.pass_branch_access
for select
to authenticated
using (
  exists (
    select 1
    from public.passes p
    where p.id = pass_branch_access.pass_id
      and p.tenant_id = public.current_tenant_id()
  )
);

create policy "owner_manage_pass_branch_access"
on public.pass_branch_access
for all
to authenticated
using (
  exists (
    select 1
    from public.passes p
    where p.id = pass_branch_access.pass_id
      and public.has_role(p.tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
  )
)
with check (
  exists (
    select 1
    from public.passes p
    where p.id = pass_branch_access.pass_id
      and public.has_role(p.tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
  )
);

create policy "tenant_select_member_passes"
on public.member_passes
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_staff_manage_member_passes"
on public.member_passes
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
);

create policy "tenant_select_checkins"
on public.checkins
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_staff_manage_checkins"
on public.checkins
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
  and public.has_branch_access(tenant_id, branch_id)
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
  and public.has_branch_access(tenant_id, branch_id)
);

create policy "tenant_select_payments"
on public.payments
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_staff_manage_payments"
on public.payments
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
);

create policy "tenant_select_invitations"
on public.invitations
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_manage_invitations"
on public.invitations
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
);

create policy "tenant_select_notifications"
on public.notifications
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_staff_manage_notifications"
on public.notifications
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner', 'staff']::public.app_role[])
);

create policy "tenant_select_audit_logs"
on public.audit_logs
for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "owner_manage_audit_logs"
on public.audit_logs
for all
to authenticated
using (
  public.has_role(tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
)
with check (
  public.has_role(tenant_id, array['super_admin', 'gym_owner']::public.app_role[])
);
