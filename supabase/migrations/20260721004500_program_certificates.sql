-- Durable, privacy-safe Vanguard certificate issuance and public verification.
-- Certificate records are immutable. Public verification is exposed only
-- through a field-limited RPC so account IDs and email addresses never leave
-- the database.

begin;

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.program_certificates (
  id text primary key,
  program_key text not null default 'vanguard'
    check (program_key = 'vanguard'),
  user_id uuid not null,
  certificate_type text not null
    check (certificate_type in ('module', 'final')),
  module_number smallint,
  display_name text not null
    check (char_length(display_name) between 1 and 120),
  issued_at timestamptz not null default now(),
  sections_completed integer not null check (sections_completed >= 0),
  total_sections integer not null check (total_sections > 0),
  interactives_completed integer not null check (interactives_completed >= 0),
  points_earned integer not null check (points_earned >= 0),
  completion_percentage integer not null
    check (completion_percentage between 0 and 100),
  fingerprint_sha256 text not null
    check (fingerprint_sha256 ~ '^[0-9a-f]{64}$'),
  verification_version smallint not null default 1,
  created_at timestamptz not null default now(),
  constraint program_certificates_module_shape check (
    (certificate_type = 'module' and module_number between 1 and 4)
    or (certificate_type = 'final' and module_number is null)
  )
);

create unique index if not exists program_certificates_owner_credential_uidx
  on public.program_certificates (
    user_id,
    program_key,
    certificate_type,
    module_number
  ) nulls not distinct;

create index if not exists program_certificates_user_idx
  on public.program_certificates (user_id, issued_at desc);

alter table public.program_certificates enable row level security;
alter table public.program_certificates force row level security;

revoke all on public.program_certificates from public, anon, authenticated;
grant select on public.program_certificates to authenticated, service_role;

drop policy if exists "certificate owners and admins can read records"
  on public.program_certificates;
create policy "certificate owners and admins can read records"
  on public.program_certificates
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select public.is_zen_admin())
  );

-- Preserve certificates already recorded in module_progress. No email address
-- is copied into the durable certificate record.
insert into public.program_certificates (
  id,
  program_key,
  user_id,
  certificate_type,
  module_number,
  display_name,
  issued_at,
  sections_completed,
  total_sections,
  interactives_completed,
  points_earned,
  completion_percentage,
  fingerprint_sha256,
  verification_version
)
select
  progress.certificate_id,
  'vanguard',
  progress.user_id,
  'module',
  progress.module_id,
  left(coalesce(nullif(btrim(profile.name), ''), 'Vanguard Learner'), 120),
  coalesce(progress.completed_at, progress.updated_at, now()),
  least(
    cardinality(coalesce(progress.completed_sections, '{}'::text[])),
    case progress.module_id when 1 then 38 when 2 then 27 when 3 then 25 when 4 then 24 end
  ),
  case progress.module_id when 1 then 38 when 2 then 27 when 3 then 25 when 4 then 24 end,
  cardinality(coalesce(progress.completed_interactives, '{}'::text[])),
  greatest(coalesce(progress.points, 0), 0),
  least(
    100,
    round(
      100.0 * cardinality(coalesce(progress.completed_sections, '{}'::text[]))
      / (case progress.module_id when 1 then 38 when 2 then 27 when 3 then 25 when 4 then 24 end)
    )::integer
  ),
  case
    when progress.certificate_hash ~ '^[0-9a-fA-F]{64}$'
      then lower(progress.certificate_hash)
    else encode(
      extensions.digest(
        convert_to(
          concat_ws('|', progress.certificate_id, progress.user_id, progress.module_id),
          'utf8'
        ),
        'sha256'
      ),
      'hex'
    )
  end,
  1
from public.module_progress progress
left join public.user_profiles profile on profile.id = progress.user_id
where progress.certificate_id is not null
  and progress.module_id between 1 and 4
on conflict (id) do nothing;

create or replace function public.issue_vanguard_module_certificate(
  p_module_number smallint,
  p_display_name text
)
returns table (
  id text,
  certificate_type text,
  module_number smallint,
  display_name text,
  issued_at timestamptz,
  sections_completed integer,
  total_sections integer,
  interactives_completed integer,
  points_earned integer,
  completion_percentage integer,
  fingerprint_sha256 text,
  verification_version smallint
)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  account_id uuid := (select auth.uid());
  clean_name text := left(btrim(coalesce(p_display_name, '')), 120);
  progress public.module_progress%rowtype;
  required_ids text[];
  credential_id text;
  issued_time timestamptz := now();
  fingerprint text;
begin
  if account_id is null then
    raise exception using errcode = '42501', message = 'authentication_required';
  end if;

  if p_module_number not between 1 and 4 then
    raise exception using errcode = '22023', message = 'invalid_module_number';
  end if;

  if clean_name = '' then
    raise exception using errcode = '22023', message = 'display_name_required';
  end if;

  required_ids := case p_module_number
    when 1 then array[
      'overview','ai-foundations','ai-magic-demo','ai-models','module-1',
      '1-1','1-2','1-3','1-4','1-5','1-6','1-7','1-8','1-9','1-10',
      '1-11','1-12','1-13','1-14','1-15','1-16','1-17','1-18','1-19',
      '1-20','1-21','1-22','module-2','2-1','2-2','2-3','2-4','2-5',
      '2-6','2-7','2-8','2-9','2-10'
    ]::text[]
    when 2 then array[
      'overview','part-1','1-1','1-2','1-3','1-4','1-5','1-6','1-7',
      '1-8','1-9','1-10','1-11','part-2','2-1','2-2','2-3','2-4','2-5',
      '2-6','2-7','2-8','2-9','2-10','2-11','deliverables','outcome'
    ]::text[]
    when 3 then array[
      'overview','part-1','3-1','3-2','3-3','3-4','3-5','3-6','3-7',
      '3-8','3-9','3-10','3-11','part-2','3-12','3-13','3-14','3-15',
      '3-16','3-17','3-18','3-19','3-20','3-21','3-22'
    ]::text[]
    when 4 then array[
      'part-1','1-1','1-2','1-3','1-4','1-5','1-6','1-7','1-8','1-9',
      '1-10','1-11','part-2','2-1','2-2','2-3','2-4','2-5','2-6','2-7',
      '2-8','2-9','2-10','2-11'
    ]::text[]
  end;

  select module_row.*
  into progress
  from public.module_progress module_row
  where module_row.user_id = account_id
    and module_row.module_id = p_module_number
  for update;

  if not found
    or not required_ids <@ coalesce(progress.completed_sections, '{}'::text[]) then
    raise exception using errcode = '42501', message = 'module_not_complete';
  end if;

  select certificate.id
  into credential_id
  from public.program_certificates certificate
  where certificate.user_id = account_id
    and certificate.program_key = 'vanguard'
    and certificate.certificate_type = 'module'
    and certificate.module_number = p_module_number;

  if credential_id is null then
    credential_id := 'ZV-M' || p_module_number::text || '-'
      || upper(substr(replace(extensions.gen_random_uuid()::text, '-', ''), 1, 16));

    fingerprint := encode(
      extensions.digest(
        convert_to(
          jsonb_build_object(
            'id', credential_id,
            'program', 'vanguard',
            'user_id', account_id,
            'module', p_module_number,
            'display_name', clean_name,
            'issued_at', issued_time,
            'sections_completed', cardinality(required_ids),
            'total_sections', cardinality(required_ids),
            'interactives_completed', cardinality(coalesce(progress.completed_interactives, '{}'::text[])),
            'points_earned', greatest(coalesce(progress.points, 0), 0)
          )::text,
          'utf8'
        ),
        'sha256'
      ),
      'hex'
    );

    insert into public.program_certificates (
      id, program_key, user_id, certificate_type, module_number, display_name,
      issued_at, sections_completed, total_sections, interactives_completed,
      points_earned, completion_percentage, fingerprint_sha256,
      verification_version
    ) values (
      credential_id, 'vanguard', account_id, 'module', p_module_number, clean_name,
      issued_time, cardinality(required_ids), cardinality(required_ids),
      cardinality(coalesce(progress.completed_interactives, '{}'::text[])),
      greatest(coalesce(progress.points, 0), 0), 100, fingerprint, 1
    );
  end if;

  update public.module_progress
  set certificate_id = credential_id,
      certificate_hash = (
        select certificate.fingerprint_sha256
        from public.program_certificates certificate
        where certificate.id = credential_id
      ),
      completed_at = coalesce(completed_at, issued_time),
      updated_at = now()
  where user_id = account_id
    and module_id = p_module_number;

  return query
  select
    certificate.id,
    certificate.certificate_type,
    certificate.module_number,
    certificate.display_name,
    certificate.issued_at,
    certificate.sections_completed,
    certificate.total_sections,
    certificate.interactives_completed,
    certificate.points_earned,
    certificate.completion_percentage,
    certificate.fingerprint_sha256,
    certificate.verification_version
  from public.program_certificates certificate
  where certificate.id = credential_id;
end
$function$;

revoke all on function public.issue_vanguard_module_certificate(smallint, text)
  from public, anon, authenticated, service_role;
grant execute on function public.issue_vanguard_module_certificate(smallint, text)
  to authenticated;

create or replace function public.verify_program_certificate(p_certificate_id text)
returns table (
  id text,
  program_key text,
  certificate_type text,
  module_number smallint,
  display_name text,
  issued_at timestamptz,
  sections_completed integer,
  total_sections integer,
  interactives_completed integer,
  points_earned integer,
  completion_percentage integer,
  fingerprint_sha256 text,
  verification_version smallint
)
language sql
stable
security definer
set search_path = ''
as $function$
  select
    certificate.id,
    certificate.program_key,
    certificate.certificate_type,
    certificate.module_number,
    certificate.display_name,
    certificate.issued_at,
    certificate.sections_completed,
    certificate.total_sections,
    certificate.interactives_completed,
    certificate.points_earned,
    certificate.completion_percentage,
    certificate.fingerprint_sha256,
    certificate.verification_version
  from public.program_certificates certificate
  where certificate.id = left(coalesce(p_certificate_id, ''), 160)
  limit 1;
$function$;

revoke all on function public.verify_program_certificate(text)
  from public, anon, authenticated, service_role;
grant execute on function public.verify_program_certificate(text)
  to anon, authenticated;

commit;
