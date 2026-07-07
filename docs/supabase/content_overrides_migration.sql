-- ZEN Admin Content Overlay (CMS layer)
-- Additive CMS: lets ADMIN_EMAILS-owned accounts inject/replace/hide content
-- blocks on Pioneer module pages without code changes.
--
-- Run this in the Supabase SQL editor.

------------------------------------------------------------
-- 1. admin_allowlist ---------------------------------------
------------------------------------------------------------
create table if not exists public.admin_allowlist (
    email text primary key,
    created_at timestamptz not null default now()
);

grant select on public.admin_allowlist to authenticated;
grant all    on public.admin_allowlist to service_role;

alter table public.admin_allowlist enable row level security;

drop policy if exists "authenticated can read allowlist" on public.admin_allowlist;
create policy "authenticated can read allowlist"
  on public.admin_allowlist
  for select
  to authenticated
  using (true);

-- Seed with the same emails currently in src/services/adminAccess.ts
insert into public.admin_allowlist(email) values
  ('royaltokens@gmail.com'),
  ('admin@zenvanguard.com'),
  ('alexleschik@bgcgw.org'),
  ('testadmin@zenai.co'),
  ('alex1leschik@gmail.com'),
  ('huxley@zenai.biz')
on conflict (email) do nothing;

------------------------------------------------------------
-- 2. helper -----------------------------------------------
------------------------------------------------------------
create or replace function public.is_content_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_allowlist
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

------------------------------------------------------------
-- 3. content_overrides ------------------------------------
------------------------------------------------------------
create table if not exists public.content_overrides (
    id           uuid primary key default gen_random_uuid(),
    program_id   text not null,
    module_id    text not null,
    section_id   text,
    position     text not null check (position in ('before','after','replace','hide','append_module')),
    block_type   text not null check (block_type in ('rich_text','embed_url','video','image','html','link_card','divider')),
    payload      jsonb not null default '{}'::jsonb,
    sort_order   int  not null default 0,
    is_published boolean not null default false,
    created_by   text,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

create index if not exists content_overrides_lookup_idx
  on public.content_overrides (program_id, module_id, is_published, sort_order);

grant select, insert, update, delete on public.content_overrides to authenticated;
grant all on public.content_overrides to service_role;

alter table public.content_overrides enable row level security;

drop policy if exists "students read published"       on public.content_overrides;
drop policy if exists "admins read all overrides"     on public.content_overrides;
drop policy if exists "admins insert overrides"      on public.content_overrides;
drop policy if exists "admins update overrides"      on public.content_overrides;
drop policy if exists "admins delete overrides"      on public.content_overrides;

create policy "students read published"
  on public.content_overrides
  for select
  to authenticated
  using (is_published = true or public.is_content_admin());

create policy "admins insert overrides"
  on public.content_overrides
  for insert
  to authenticated
  with check (public.is_content_admin());

create policy "admins update overrides"
  on public.content_overrides
  for update
  to authenticated
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "admins delete overrides"
  on public.content_overrides
  for delete
  to authenticated
  using (public.is_content_admin());

-- updated_at trigger
create or replace function public.touch_content_overrides()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists content_overrides_touch on public.content_overrides;
create trigger content_overrides_touch
  before update on public.content_overrides
  for each row execute function public.touch_content_overrides();
