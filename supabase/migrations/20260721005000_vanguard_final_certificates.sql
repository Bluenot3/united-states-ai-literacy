-- Secure final-program credential issuance. This intentionally extends the
-- already-applied program_certificates migration without rewriting it.

begin;

do $migration_preflight$
begin
  if to_regclass('public.program_certificates') is null
    or to_regclass('public.user_profiles') is null then
    raise exception
      'Final certificate preflight failed: program_certificates and user_profiles must exist.';
  end if;
end
$migration_preflight$;

create or replace function public.issue_vanguard_final_certificate(
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
  credential_id text;
  issued_time timestamptz := now();
  fingerprint text;
  durable_module_count integer;
  completed_module_count integer;
  total_sections_completed integer;
  total_sections_required integer;
  total_interactives_completed integer;
  total_points_earned integer;
  module_fingerprints jsonb;
begin
  if account_id is null then
    raise exception using errcode = '42501', message = 'authentication_required';
  end if;

  if clean_name = '' then
    raise exception using errcode = '22023', message = 'display_name_required';
  end if;

  -- Idempotency: once issued, the immutable final record is always returned.
  select certificate.id
  into credential_id
  from public.program_certificates certificate
  where certificate.user_id = account_id
    and certificate.program_key = 'vanguard'
    and certificate.certificate_type = 'final'
    and certificate.module_number is null;

  if credential_id is null then
    select
      count(distinct certificate.module_number)::integer,
      count(*) filter (
        where certificate.completion_percentage = 100
          and certificate.sections_completed >= certificate.total_sections
      )::integer,
      coalesce(sum(certificate.sections_completed), 0)::integer,
      coalesce(sum(certificate.total_sections), 0)::integer,
      coalesce(sum(certificate.interactives_completed), 0)::integer,
      coalesce(sum(certificate.points_earned), 0)::integer,
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'module_number', certificate.module_number,
            'certificate_id', certificate.id,
            'fingerprint_sha256', certificate.fingerprint_sha256
          ) order by certificate.module_number
        ),
        '[]'::jsonb
      )
    into
      durable_module_count,
      completed_module_count,
      total_sections_completed,
      total_sections_required,
      total_interactives_completed,
      total_points_earned,
      module_fingerprints
    from public.program_certificates certificate
    where certificate.user_id = account_id
      and certificate.program_key = 'vanguard'
      and certificate.certificate_type = 'module'
      and certificate.module_number between 1 and 4;

    if durable_module_count <> 4 or completed_module_count <> 4 then
      raise exception using errcode = '42501', message = 'all_module_certificates_required';
    end if;

    credential_id := 'ZV-FINAL-'
      || upper(substr(replace(extensions.gen_random_uuid()::text, '-', ''), 1, 16));

    fingerprint := encode(
      extensions.digest(
        convert_to(
          jsonb_build_object(
            'id', credential_id,
            'program', 'vanguard',
            'user_id', account_id,
            'certificate_type', 'final',
            'display_name', clean_name,
            'issued_at', issued_time,
            'module_certificates', module_fingerprints,
            'sections_completed', total_sections_completed,
            'total_sections', total_sections_required,
            'interactives_completed', total_interactives_completed,
            'points_earned', total_points_earned
          )::text,
          'utf8'
        ),
        'sha256'
      ),
      'hex'
    );

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
    ) values (
      credential_id,
      'vanguard',
      account_id,
      'final',
      null,
      clean_name,
      issued_time,
      total_sections_completed,
      total_sections_required,
      total_interactives_completed,
      total_points_earned,
      100,
      fingerprint,
      1
    )
    on conflict (user_id, program_key, certificate_type, module_number)
    do nothing;

    -- A simultaneous issuance may have won the unique-index race.
    select certificate.id
    into credential_id
    from public.program_certificates certificate
    where certificate.user_id = account_id
      and certificate.program_key = 'vanguard'
      and certificate.certificate_type = 'final'
      and certificate.module_number is null;
  end if;

  update public.user_profiles profile
  set final_certification_id = certificate.id,
      final_certification_hash = certificate.fingerprint_sha256,
      updated_at = now()
  from public.program_certificates certificate
  where profile.id = account_id
    and certificate.id = credential_id;

  if not found then
    raise exception using errcode = 'P0002', message = 'user_profile_not_found';
  end if;

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

revoke all on function public.issue_vanguard_final_certificate(text)
  from public, anon, authenticated, service_role;
grant execute on function public.issue_vanguard_final_certificate(text)
  to authenticated;

commit;
