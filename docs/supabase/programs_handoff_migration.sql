-- ZEN Program Ecosystem handoff migration for Arsenal Supabase.
-- Additive only. Review inside Arsenal before applying.
--
-- Canonical identity:
--   public program tables reference auth.users(id), and runtime code should pass auth.uid().
--
-- Admin helper:
--   This file uses public.is_zen_vanguard_admin() because this standalone repo already has it.
--   During Arsenal merge, replace it with Arsenal's canonical admin helper, such as:
--     public.has_role('platform_admin')
--     public.is_platform_admin()
--     a platform_admins membership check
--   Do not create a second admin role system for these policies.

create extension if not exists pgcrypto;

create table if not exists public.program_catalog (
    id uuid primary key default gen_random_uuid(),
    program_key text unique not null,
    slug text unique not null,
    title text not null,
    short_description text,
    audience text,
    status text not null default 'waitlist',
    visibility text not null default 'public',
    access_mode text not null default 'registration_required',
    preview_enabled boolean default true,
    registration_enabled boolean default true,
    launch_route text,
    embedded_route text,
    sort_order integer default 0,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    constraint program_catalog_status_check
        check (status in ('draft', 'waitlist', 'preview', 'open', 'live', 'archived')),
    constraint program_catalog_visibility_check
        check (visibility in ('public', 'authenticated', 'private', 'admin')),
    constraint program_catalog_access_mode_check
        check (access_mode in ('public_preview', 'registration_required', 'enrollment_required', 'admin_only'))
);

create table if not exists public.program_registrations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    program_id uuid references public.program_catalog(id) on delete cascade,
    program_key text not null,
    status text not null default 'waitlisted',
    email text,
    display_name text,
    phone text,
    organization text,
    role text,
    audience_type text,
    reason text,
    source text,
    referral_code text,
    utm jsonb default '{}'::jsonb,
    metadata jsonb default '{}'::jsonb,
    registered_at timestamptz default now(),
    invited_at timestamptz,
    enrolled_at timestamptz,
    cancelled_at timestamptz,
    updated_at timestamptz default now(),
    unique(user_id, program_key),
    constraint program_registrations_status_check
        check (status in ('waitlisted', 'invited', 'enrolled', 'cancelled'))
);

create table if not exists public.program_access_grants (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    program_id uuid references public.program_catalog(id) on delete cascade,
    program_key text not null,
    access_level text not null default 'preview',
    granted_by uuid references auth.users(id),
    reason text,
    expires_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id, program_key),
    constraint program_access_grants_level_check
        check (access_level in ('preview', 'waitlist', 'enrolled', 'facilitator', 'admin'))
);

create table if not exists public.program_user_progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    program_id uuid references public.program_catalog(id) on delete cascade,
    program_key text not null,
    module_key text,
    lesson_key text,
    progress_percent numeric default 0,
    status text default 'not_started',
    last_activity_at timestamptz,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id, program_key, module_key, lesson_key),
    constraint program_user_progress_percent_check
        check (progress_percent >= 0 and progress_percent <= 100),
    constraint program_user_progress_status_check
        check (status in ('not_started', 'started', 'completed'))
);

create index if not exists program_catalog_status_idx on public.program_catalog(status);
create index if not exists program_registrations_user_idx on public.program_registrations(user_id);
create index if not exists program_registrations_program_key_idx on public.program_registrations(program_key);
create index if not exists program_registrations_source_idx on public.program_registrations(source);
create index if not exists program_access_grants_user_idx on public.program_access_grants(user_id);
create index if not exists program_user_progress_user_program_idx on public.program_user_progress(user_id, program_key);

alter table public.program_catalog enable row level security;
alter table public.program_registrations enable row level security;
alter table public.program_access_grants enable row level security;
alter table public.program_user_progress enable row level security;

drop policy if exists "public read visible program catalog" on public.program_catalog;
create policy "public read visible program catalog"
    on public.program_catalog
    for select
    to anon, authenticated
    using (visibility = 'public' and status <> 'draft');

drop policy if exists "authenticated read non-private program catalog" on public.program_catalog;
create policy "authenticated read non-private program catalog"
    on public.program_catalog
    for select
    to authenticated
    using (visibility in ('public', 'authenticated') and status <> 'draft');

drop policy if exists "admins manage program catalog" on public.program_catalog;
create policy "admins manage program catalog"
    on public.program_catalog
    for all
    to authenticated
    using (public.is_zen_vanguard_admin())
    with check (public.is_zen_vanguard_admin());

drop policy if exists "users read own program registrations" on public.program_registrations;
create policy "users read own program registrations"
    on public.program_registrations
    for select
    to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "users insert own program registrations" on public.program_registrations;
create policy "users insert own program registrations"
    on public.program_registrations
    for insert
    to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists "users update own cancellable registrations" on public.program_registrations;
create policy "users update own cancellable registrations"
    on public.program_registrations
    for update
    to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id and status in ('waitlisted', 'cancelled'));

drop policy if exists "admins manage program registrations" on public.program_registrations;
create policy "admins manage program registrations"
    on public.program_registrations
    for all
    to authenticated
    using (public.is_zen_vanguard_admin())
    with check (public.is_zen_vanguard_admin());

drop policy if exists "users read own program access grants" on public.program_access_grants;
create policy "users read own program access grants"
    on public.program_access_grants
    for select
    to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "admins manage program access grants" on public.program_access_grants;
create policy "admins manage program access grants"
    on public.program_access_grants
    for all
    to authenticated
    using (public.is_zen_vanguard_admin())
    with check (public.is_zen_vanguard_admin());

drop policy if exists "users read own program progress" on public.program_user_progress;
create policy "users read own program progress"
    on public.program_user_progress
    for select
    to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "users insert own program progress" on public.program_user_progress;
create policy "users insert own program progress"
    on public.program_user_progress
    for insert
    to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists "users update own program progress" on public.program_user_progress;
create policy "users update own program progress"
    on public.program_user_progress
    for update
    to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

drop policy if exists "admins manage program progress" on public.program_user_progress;
create policy "admins manage program progress"
    on public.program_user_progress
    for all
    to authenticated
    using (public.is_zen_vanguard_admin())
    with check (public.is_zen_vanguard_admin());

insert into public.program_catalog (
    program_key,
    slug,
    title,
    short_description,
    audience,
    status,
    visibility,
    access_mode,
    preview_enabled,
    registration_enabled,
    launch_route,
    embedded_route,
    sort_order,
    metadata
)
values
    ('ai-pioneer', 'pioneer', 'AI Pioneer Program', 'Build-first AI literacy for youth builders.', 'Youth ages 11-18', 'preview', 'public', 'enrollment_required', true, true, '/programs/pioneer/launch', '/programs/pioneer', 10, '{"source":"program_integration_contract"}'::jsonb),
    ('vanguard', 'vanguard', 'ZEN Vanguard', 'Professional operator track for AI systems literacy.', 'Adults, workforce learners, founders, operators', 'preview', 'public', 'enrollment_required', true, true, '/dashboard', '/module/1', 20, '{"source":"program_integration_contract"}'::jsonb),
    ('homeschool-kit', 'homeschool', 'Homeschool Kit', 'Structured AI curriculum for families and micro-schools.', 'Families, micro-schools, and students ages 11-18', 'waitlist', 'public', 'enrollment_required', false, true, '/programs/homeschool/launch', '/programs/homeschool', 30, '{"source":"program_integration_contract"}'::jsonb),
    ('web3-literacy', 'web3', 'Web3 Literacy', 'Wallet safety, credential literacy, and trust systems.', 'Teens, adults, and educators', 'waitlist', 'public', 'enrollment_required', false, true, '/programs/web3/launch', '/programs/web3', 40, '{"source":"program_integration_contract","simulation_first":true}'::jsonb),
    ('train-a-trainer', 't3', 'Train-a-Trainer', 'Facilitator readiness for delivering ZEN programs.', 'Educators, mentors, facilitators, and program leaders', 'waitlist', 'public', 'enrollment_required', false, true, '/programs/t3/launch', '/programs/t3', 50, '{"source":"program_integration_contract"}'::jsonb)
on conflict (program_key) do update set
    slug = excluded.slug,
    title = excluded.title,
    short_description = excluded.short_description,
    audience = excluded.audience,
    updated_at = now();
