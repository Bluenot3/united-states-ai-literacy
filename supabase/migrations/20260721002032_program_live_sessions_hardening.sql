begin;

-- The original live-session migration is already applied in production.
-- Recreate the listing function atomically because PostgreSQL cannot change a
-- RETURNS TABLE signature with CREATE OR REPLACE alone.
drop function if exists public.list_program_live_sessions(text);

create function public.list_program_live_sessions(_program_key text)
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

notify pgrst, 'reload schema';

commit;
