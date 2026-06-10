-- ZEN AI Co. — Program-scoped entitlements + profile persistence migration.
-- Apply via Codex / Supabase SQL editor. Idempotent.
--
-- Tables created:
--   public.program_entitlements   -- per-program access record (replaces global is_entitled)
--   public.program_profiles       -- ZEN Builder profile (replaces localStorage)
--
-- Helpers created:
--   public.is_zen_admin()                         -- admin allowlist check
--   public.has_program_access(uuid, text)         -- per-program access check
--   public.grant_program_access(...)              -- admin grant RPC
--   public.revoke_program_access(...)             -- admin revoke RPC
--
-- Admin allowlist matches src/services/adminAccess.ts (royaltokens@gmail.com).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Admin helper (allowlist-driven; replace with role table later if desired).
-- ---------------------------------------------------------------------------
create or replace function public.is_zen_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select coalesce(
        (
            select lower(u.email) = any (array['royaltokens@gmail.com'])
            from auth.users u
            where u.id = auth.uid()
        ),
        false
    );
$$;

grant execute on function public.is_zen_admin() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- program_entitlements
-- ---------------------------------------------------------------------------
create table if not exists public.program_entitlements (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    program_key text not null,
    status text not null default 'active',
    source text not null default 'stripe',
    stripe_customer_id text,
    stripe_checkout_session_id text,
    stripe_subscription_id text,
    stripe_payment_intent_id text,
    stripe_price_id text,
    amount_total integer,
    currency text,
    access_starts_at timestamptz default now(),
    access_ends_at timestamptz,
    note text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, program_key),
    constraint program_entitlements_program_key_check
        check (program_key in ('pioneer', 'vanguard')),
    constraint program_entitlements_status_check
        check (status in ('active', 'trialing', 'pending', 'past_due', 'canceled', 'revoked', 'expired'))
);

create index if not exists program_entitlements_user_idx
    on public.program_entitlements(user_id);
create index if not exists program_entitlements_program_idx
    on public.program_entitlements(program_key, status);

grant select on public.program_entitlements to authenticated;
grant all on public.program_entitlements to service_role;

alter table public.program_entitlements enable row level security;

drop policy if exists "entitlements_self_read" on public.program_entitlements;
create policy "entitlements_self_read"
    on public.program_entitlements for select
    to authenticated
    using (user_id = auth.uid() or public.is_zen_admin());

-- No insert/update/delete from clients. Mutations only via service_role
-- (Stripe webhook) or the admin RPCs below.
drop policy if exists "entitlements_admin_all" on public.program_entitlements;
create policy "entitlements_admin_all"
    on public.program_entitlements for all
    to authenticated
    using (public.is_zen_admin())
    with check (public.is_zen_admin());

-- ---------------------------------------------------------------------------
-- program_profiles (ZEN Builder profile)
-- ---------------------------------------------------------------------------
create table if not exists public.program_profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    username text,
    bio text,
    country text,
    organization text,
    track text,
    experience_level text,
    goal text,
    mission_badge text,
    program text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

grant select, insert, update on public.program_profiles to authenticated;
grant all on public.program_profiles to service_role;

alter table public.program_profiles enable row level security;

drop policy if exists "profiles_self_rw" on public.program_profiles;
create policy "profiles_self_rw"
    on public.program_profiles for all
    to authenticated
    using (user_id = auth.uid() or public.is_zen_admin())
    with check (user_id = auth.uid() or public.is_zen_admin());

-- ---------------------------------------------------------------------------
-- has_program_access(user_id, program_key) — canonical gate
-- ---------------------------------------------------------------------------
create or replace function public.has_program_access(_user_id uuid, _program_key text)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select
        -- Admin allowlist bypasses for every program.
        coalesce(
            (select lower(u.email) = any (array['royaltokens@gmail.com'])
             from auth.users u where u.id = _user_id),
            false
        )
        or exists (
            select 1
            from public.program_entitlements e
            where e.user_id = _user_id
              and e.program_key = _program_key
              and e.status in ('active', 'trialing')
              and (e.access_starts_at is null or e.access_starts_at <= now())
              and (e.access_ends_at is null or e.access_ends_at > now())
        );
$$;

grant execute on function public.has_program_access(uuid, text) to authenticated, anon, service_role;

-- ---------------------------------------------------------------------------
-- Admin grant / revoke RPCs (admin-only via is_zen_admin()).
-- ---------------------------------------------------------------------------
create or replace function public.grant_program_access(
    _user_id uuid,
    _program_key text,
    _source text default 'admin',
    _access_ends_at timestamptz default null,
    _note text default null
)
returns public.program_entitlements
language plpgsql
security definer
set search_path = public
as $$
declare
    result public.program_entitlements;
begin
    if not public.is_zen_admin() then
        raise exception 'not_authorized';
    end if;

    insert into public.program_entitlements as e
        (user_id, program_key, status, source, access_starts_at, access_ends_at, note)
    values
        (_user_id, _program_key, 'active', coalesce(_source, 'admin'), now(), _access_ends_at, _note)
    on conflict (user_id, program_key) do update set
        status = 'active',
        source = coalesce(excluded.source, e.source),
        access_starts_at = coalesce(e.access_starts_at, now()),
        access_ends_at = excluded.access_ends_at,
        note = coalesce(excluded.note, e.note),
        updated_at = now()
    returning * into result;

    return result;
end;
$$;

grant execute on function public.grant_program_access(uuid, text, text, timestamptz, text) to authenticated;

create or replace function public.revoke_program_access(
    _user_id uuid,
    _program_key text,
    _note text default null
)
returns public.program_entitlements
language plpgsql
security definer
set search_path = public
as $$
declare
    result public.program_entitlements;
begin
    if not public.is_zen_admin() then
        raise exception 'not_authorized';
    end if;

    update public.program_entitlements
       set status = 'revoked',
           note = coalesce(_note, note),
           updated_at = now()
     where user_id = _user_id
       and program_key = _program_key
    returning * into result;

    return result;
end;
$$;

grant execute on function public.revoke_program_access(uuid, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists program_entitlements_set_updated_at on public.program_entitlements;
create trigger program_entitlements_set_updated_at
    before update on public.program_entitlements
    for each row execute function public.set_updated_at();

drop trigger if exists program_profiles_set_updated_at on public.program_profiles;
create trigger program_profiles_set_updated_at
    before update on public.program_profiles
    for each row execute function public.set_updated_at();
