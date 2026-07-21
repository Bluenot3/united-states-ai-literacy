begin;

-- Progress belongs to the signed-in learner, but paid-program access is the
-- authorization boundary. Admins continue to pass through the canonical
-- Supabase admin helper; learners must own the row and hold an active
-- entitlement for the corresponding paid program.
drop policy if exists "vanguard users insert own module progress"
  on public.module_progress;
drop policy if exists "vanguard users update own module progress"
  on public.module_progress;

create policy "entitled users insert own vanguard module progress"
  on public.module_progress
  for insert
  to authenticated
  with check (
    (select public.is_zen_admin())
    or (
      (select auth.uid()) = user_id
      and public.has_program_access((select auth.uid()), 'vanguard')
    )
  );

create policy "entitled users update own vanguard module progress"
  on public.module_progress
  for update
  to authenticated
  using (
    (select public.is_zen_admin())
    or (
      (select auth.uid()) = user_id
      and public.has_program_access((select auth.uid()), 'vanguard')
    )
  )
  with check (
    (select public.is_zen_admin())
    or (
      (select auth.uid()) = user_id
      and public.has_program_access((select auth.uid()), 'vanguard')
    )
  );

drop policy if exists "users insert own program progress"
  on public.program_user_progress;
drop policy if exists "users update own program progress"
  on public.program_user_progress;

create policy "entitled users insert own program progress"
  on public.program_user_progress
  for insert
  to authenticated
  with check (
    (select public.is_zen_admin())
    or (
      (select auth.uid()) = user_id
      and case program_key
        when 'ai-pioneer' then public.has_program_access((select auth.uid()), 'pioneer')
        when 'vanguard' then public.has_program_access((select auth.uid()), 'vanguard')
        else false
      end
    )
  );

create policy "entitled users update own program progress"
  on public.program_user_progress
  for update
  to authenticated
  using (
    (select public.is_zen_admin())
    or (
      (select auth.uid()) = user_id
      and case program_key
        when 'ai-pioneer' then public.has_program_access((select auth.uid()), 'pioneer')
        when 'vanguard' then public.has_program_access((select auth.uid()), 'vanguard')
        else false
      end
    )
  )
  with check (
    (select public.is_zen_admin())
    or (
      (select auth.uid()) = user_id
      and case program_key
        when 'ai-pioneer' then public.has_program_access((select auth.uid()), 'pioneer')
        when 'vanguard' then public.has_program_access((select auth.uid()), 'vanguard')
        else false
      end
    )
  );

-- program_registrations.email is identity metadata, not learner-authored
-- contact data. Always copy it from the target Supabase Auth user so browser,
-- admin, and trusted-server writes cannot create a mismatched identity row.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.set_program_registration_auth_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  canonical_email text;
begin
  select account.email
  into canonical_email
  from auth.users account
  where account.id = new.user_id;

  if not found then
    raise exception using
      errcode = '23503',
      message = 'registration_user_not_found';
  end if;

  new.email := canonical_email;
  return new;
end
$function$;

revoke all on function private.set_program_registration_auth_email()
  from public, anon, authenticated, service_role;

drop trigger if exists program_registrations_set_auth_email
  on public.program_registrations;
create trigger program_registrations_set_auth_email
  before insert or update on public.program_registrations
  for each row execute function private.set_program_registration_auth_email();

-- Repair legacy mismatches without changing registration ownership or status.
update public.program_registrations registration
set email = account.email
from auth.users account
where account.id = registration.user_id
  and registration.email is distinct from account.email;

commit;
