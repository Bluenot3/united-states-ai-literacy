begin;

create table if not exists public.program_live_sessions (
  id uuid primary key default gen_random_uuid(),
  program_key text not null references public.program_catalog(program_key) on update cascade on delete restrict,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'UTC',
  meeting_url text,
  capacity integer,
  status text not null default 'scheduled',
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint program_live_sessions_time_check check (ends_at > starts_at),
  constraint program_live_sessions_capacity_check check (capacity is null or capacity > 0),
  constraint program_live_sessions_status_check check (status in ('scheduled', 'cancelled', 'completed'))
);

create table if not exists public.program_live_session_registrations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.program_live_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'registered',
  registered_at timestamptz not null default now(),
  cancelled_at timestamptz,
  attended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, user_id),
  constraint program_live_session_registrations_status_check
    check (status in ('registered', 'cancelled', 'attended', 'no_show'))
);

create index if not exists program_live_sessions_program_start_idx
  on public.program_live_sessions (program_key, starts_at);
create index if not exists program_live_session_registrations_user_idx
  on public.program_live_session_registrations (user_id, status);

drop trigger if exists program_live_sessions_set_updated_at on public.program_live_sessions;
create trigger program_live_sessions_set_updated_at
  before update on public.program_live_sessions
  for each row execute function public.set_updated_at();

drop trigger if exists program_live_session_registrations_set_updated_at
  on public.program_live_session_registrations;
create trigger program_live_session_registrations_set_updated_at
  before update on public.program_live_session_registrations
  for each row execute function public.set_updated_at();

alter table public.program_live_sessions enable row level security;
alter table public.program_live_session_registrations enable row level security;

revoke all on public.program_live_sessions from public, anon, authenticated;
grant select, insert, update, delete on public.program_live_sessions to authenticated;
grant all on public.program_live_sessions to service_role;

revoke all on public.program_live_session_registrations from public, anon, authenticated;
grant select, insert, update, delete on public.program_live_session_registrations to authenticated;
grant all on public.program_live_session_registrations to service_role;

drop policy if exists "admins manage live sessions" on public.program_live_sessions;
drop policy if exists "registered users read joined live sessions" on public.program_live_sessions;
create policy "admins manage live sessions"
  on public.program_live_sessions
  for all
  to authenticated
  using ((select public.is_zen_admin()))
  with check ((select public.is_zen_admin()));
create policy "registered users read joined live sessions"
  on public.program_live_sessions
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.program_live_session_registrations registration
      where registration.session_id = program_live_sessions.id
        and registration.user_id = (select auth.uid())
        and registration.status in ('registered', 'attended')
    )
  );

drop policy if exists "users read own live session registrations"
  on public.program_live_session_registrations;
drop policy if exists "admins manage live session registrations"
  on public.program_live_session_registrations;
create policy "users read own live session registrations"
  on public.program_live_session_registrations
  for select
  to authenticated
  using ((select auth.uid()) = user_id);
create policy "admins manage live session registrations"
  on public.program_live_session_registrations
  for all
  to authenticated
  using ((select public.is_zen_admin()))
  with check ((select public.is_zen_admin()));

create or replace function public.list_program_live_sessions(_program_key text)
returns table (
  id uuid,
  program_key text,
  title text,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  timezone text,
  meeting_url text,
  capacity integer,
  registered_count bigint,
  status text,
  is_registered boolean,
  registration_open boolean
)
language sql
stable
security definer
set search_path = ''
as $function$
  select
    session.id,
    session.program_key,
    session.title,
    session.description,
    session.starts_at,
    session.ends_at,
    session.timezone,
    case
      when public.is_zen_admin()
        or exists (
          select 1
          from public.program_live_session_registrations mine
          where mine.session_id = session.id
            and mine.user_id = (select auth.uid())
            and mine.status in ('registered', 'attended')
        )
      then session.meeting_url
      else null
    end as meeting_url,
    session.capacity,
    (
      select count(*)
      from public.program_live_session_registrations active_registration
      where active_registration.session_id = session.id
        and active_registration.status in ('registered', 'attended')
    ) as registered_count,
    session.status,
    exists (
      select 1
      from public.program_live_session_registrations mine
      where mine.session_id = session.id
        and mine.user_id = (select auth.uid())
        and mine.status in ('registered', 'attended')
    ) as is_registered,
    session.starts_at > now() as registration_open
  from public.program_live_sessions session
  where (select auth.uid()) is not null
    and session.program_key = _program_key
    and session.status = 'scheduled'
    and session.ends_at > now()
  order by session.starts_at;
$function$;

revoke all on function public.list_program_live_sessions(text)
  from public, anon, authenticated, service_role;
grant execute on function public.list_program_live_sessions(text) to authenticated;

create or replace function public.register_for_live_session(_session_id uuid)
returns public.program_live_session_registrations
language plpgsql
security definer
set search_path = ''
as $function$
declare
  account_id uuid := (select auth.uid());
  target_session public.program_live_sessions;
  active_count bigint;
  result public.program_live_session_registrations;
begin
  if account_id is null then
    raise exception using errcode = '42501', message = 'authentication_required';
  end if;

  select * into target_session
  from public.program_live_sessions
  where id = _session_id
  for update;

  if target_session.id is null then
    raise exception using errcode = 'P0002', message = 'session_not_found';
  end if;
  if target_session.status <> 'scheduled' or target_session.starts_at <= now() then
    raise exception using errcode = '22023', message = 'session_not_open';
  end if;

  select count(*) into active_count
  from public.program_live_session_registrations
  where session_id = _session_id
    and status in ('registered', 'attended');

  if target_session.capacity is not null and active_count >= target_session.capacity then
    raise exception using errcode = '22023', message = 'session_full';
  end if;

  insert into public.program_live_session_registrations as registration (
    session_id, user_id, status, registered_at, cancelled_at
  )
  values (_session_id, account_id, 'registered', now(), null)
  on conflict (session_id, user_id) do update
  set status = 'registered',
      registered_at = now(),
      cancelled_at = null,
      updated_at = now()
  returning * into result;

  return result;
end
$function$;

revoke all on function public.register_for_live_session(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.register_for_live_session(uuid) to authenticated;

create or replace function public.cancel_live_session_registration(_session_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  account_id uuid := (select auth.uid());
begin
  if account_id is null then
    raise exception using errcode = '42501', message = 'authentication_required';
  end if;

  update public.program_live_session_registrations as registration
  set status = 'cancelled',
      cancelled_at = now(),
      updated_at = now()
  from public.program_live_sessions as session
  where registration.session_id = _session_id
    and registration.user_id = account_id
    and registration.status = 'registered'
    and session.id = registration.session_id
    and session.status = 'scheduled'
    and session.starts_at > now();
end
$function$;

revoke all on function public.cancel_live_session_registration(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.cancel_live_session_registration(uuid) to authenticated;

commit;
