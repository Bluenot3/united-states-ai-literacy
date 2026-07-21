begin;

-- Auth owns identity and billing fields. Learners may update only the profile
-- fields the course experience genuinely needs.
revoke insert, update, delete on public.user_profiles from authenticated;
grant select on public.user_profiles to authenticated;
grant update (
  name,
  picture,
  total_points,
  final_certification_id,
  final_certification_hash,
  updated_at
) on public.user_profiles to authenticated;

create or replace function public.ensure_my_user_profile()
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  account_id uuid := (select auth.uid());
  account_email text := lower(coalesce((select auth.jwt() ->> 'email'), ''));
begin
  if account_id is null or account_email = '' then
    raise exception using errcode = '42501', message = 'authentication_required';
  end if;

  insert into public.user_profiles (id, email, name, picture)
  values (
    account_id,
    account_email,
    coalesce(nullif(split_part(account_email, '@', 1), ''), 'Vanguard Pioneer'),
    'https://api.dicebear.com/7.x/initials/svg?seed=' || account_id::text
  )
  on conflict (id) do nothing;
end
$function$;

revoke all on function public.ensure_my_user_profile() from public, anon, authenticated, service_role;
grant execute on function public.ensure_my_user_profile() to authenticated;

-- Convert any historical global Vanguard flag before all runtime gates stop
-- consulting that legacy field. This migration is idempotent.
insert into public.program_entitlements (
  user_id,
  program_key,
  status,
  source,
  access_starts_at,
  note
)
select
  profile.id,
  'vanguard',
  'active',
  'legacy_profile_backfill',
  coalesce(profile.created_at, now()),
  'Backfilled from the retired user_profiles.is_entitled flag.'
from public.user_profiles profile
where profile.is_entitled = true
on conflict (user_id, program_key) do nothing;

-- Curriculum Studio stores exactly one shared draft and one published document
-- per program while the general overlay editor can still keep many blocks.
create unique index if not exists content_overrides_curriculum_studio_document_uidx
  on public.content_overrides (program_id, module_id, section_id)
  where module_id = '__curriculum_studio__';

create index if not exists program_live_sessions_created_by_idx
  on public.program_live_sessions (created_by);

commit;
