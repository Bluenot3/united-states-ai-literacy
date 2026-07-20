begin;

create index if not exists program_access_grants_granted_by_idx
  on public.program_access_grants (granted_by);

drop policy if exists "users insert own program registrations"
  on public.program_registrations;
drop policy if exists "admins insert program registrations"
  on public.program_registrations;
drop policy if exists "users or admins insert program registrations"
  on public.program_registrations;

create policy "users or admins insert program registrations"
  on public.program_registrations
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  );

drop policy if exists "users update own cancellable registrations"
  on public.program_registrations;
drop policy if exists "admins update program registrations"
  on public.program_registrations;
drop policy if exists "users or admins update program registrations"
  on public.program_registrations;

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

commit;
