create extension if not exists pgcrypto with schema extensions;

alter table if exists public.user_profiles
    add column if not exists subscription_tier text not null default 'free',
    add column if not exists billing_status text not null default 'inactive',
    add column if not exists stripe_customer_id text,
    add column if not exists stripe_subscription_id text,
    add column if not exists is_entitled boolean not null default false,
    add column if not exists entitlement_overrides jsonb not null default '{}'::jsonb,
    add column if not exists billing_metadata jsonb not null default '{}'::jsonb;

create table if not exists public.program_entitlements (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    program_id text not null,
    access_level text not null default 'full',
    source text not null default 'manual',
    status text not null default 'active',
    expires_at timestamptz,
    granted_by uuid,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists program_entitlements_user_id_idx
    on public.program_entitlements (user_id);

create index if not exists program_entitlements_program_id_idx
    on public.program_entitlements (program_id);

create index if not exists program_entitlements_status_idx
    on public.program_entitlements (status);

create index if not exists program_entitlements_user_program_status_idx
    on public.program_entitlements (user_id, program_id, status);

create table if not exists public.plans (
    id text primary key,
    tier text not null,
    name text not null,
    stripe_price_id text,
    status text not null default 'active',
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

insert into public.plans (id, tier, name, stripe_price_id, status, metadata)
values
    ('free', 'free', 'Free', null, 'active', '{"description":"Ecosystem dashboard, previews, and limited templates."}'::jsonb),
    ('starter', 'starter', 'Starter', null, 'active', '{"description":"AI Pioneer lite, basic templates, and limited agents."}'::jsonb),
    ('builder', 'builder', 'Builder', null, 'active', '{"description":"Full AI Pioneer, Hugging Face templates, portfolio resources, and Builder Labs."}'::jsonb),
    ('pro', 'pro', 'Pro', null, 'active', '{"description":"Vanguard, advanced templates, automation labs, and advanced Arsenal tools."}'::jsonb),
    ('educator', 'educator', 'Educator', null, 'active', '{"description":"Train-the-Trainer, facilitator resources, rubrics, and cohort materials."}'::jsonb),
    ('family', 'family', 'Family / Homeschool', null, 'active', '{"description":"Homeschool Kit, parent guide, records, and capstone materials."}'::jsonb),
    ('business', 'business', 'Business', null, 'active', '{"description":"Business automation materials, workflow agents, and team resources."}'::jsonb),
    ('org', 'org', 'Org / Cohort', null, 'active', '{"description":"Bulk enrollment, cohort reporting, and custom support."}'::jsonb)
on conflict (id) do update
set
    tier = excluded.tier,
    name = excluded.name,
    status = excluded.status,
    metadata = public.plans.metadata || excluded.metadata,
    updated_at = now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_program_entitlements_updated_at on public.program_entitlements;
create trigger set_program_entitlements_updated_at
    before update on public.program_entitlements
    for each row
    execute function public.set_updated_at();

drop trigger if exists set_plans_updated_at on public.plans;
create trigger set_plans_updated_at
    before update on public.plans
    for each row
    execute function public.set_updated_at();

alter table public.program_entitlements enable row level security;
alter table public.plans enable row level security;

drop policy if exists "users read own program entitlements" on public.program_entitlements;
create policy "users read own program entitlements"
    on public.program_entitlements
    for select
    to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "admins read program entitlements" on public.program_entitlements;
create policy "admins read program entitlements"
    on public.program_entitlements
    for select
    to authenticated
    using (public.is_zen_vanguard_admin());

drop policy if exists "authenticated users read active plans" on public.plans;
create policy "authenticated users read active plans"
    on public.plans
    for select
    to authenticated
    using (status = 'active');

drop policy if exists "admins read plans" on public.plans;
create policy "admins read plans"
    on public.plans
    for select
    to authenticated
    using (public.is_zen_vanguard_admin());
