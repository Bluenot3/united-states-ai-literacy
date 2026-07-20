-- Vanguard Supabase production rewire.
--
-- This migration restores the database contract expected by the current
-- Arsenal / ZEN runtime without deleting or renaming any existing learner,
-- billing, authentication, progress, or session data.
--
-- Canonical program-key boundary:
--   * paid program_entitlements: pioneer | vanguard
--   * ecosystem registration/progress: ai-pioneer | vanguard | staged programs
--
-- Apply to the Vanguard Supabase project only after reviewing the project ref.

begin;

create extension if not exists pgcrypto with schema extensions;

-- Fail closed if this is not the existing Vanguard database. These four
-- relations are the legacy runtime foundation and are intentionally preserved.
do $migration_preflight$
begin
  if to_regclass('public.users') is null
    or to_regclass('public.user_profiles') is null
    or to_regclass('public.module_progress') is null
    or to_regclass('public.session_history') is null then
    raise exception
      'Vanguard preflight failed: users, user_profiles, module_progress, and session_history must already exist.';
  end if;
end
$migration_preflight$;

-- ============================================================================
-- Canonical admin allowlist and helper functions
-- ============================================================================

create table if not exists public.admin_allowlist (
  email text primary key,
  created_at timestamptz not null default now()
);

create unique index if not exists admin_allowlist_email_lower_uidx
  on public.admin_allowlist (lower(email));

insert into public.admin_allowlist (email)
values
  ('royaltokens@gmail.com'),
  ('admin@zenvanguard.com'),
  ('alexleschik@bgcgw.org'),
  ('testadmin@zenai.co'),
  ('alex1leschik@gmail.com'),
  ('huxley@zenai.biz')
on conflict (email) do nothing;

alter table public.admin_allowlist enable row level security;

drop policy if exists "authenticated can read allowlist"
  on public.admin_allowlist;

revoke all on public.admin_allowlist from public, anon, authenticated;
grant all on public.admin_allowlist to service_role;

create or replace function public.is_zen_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.admin_allowlist allowlist
      join auth.users account
        on lower(account.email) = lower(allowlist.email)
      where account.id = (select auth.uid())
    );
$function$;

revoke all on function public.is_zen_admin()
  from public, anon, authenticated, service_role;
grant execute on function public.is_zen_admin()
  to authenticated;

-- Compatibility wrappers keep existing policy and Curriculum Studio call sites
-- on one canonical source of truth instead of creating parallel admin systems.
create or replace function public.is_content_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $function$
  select public.is_zen_admin();
$function$;

revoke all on function public.is_content_admin()
  from public, anon, authenticated, service_role;
grant execute on function public.is_content_admin()
  to authenticated;

create or replace function public.is_zen_vanguard_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $function$
  select public.is_zen_admin();
$function$;

revoke all on function public.is_zen_vanguard_admin()
  from public, anon, authenticated, service_role;
grant execute on function public.is_zen_vanguard_admin()
  to authenticated;

-- ============================================================================
-- Harden the legacy Auth bootstrap and backfill missing account profiles
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  resolved_name text;
  resolved_picture text;
begin
  resolved_name := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'Vanguard Pioneer'
  );

  resolved_picture := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'picture'), ''),
    'https://api.dicebear.com/7.x/initials/svg?seed='
      || coalesce(new.email, new.id::text)
  );

  insert into public.users (
    id,
    email,
    name,
    picture,
    metadata,
    created_at
  )
  values (
    new.id,
    new.email,
    resolved_name,
    resolved_picture,
    jsonb_build_object(
      'totalPoints', 0,
      'createdAt', new.created_at,
      'modules', jsonb_build_object(
        '1', jsonb_build_object(
          'completedSections', '[]'::jsonb,
          'completedInteractives', '[]'::jsonb,
          'points', 0,
          'startedAt', null,
          'completedAt', null,
          'lastViewedSection', 'overview'
        ),
        '2', jsonb_build_object(
          'completedSections', '[]'::jsonb,
          'completedInteractives', '[]'::jsonb,
          'points', 0,
          'startedAt', null,
          'completedAt', null,
          'lastViewedSection', 'overview'
        ),
        '3', jsonb_build_object(
          'completedSections', '[]'::jsonb,
          'completedInteractives', '[]'::jsonb,
          'points', 0,
          'startedAt', null,
          'completedAt', null,
          'lastViewedSection', 'overview'
        ),
        '4', jsonb_build_object(
          'completedSections', '[]'::jsonb,
          'completedInteractives', '[]'::jsonb,
          'points', 0,
          'startedAt', null,
          'completedAt', null,
          'lastViewedSection', 'overview'
        )
      ),
      'sessionHistory', '[]'::jsonb
    ),
    coalesce(new.created_at, now())
  )
  on conflict (id) do nothing;

  -- Vanguard currently supports email/password registration. Avoid breaking
  -- any future phone-only Auth account whose email is null.
  if new.email is not null then
    insert into public.user_profiles (
      id,
      email,
      name,
      picture,
      created_at,
      updated_at
    )
    values (
      new.id,
      new.email,
      resolved_name,
      resolved_picture,
      coalesce(new.created_at, now()),
      now()
    )
    on conflict (id) do nothing;
  end if;

  return new;
end
$function$;

revoke all on function public.handle_new_user()
  from public, anon, authenticated, service_role;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Existing Auth users remain canonical. Fill only absent profiles and preserve
-- every profile row that already exists.
insert into public.user_profiles (
  id,
  email,
  name,
  picture,
  created_at,
  updated_at
)
select
  account.id,
  account.email,
  coalesce(
    nullif(btrim(legacy.name), ''),
    nullif(btrim(account.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(account.email, '@', 1), ''),
    'Vanguard Pioneer'
  ),
  coalesce(
    nullif(btrim(legacy.picture), ''),
    nullif(btrim(account.raw_user_meta_data ->> 'picture'), ''),
    'https://api.dicebear.com/7.x/initials/svg?seed=' || account.email
  ),
  coalesce(legacy.created_at, account.created_at, now()),
  now()
from auth.users account
left join public.users legacy
  on legacy.id = account.id
where account.email is not null
on conflict (id) do nothing;

-- ============================================================================
-- Eight missing runtime tables
-- ============================================================================

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
    check (
      status in (
        'active',
        'trialing',
        'pending',
        'past_due',
        'canceled',
        'revoked',
        'expired'
      )
    )
);

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

create table if not exists public.content_overrides (
  id uuid primary key default gen_random_uuid(),
  program_id text not null,
  module_id text not null,
  section_id text,
  position text not null,
  block_type text not null,
  payload jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_overrides_position_check
    check (
      position in (
        'before',
        'after',
        'replace',
        'hide',
        'append_module'
      )
    ),
  constraint content_overrides_block_type_check
    check (
      block_type in (
        'rich_text',
        'embed_url',
        'video',
        'image',
        'html',
        'link_card',
        'divider'
      )
    ),
  constraint content_overrides_sort_order_check
    check (sort_order >= 0)
);

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
  preview_enabled boolean not null default true,
  registration_enabled boolean not null default true,
  launch_route text,
  embedded_route text,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint program_catalog_status_check
    check (
      status in (
        'draft',
        'waitlist',
        'preview',
        'open',
        'live',
        'archived'
      )
    ),
  constraint program_catalog_visibility_check
    check (visibility in ('public', 'authenticated', 'private', 'admin')),
  constraint program_catalog_access_mode_check
    check (
      access_mode in (
        'public_preview',
        'registration_required',
        'enrollment_required',
        'admin_only'
      )
    )
);

create table if not exists public.program_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid references public.program_catalog(id) on delete set null,
  program_key text not null
    references public.program_catalog(program_key) on update cascade on delete restrict,
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
  utm jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  registered_at timestamptz not null default now(),
  invited_at timestamptz,
  enrolled_at timestamptz,
  cancelled_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, program_key),
  constraint program_registrations_status_check
    check (status in ('waitlisted', 'invited', 'enrolled', 'cancelled'))
);

create table if not exists public.program_access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid references public.program_catalog(id) on delete set null,
  program_key text not null
    references public.program_catalog(program_key) on update cascade on delete restrict,
  access_level text not null default 'preview',
  granted_by uuid references auth.users(id) on delete set null,
  reason text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, program_key),
  constraint program_access_grants_level_check
    check (
      access_level in (
        'preview',
        'waitlist',
        'enrolled',
        'facilitator',
        'admin'
      )
    )
);

create table if not exists public.program_user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid references public.program_catalog(id) on delete set null,
  program_key text not null
    references public.program_catalog(program_key) on update cascade on delete restrict,
  module_key text,
  lesson_key text,
  progress_percent numeric not null default 0,
  status text not null default 'not_started',
  last_activity_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint program_user_progress_percent_check
    check (progress_percent >= 0 and progress_percent <= 100),
  constraint program_user_progress_status_check
    check (status in ('not_started', 'started', 'completed'))
);

-- The eighth table is admin_allowlist, created before the helper functions.

-- ============================================================================
-- Indexes
-- ============================================================================

create index if not exists program_entitlements_user_idx
  on public.program_entitlements (user_id);
create index if not exists program_entitlements_program_status_idx
  on public.program_entitlements (program_key, status);
create index if not exists program_entitlements_stripe_subscription_idx
  on public.program_entitlements (stripe_subscription_id)
  where stripe_subscription_id is not null;

create index if not exists content_overrides_lookup_idx
  on public.content_overrides (
    program_id,
    module_id,
    is_published,
    sort_order
  );

create index if not exists program_catalog_status_idx
  on public.program_catalog (status);
create index if not exists program_catalog_visibility_status_idx
  on public.program_catalog (visibility, status, sort_order);

create index if not exists program_registrations_program_id_idx
  on public.program_registrations (program_id);
create index if not exists program_registrations_program_key_idx
  on public.program_registrations (program_key);
create index if not exists program_registrations_source_idx
  on public.program_registrations (source);

create index if not exists program_access_grants_program_id_idx
  on public.program_access_grants (program_id);
create index if not exists program_access_grants_program_key_idx
  on public.program_access_grants (program_key, access_level);
create index if not exists program_access_grants_granted_by_idx
  on public.program_access_grants (granted_by);

-- PostgreSQL UNIQUE constraints normally treat nulls as distinct. The runtime
-- upserts nullable module/lesson anchors, so NULLS NOT DISTINCT is required to
-- make that operation deterministic.
create unique index if not exists program_user_progress_identity_uidx
  on public.program_user_progress (
    user_id,
    program_key,
    module_key,
    lesson_key
  )
  nulls not distinct;

create index if not exists program_user_progress_program_id_idx
  on public.program_user_progress (program_id);
create index if not exists program_user_progress_user_program_idx
  on public.program_user_progress (user_id, program_key);
create index if not exists program_user_progress_section_idx
  on public.program_user_progress (program_key, module_key, lesson_key);

-- ============================================================================
-- Shared updated_at trigger
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  new.updated_at := now();
  return new;
end
$function$;

revoke all on function public.set_updated_at()
  from public, anon, authenticated, service_role;

drop trigger if exists user_profiles_set_updated_at
  on public.user_profiles;
create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists module_progress_set_updated_at
  on public.module_progress;
create trigger module_progress_set_updated_at
  before update on public.module_progress
  for each row execute function public.set_updated_at();

drop trigger if exists set_program_entitlements_updated_at
  on public.program_entitlements;
drop trigger if exists program_entitlements_set_updated_at
  on public.program_entitlements;
create trigger program_entitlements_set_updated_at
  before update on public.program_entitlements
  for each row execute function public.set_updated_at();

drop trigger if exists program_profiles_set_updated_at
  on public.program_profiles;
create trigger program_profiles_set_updated_at
  before update on public.program_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists content_overrides_touch
  on public.content_overrides;
drop trigger if exists content_overrides_set_updated_at
  on public.content_overrides;
create trigger content_overrides_set_updated_at
  before update on public.content_overrides
  for each row execute function public.set_updated_at();

drop trigger if exists program_catalog_set_updated_at
  on public.program_catalog;
create trigger program_catalog_set_updated_at
  before update on public.program_catalog
  for each row execute function public.set_updated_at();

drop trigger if exists program_registrations_set_updated_at
  on public.program_registrations;
create trigger program_registrations_set_updated_at
  before update on public.program_registrations
  for each row execute function public.set_updated_at();

drop trigger if exists program_access_grants_set_updated_at
  on public.program_access_grants;
create trigger program_access_grants_set_updated_at
  before update on public.program_access_grants
  for each row execute function public.set_updated_at();

drop trigger if exists program_user_progress_set_updated_at
  on public.program_user_progress;
create trigger program_user_progress_set_updated_at
  before update on public.program_user_progress
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Harden legacy table grants and RLS
-- ============================================================================

alter table public.users enable row level security;
alter table public.user_profiles enable row level security;
alter table public.module_progress enable row level security;
alter table public.session_history enable row level security;

revoke all on public.users
  from public, anon, authenticated;
grant select, insert, update on public.users
  to authenticated;
grant all on public.users
  to service_role;

revoke all on public.user_profiles
  from public, anon, authenticated;
grant select, insert, update on public.user_profiles
  to authenticated;
grant all on public.user_profiles
  to service_role;

revoke all on public.module_progress
  from public, anon, authenticated;
grant select, insert, update on public.module_progress
  to authenticated;
grant all on public.module_progress
  to service_role;

revoke all on public.session_history
  from public, anon, authenticated;
grant select, insert, update on public.session_history
  to authenticated;
grant all on public.session_history
  to service_role;

drop policy if exists "Users can insert their own data"
  on public.users;
drop policy if exists "Users can update their own data"
  on public.users;
drop policy if exists "Users can view their own data"
  on public.users;
drop policy if exists "vanguard users read own account"
  on public.users;
drop policy if exists "vanguard users insert own account"
  on public.users;
drop policy if exists "vanguard users update own account"
  on public.users;

create policy "vanguard users read own account"
  on public.users
  for select
  to authenticated
  using (
    (select auth.uid()) = id
    or (select public.is_zen_admin())
  );

create policy "vanguard users insert own account"
  on public.users
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "vanguard users update own account"
  on public.users
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can view their own profile"
  on public.user_profiles;
drop policy if exists "Users can insert their own profile"
  on public.user_profiles;
drop policy if exists "Users can update their own profile"
  on public.user_profiles;
drop policy if exists "users_select_own_profile"
  on public.user_profiles;
drop policy if exists "users_insert_own_profile"
  on public.user_profiles;
drop policy if exists "users_update_own_profile"
  on public.user_profiles;
drop policy if exists "users read own profile"
  on public.user_profiles;
drop policy if exists "users create own profile"
  on public.user_profiles;
drop policy if exists "users update own profile"
  on public.user_profiles;
drop policy if exists "admins read profiles"
  on public.user_profiles;
drop policy if exists "vanguard users read own profile"
  on public.user_profiles;
drop policy if exists "vanguard users insert own profile"
  on public.user_profiles;
drop policy if exists "vanguard users update own profile"
  on public.user_profiles;

create policy "vanguard users read own profile"
  on public.user_profiles
  for select
  to authenticated
  using (
    (select auth.uid()) = id
    or (select public.is_zen_admin())
  );

create policy "vanguard users insert own profile"
  on public.user_profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "vanguard users update own profile"
  on public.user_profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can manage their module progress"
  on public.module_progress;
drop policy if exists "users_select_own_progress"
  on public.module_progress;
drop policy if exists "users_insert_own_progress"
  on public.module_progress;
drop policy if exists "users_update_own_progress"
  on public.module_progress;
drop policy if exists "users read own module progress"
  on public.module_progress;
drop policy if exists "users write own module progress"
  on public.module_progress;
drop policy if exists "users update own module progress"
  on public.module_progress;
drop policy if exists "admins read module progress"
  on public.module_progress;
drop policy if exists "vanguard users read own module progress"
  on public.module_progress;
drop policy if exists "vanguard users insert own module progress"
  on public.module_progress;
drop policy if exists "vanguard users update own module progress"
  on public.module_progress;

create policy "vanguard users read own module progress"
  on public.module_progress
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  );

create policy "vanguard users insert own module progress"
  on public.module_progress
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "vanguard users update own module progress"
  on public.module_progress
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage their session history"
  on public.session_history;
drop policy if exists "users_select_own_sessions"
  on public.session_history;
drop policy if exists "users_insert_own_sessions"
  on public.session_history;
drop policy if exists "users read own sessions"
  on public.session_history;
drop policy if exists "users insert own sessions"
  on public.session_history;
drop policy if exists "users update own sessions"
  on public.session_history;
drop policy if exists "admins read sessions"
  on public.session_history;
drop policy if exists "vanguard users read own sessions"
  on public.session_history;
drop policy if exists "vanguard users insert own sessions"
  on public.session_history;
drop policy if exists "vanguard users update own sessions"
  on public.session_history;

create policy "vanguard users read own sessions"
  on public.session_history
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  );

create policy "vanguard users insert own sessions"
  on public.session_history
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "vanguard users update own sessions"
  on public.session_history
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ============================================================================
-- New runtime table grants and RLS
-- ============================================================================

alter table public.program_entitlements enable row level security;
alter table public.program_profiles enable row level security;
alter table public.content_overrides enable row level security;
alter table public.program_catalog enable row level security;
alter table public.program_registrations enable row level security;
alter table public.program_access_grants enable row level security;
alter table public.program_user_progress enable row level security;

revoke all on public.program_entitlements
  from public, anon, authenticated;
grant select on public.program_entitlements
  to authenticated;
grant all on public.program_entitlements
  to service_role;

revoke all on public.program_profiles
  from public, anon, authenticated;
grant select, insert, update on public.program_profiles
  to authenticated;
grant all on public.program_profiles
  to service_role;

revoke all on public.content_overrides
  from public, anon, authenticated;
grant select, insert, update, delete on public.content_overrides
  to authenticated;
grant all on public.content_overrides
  to service_role;

revoke all on public.program_catalog
  from public, anon, authenticated;
grant select on public.program_catalog
  to anon;
grant select, insert, update, delete on public.program_catalog
  to authenticated;
grant all on public.program_catalog
  to service_role;

revoke all on public.program_registrations
  from public, anon, authenticated;
grant select, insert, update on public.program_registrations
  to authenticated;
grant all on public.program_registrations
  to service_role;

revoke all on public.program_access_grants
  from public, anon, authenticated;
grant select, insert, update, delete on public.program_access_grants
  to authenticated;
grant all on public.program_access_grants
  to service_role;

revoke all on public.program_user_progress
  from public, anon, authenticated;
grant select, insert, update on public.program_user_progress
  to authenticated;
grant all on public.program_user_progress
  to service_role;

drop policy if exists "entitlements_self_read"
  on public.program_entitlements;
drop policy if exists "entitlements_admin_all"
  on public.program_entitlements;
drop policy if exists "entitlements self or admin read"
  on public.program_entitlements;

create policy "entitlements self or admin read"
  on public.program_entitlements
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  );

drop policy if exists "profiles_self_rw"
  on public.program_profiles;
drop policy if exists "program profiles self or admin read"
  on public.program_profiles;
drop policy if exists "program profiles self or admin insert"
  on public.program_profiles;
drop policy if exists "program profiles self or admin update"
  on public.program_profiles;

create policy "program profiles self or admin read"
  on public.program_profiles
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  );

create policy "program profiles self or admin insert"
  on public.program_profiles
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  );

create policy "program profiles self or admin update"
  on public.program_profiles
  for update
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  )
  with check (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  );

drop policy if exists "students read published"
  on public.content_overrides;
drop policy if exists "admins read all overrides"
  on public.content_overrides;
drop policy if exists "admins insert overrides"
  on public.content_overrides;
drop policy if exists "admins update overrides"
  on public.content_overrides;
drop policy if exists "admins delete overrides"
  on public.content_overrides;
drop policy if exists "students read published content overrides"
  on public.content_overrides;
drop policy if exists "admins insert content overrides"
  on public.content_overrides;
drop policy if exists "admins update content overrides"
  on public.content_overrides;
drop policy if exists "admins delete content overrides"
  on public.content_overrides;

create policy "students read published content overrides"
  on public.content_overrides
  for select
  to authenticated
  using (
    is_published
    or (select public.is_zen_admin())
  );

create policy "admins insert content overrides"
  on public.content_overrides
  for insert
  to authenticated
  with check ((select public.is_zen_admin()));

create policy "admins update content overrides"
  on public.content_overrides
  for update
  to authenticated
  using ((select public.is_zen_admin()))
  with check ((select public.is_zen_admin()));

create policy "admins delete content overrides"
  on public.content_overrides
  for delete
  to authenticated
  using ((select public.is_zen_admin()));

drop policy if exists "public read visible program catalog"
  on public.program_catalog;
drop policy if exists "authenticated read non-private program catalog"
  on public.program_catalog;
drop policy if exists "admins manage program catalog"
  on public.program_catalog;
drop policy if exists "authenticated read available program catalog"
  on public.program_catalog;
drop policy if exists "admins insert program catalog"
  on public.program_catalog;
drop policy if exists "admins update program catalog"
  on public.program_catalog;
drop policy if exists "admins delete program catalog"
  on public.program_catalog;

create policy "public read visible program catalog"
  on public.program_catalog
  for select
  to anon
  using (
    visibility = 'public'
    and status not in ('draft', 'archived')
  );

create policy "authenticated read available program catalog"
  on public.program_catalog
  for select
  to authenticated
  using (
    (
      visibility in ('public', 'authenticated')
      and status not in ('draft', 'archived')
    )
    or (select public.is_zen_admin())
  );

create policy "admins insert program catalog"
  on public.program_catalog
  for insert
  to authenticated
  with check ((select public.is_zen_admin()));

create policy "admins update program catalog"
  on public.program_catalog
  for update
  to authenticated
  using ((select public.is_zen_admin()))
  with check ((select public.is_zen_admin()));

create policy "admins delete program catalog"
  on public.program_catalog
  for delete
  to authenticated
  using ((select public.is_zen_admin()));

drop policy if exists "users read own program registrations"
  on public.program_registrations;
drop policy if exists "users insert own program registrations"
  on public.program_registrations;
drop policy if exists "users update own cancellable registrations"
  on public.program_registrations;
drop policy if exists "admins manage program registrations"
  on public.program_registrations;
drop policy if exists "users or admins read program registrations"
  on public.program_registrations;
drop policy if exists "admins insert program registrations"
  on public.program_registrations;
drop policy if exists "admins update program registrations"
  on public.program_registrations;

create policy "users or admins read program registrations"
  on public.program_registrations
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  );

create policy "users or admins insert program registrations"
  on public.program_registrations
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  );

create policy "users or admins update program registrations"
  on public.program_registrations
  for update
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  )
  with check (
    (select public.is_zen_admin())
    or (
      (select auth.uid()) = user_id
      and status in ('waitlisted', 'cancelled')
    )
  );

drop policy if exists "users read own program access grants"
  on public.program_access_grants;
drop policy if exists "admins manage program access grants"
  on public.program_access_grants;
drop policy if exists "users or admins read program access grants"
  on public.program_access_grants;
drop policy if exists "admins insert program access grants"
  on public.program_access_grants;
drop policy if exists "admins update program access grants"
  on public.program_access_grants;
drop policy if exists "admins delete program access grants"
  on public.program_access_grants;

create policy "users or admins read program access grants"
  on public.program_access_grants
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  );

create policy "admins insert program access grants"
  on public.program_access_grants
  for insert
  to authenticated
  with check ((select public.is_zen_admin()));

create policy "admins update program access grants"
  on public.program_access_grants
  for update
  to authenticated
  using ((select public.is_zen_admin()))
  with check ((select public.is_zen_admin()));

create policy "admins delete program access grants"
  on public.program_access_grants
  for delete
  to authenticated
  using ((select public.is_zen_admin()));

drop policy if exists "users read own program progress"
  on public.program_user_progress;
drop policy if exists "users insert own program progress"
  on public.program_user_progress;
drop policy if exists "users update own program progress"
  on public.program_user_progress;
drop policy if exists "admins manage program progress"
  on public.program_user_progress;
drop policy if exists "users or admins read program progress"
  on public.program_user_progress;

create policy "users or admins read program progress"
  on public.program_user_progress
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  );

create policy "users insert own program progress"
  on public.program_user_progress
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users update own program progress"
  on public.program_user_progress
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ============================================================================
-- Secure paid-access RPCs
-- ============================================================================

create or replace function public.has_program_access(
  _user_id uuid,
  _program_key text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select
    (
      _user_id = (select auth.uid())
      or public.is_zen_admin()
    )
    and (
      exists (
        select 1
        from public.admin_allowlist allowlist
        join auth.users account
          on lower(account.email) = lower(allowlist.email)
        where account.id = _user_id
      )
      or exists (
        select 1
        from public.program_entitlements entitlement
        where entitlement.user_id = _user_id
          and entitlement.program_key = _program_key
          and entitlement.status in ('active', 'trialing')
          and (
            entitlement.access_starts_at is null
            or entitlement.access_starts_at <= now()
          )
          and (
            entitlement.access_ends_at is null
            or entitlement.access_ends_at > now()
          )
      )
    );
$function$;

revoke all on function public.has_program_access(uuid, text)
  from public, anon, authenticated, service_role;
grant execute on function public.has_program_access(uuid, text)
  to authenticated;

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
set search_path = ''
as $function$
declare
  result public.program_entitlements;
begin
  if not public.is_zen_admin() then
    raise exception using
      errcode = '42501',
      message = 'not_authorized';
  end if;

  if _program_key not in ('pioneer', 'vanguard') then
    raise exception using
      errcode = '22023',
      message = 'invalid_program_key';
  end if;

  insert into public.program_entitlements as entitlement (
    user_id,
    program_key,
    status,
    source,
    access_starts_at,
    access_ends_at,
    note
  )
  values (
    _user_id,
    _program_key,
    'active',
    coalesce(nullif(_source, ''), 'admin'),
    now(),
    _access_ends_at,
    _note
  )
  on conflict (user_id, program_key) do update
  set
    status = 'active',
    source = coalesce(excluded.source, entitlement.source),
    access_starts_at = coalesce(
      entitlement.access_starts_at,
      excluded.access_starts_at
    ),
    access_ends_at = excluded.access_ends_at,
    note = coalesce(excluded.note, entitlement.note),
    updated_at = now()
  returning * into result;

  return result;
end
$function$;

revoke all on function public.grant_program_access(
  uuid,
  text,
  text,
  timestamptz,
  text
)
from public, anon, authenticated, service_role;
grant execute on function public.grant_program_access(
  uuid,
  text,
  text,
  timestamptz,
  text
)
to authenticated;

create or replace function public.revoke_program_access(
  _user_id uuid,
  _program_key text,
  _note text default null
)
returns public.program_entitlements
language plpgsql
security definer
set search_path = ''
as $function$
declare
  result public.program_entitlements;
begin
  if not public.is_zen_admin() then
    raise exception using
      errcode = '42501',
      message = 'not_authorized';
  end if;

  update public.program_entitlements
  set
    status = 'revoked',
    note = coalesce(_note, note),
    updated_at = now()
  where user_id = _user_id
    and program_key = _program_key
  returning * into result;

  return result;
end
$function$;

revoke all on function public.revoke_program_access(uuid, text, text)
  from public, anon, authenticated, service_role;
grant execute on function public.revoke_program_access(uuid, text, text)
  to authenticated;

-- ============================================================================
-- Program catalog seed
-- ============================================================================

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
  (
    'ai-pioneer',
    'pioneer',
    'AI Pioneer Program',
    'Build-first AI literacy for youth builders.',
    'Youth ages 11-18',
    'live',
    'public',
    'enrollment_required',
    true,
    true,
    '/programs/pioneer/launch',
    '/programs/pioneer',
    10,
    '{"source":"program_integration_contract","launch_scope":"full_4_module_8_section_live_files_vault","vault_templates":["chatbot","text-generator","image-generator","code-agent"]}'::jsonb
  ),
  (
    'vanguard',
    'vanguard',
    'ZEN Vanguard',
    'Professional operator track for AI systems literacy.',
    'Adults, workforce learners, founders, operators',
    'preview',
    'public',
    'enrollment_required',
    true,
    true,
    '/dashboard',
    '/module/1',
    20,
    '{"source":"program_integration_contract"}'::jsonb
  ),
  (
    'homeschool-kit',
    'homeschool',
    'Homeschool Kit',
    'Structured AI curriculum for families and micro-schools.',
    'Families, micro-schools, and students ages 11-18',
    'waitlist',
    'public',
    'enrollment_required',
    false,
    false,
    '/programs/homeschool/launch',
    '/programs/homeschool',
    30,
    '{"source":"program_integration_contract"}'::jsonb
  ),
  (
    'web3-literacy',
    'web3',
    'Web3 Literacy',
    'Wallet safety, credential literacy, and trust systems.',
    'Teens, adults, and educators',
    'waitlist',
    'public',
    'enrollment_required',
    false,
    false,
    '/programs/web3/launch',
    '/programs/web3',
    40,
    '{"source":"program_integration_contract","simulation_first":true}'::jsonb
  ),
  (
    'train-a-trainer',
    't3',
    'Train-a-Trainer',
    'Facilitator readiness for delivering ZEN programs.',
    'Educators, mentors, facilitators, and program leaders',
    'waitlist',
    'public',
    'enrollment_required',
    false,
    false,
    '/programs/t3/launch',
    '/programs/t3',
    50,
    '{"source":"program_integration_contract"}'::jsonb
  )
on conflict (program_key) do update
set
  slug = excluded.slug,
  title = excluded.title,
  short_description = excluded.short_description,
  audience = excluded.audience,
  launch_route = excluded.launch_route,
  embedded_route = excluded.embedded_route,
  sort_order = excluded.sort_order,
  metadata = public.program_catalog.metadata || excluded.metadata,
  updated_at = now();

commit;
