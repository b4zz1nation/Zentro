drop policy if exists "tenant_select_users" on public.users;
drop policy if exists "self_update_users" on public.users;

create policy "self_or_tenant_select_users"
on public.users
for select
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
  )
);

create policy "self_or_owner_update_users"
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
