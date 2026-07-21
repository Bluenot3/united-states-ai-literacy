begin;

-- Published Curriculum Studio documents for paid programs must follow the
-- same program-scoped entitlement boundary as the routed learner experience.
-- Other published program overlays retain their existing authenticated-reader
-- behavior until those programs adopt paid entitlement keys of their own.
drop policy if exists "students read published" on public.content_overrides;
drop policy if exists "students read published content overrides" on public.content_overrides;

create policy "students read entitled published content overrides"
  on public.content_overrides
  for select
  to authenticated
  using (
    (select public.is_zen_admin())
    or (
      is_published
      and (
        program_id not in ('pioneer', 'vanguard')
        or public.has_program_access((select auth.uid()), program_id)
      )
    )
  );

commit;
