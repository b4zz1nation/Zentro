alter table public.members
add column if not exists user_id uuid references public.users(id) on delete set null;

create unique index if not exists idx_members_user_id_unique
on public.members(user_id)
where user_id is not null;
