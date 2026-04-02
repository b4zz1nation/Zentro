create extension if not exists "pgcrypto";
create extension if not exists "citext";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum (
      'super_admin',
      'gym_owner',
      'staff',
      'member'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'record_status') then
    create type public.record_status as enum (
      'active',
      'inactive',
      'archived'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'branch_scope_type') then
    create type public.branch_scope_type as enum (
      'all',
      'selected'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'membership_state') then
    create type public.membership_state as enum (
      'active',
      'expired',
      'inactive',
      'suspended',
      'frozen',
      'pending_payment',
      'trial'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_state') then
    create type public.payment_state as enum (
      'paid',
      'pending',
      'failed',
      'refunded',
      'void'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_type') then
    create type public.payment_type as enum (
      'membership_sale',
      'pass_sale',
      'renewal',
      'adjustment'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_method_type') then
    create type public.payment_method_type as enum (
      'cash',
      'card',
      'bank_transfer',
      'mobile_wallet',
      'other'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'checkin_method_type') then
    create type public.checkin_method_type as enum (
      'qr',
      'manual'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'checkin_result_type') then
    create type public.checkin_result_type as enum (
      'success',
      'failed'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'invitation_status') then
    create type public.invitation_status as enum (
      'pending',
      'accepted',
      'expired',
      'revoked'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'notification_status') then
    create type public.notification_status as enum (
      'pending',
      'sent',
      'failed',
      'read'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'access_scope_type') then
    create type public.access_scope_type as enum (
      'all_branches',
      'selected_branches'
    );
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;
