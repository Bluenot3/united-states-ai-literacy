begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Answer keys are never exposed through PostgREST. Curriculum questions remain
-- presentation content; learner evidence stores aggregate scores only.
create table if not exists private.vanguard_quiz_requirements (
  quiz_id text primary key,
  module_number smallint not null check (module_number between 1 and 4),
  section_id text not null,
  answer_key smallint[] not null check (cardinality(answer_key) > 0),
  passing_percent smallint not null default 60 check (passing_percent between 1 and 100),
  required_for_certificate boolean not null default true,
  is_active boolean not null default true,
  definition_version integer not null default 1 check (definition_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

revoke all on private.vanguard_quiz_requirements from public, anon, authenticated, service_role;

-- SECURITY: shipped answer definitions are provisioned directly in the
-- protected Supabase project and are intentionally excluded from this public
-- repository. A new environment must initialize them through the admin-only
-- quiz requirement/publish RPC before learners can submit those quizzes.

create table if not exists public.vanguard_verified_evidence (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id text not null,
  module_number smallint not null check (module_number between 1 and 4),
  definition_version integer not null check (definition_version > 0),
  correct_count integer not null check (correct_count >= 0),
  incorrect_count integer not null check (incorrect_count >= 0),
  total_count integer not null check (total_count > 0),
  passed boolean not null,
  attempted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint vanguard_verified_evidence_score_check
    check (correct_count + incorrect_count = total_count)
);

create index if not exists vanguard_verified_evidence_user_quiz_idx
  on public.vanguard_verified_evidence (user_id, quiz_id, passed, attempted_at desc);

alter table public.vanguard_verified_evidence enable row level security;
alter table public.vanguard_verified_evidence force row level security;
revoke all on public.vanguard_verified_evidence from public, anon, authenticated, service_role;
grant select on public.vanguard_verified_evidence to authenticated, service_role;

drop policy if exists "learners read own verified evidence"
  on public.vanguard_verified_evidence;
create policy "learners read own verified evidence"
  on public.vanguard_verified_evidence
  for select
  to authenticated
  using ((select auth.uid()) = user_id or (select public.is_zen_admin()));

drop trigger if exists reject_verified_evidence_mutation
  on public.vanguard_verified_evidence;
drop function if exists private.reject_verified_evidence_mutation();

create or replace function public.submit_vanguard_quiz_attempt(
  p_quiz_id text,
  p_selected_option_indexes smallint[]
)
returns table (
  correct_count integer,
  incorrect_count integer,
  total_count integer,
  passed boolean,
  attempted_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  account_id uuid := (select auth.uid());
  definition private.vanguard_quiz_requirements%rowtype;
  answer_total integer;
  correct_total integer;
  passed_result boolean;
  attempt_time timestamptz := now();
begin
  if account_id is null then
    raise exception using errcode = '42501', message = 'authentication_required';
  end if;
  if not public.has_program_access(account_id, 'vanguard') then
    raise exception using errcode = '42501', message = 'vanguard_access_required';
  end if;

  select requirement.*
  into definition
  from private.vanguard_quiz_requirements requirement
  where requirement.quiz_id = left(coalesce(p_quiz_id, ''), 120)
    and requirement.is_active
  for share;

  if not found then
    raise exception using errcode = '22023', message = 'quiz_not_available';
  end if;

  answer_total := cardinality(definition.answer_key);
  if p_selected_option_indexes is null
    or cardinality(p_selected_option_indexes) <> answer_total
    or exists (
      select 1
      from unnest(p_selected_option_indexes) selected_index
      where selected_index < 0 or selected_index > 20
    ) then
    raise exception using errcode = '22023', message = 'invalid_quiz_submission';
  end if;

  select count(*)::integer
  into correct_total
  from generate_subscripts(definition.answer_key, 1) answer_position
  where definition.answer_key[answer_position]
    = p_selected_option_indexes[answer_position];

  passed_result := correct_total >= ceil(
    answer_total * definition.passing_percent / 100.0
  )::integer;

  insert into public.vanguard_verified_evidence (
    user_id,
    quiz_id,
    module_number,
    definition_version,
    correct_count,
    incorrect_count,
    total_count,
    passed,
    attempted_at
  ) values (
    account_id,
    definition.quiz_id,
    definition.module_number,
    definition.definition_version,
    correct_total,
    answer_total - correct_total,
    answer_total,
    passed_result,
    attempt_time
  );

  return query select
    correct_total,
    answer_total - correct_total,
    answer_total,
    passed_result,
    attempt_time;
end
$function$;

revoke all on function public.submit_vanguard_quiz_attempt(text, smallint[])
  from public, anon, authenticated, service_role;
grant execute on function public.submit_vanguard_quiz_attempt(text, smallint[])
  to authenticated;

-- Admin-only answer-key control lets future curriculum edits change a quiz
-- without exposing the key or requiring a code deployment.
create or replace function public.upsert_vanguard_quiz_requirement(
  p_quiz_id text,
  p_module_number smallint,
  p_section_id text,
  p_answer_key smallint[],
  p_passing_percent smallint default 60,
  p_required_for_certificate boolean default true,
  p_is_active boolean default true
)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if not public.is_zen_admin() then
    raise exception using errcode = '42501', message = 'admin_required';
  end if;
  if p_module_number not between 1 and 4
    or coalesce(btrim(p_quiz_id), '') = ''
    or coalesce(btrim(p_section_id), '') = ''
    or p_answer_key is null
    or cardinality(p_answer_key) = 0
    or p_passing_percent not between 1 and 100 then
    raise exception using errcode = '22023', message = 'invalid_quiz_requirement';
  end if;

  insert into private.vanguard_quiz_requirements as requirement (
    quiz_id,
    module_number,
    section_id,
    answer_key,
    passing_percent,
    required_for_certificate,
    is_active
  ) values (
    left(btrim(p_quiz_id), 120),
    p_module_number,
    left(btrim(p_section_id), 160),
    p_answer_key,
    p_passing_percent,
    p_required_for_certificate,
    p_is_active
  )
  on conflict (quiz_id) do update
  set module_number = excluded.module_number,
      section_id = excluded.section_id,
      answer_key = excluded.answer_key,
      passing_percent = excluded.passing_percent,
      required_for_certificate = excluded.required_for_certificate,
      is_active = excluded.is_active,
      definition_version = requirement.definition_version + 1,
      updated_at = now();
end
$function$;

revoke all on function public.upsert_vanguard_quiz_requirement(
  text, smallint, text, smallint[], smallint, boolean, boolean
) from public, anon, authenticated, service_role;
grant execute on function public.upsert_vanguard_quiz_requirement(
  text, smallint, text, smallint[], smallint, boolean, boolean
) to authenticated;

-- Learners can save ordinary progress, but only the guarded certificate RPCs
-- may write completion timestamps and credential pointers.
revoke insert, update on public.module_progress from authenticated;
grant insert (
  user_id,
  module_id,
  completed_sections,
  completed_interactives,
  points,
  started_at,
  last_viewed_section,
  updated_at
) on public.module_progress to authenticated;
grant update (
  user_id,
  module_id,
  completed_sections,
  completed_interactives,
  points,
  started_at,
  last_viewed_section,
  updated_at
) on public.module_progress to authenticated;

revoke update (final_certification_id, final_certification_hash)
  on public.user_profiles from authenticated;

-- Certificate rows are insert-only through security-definer issuance RPCs.
revoke all on public.program_certificates from public, anon, authenticated, service_role;
grant select on public.program_certificates to authenticated, service_role;

create or replace function private.reject_program_certificate_mutation()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  raise exception using errcode = '42501', message = 'program_certificate_is_immutable';
end
$function$;

drop trigger if exists reject_program_certificate_mutation
  on public.program_certificates;
create trigger reject_program_certificate_mutation
  before update or delete on public.program_certificates
  for each row execute function private.reject_program_certificate_mutation();

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
  credential_id text;
  issued_time timestamptz := now();
  fingerprint text;
  required_count integer;
  passed_count integer;
  verified_points integer;
  evidence_snapshot jsonb;
begin
  if account_id is null then
    raise exception using errcode = '42501', message = 'authentication_required';
  end if;
  if not public.has_program_access(account_id, 'vanguard') then
    raise exception using errcode = '42501', message = 'vanguard_access_required';
  end if;
  if p_module_number not between 1 and 4 then
    raise exception using errcode = '22023', message = 'invalid_module_number';
  end if;
  if clean_name = '' then
    raise exception using errcode = '22023', message = 'display_name_required';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    account_id::text || ':vanguard:module:' || p_module_number::text,
    0
  ));

  select count(*)::integer
  into required_count
  from private.vanguard_quiz_requirements requirement
  where requirement.module_number = p_module_number
    and requirement.required_for_certificate
    and requirement.is_active
    and not exists (
      select 1
      from public.content_overrides override_row
      where override_row.program_id = 'vanguard'
        and override_row.module_id = 'module' || p_module_number::text
        and override_row.section_id = requirement.section_id
        and override_row.is_published
        and override_row.position in ('hide', 'replace')
    );

  if required_count = 0 then
    raise exception using errcode = '42501', message = 'module_has_no_verified_requirements';
  end if;

  select count(*)::integer
  into passed_count
  from private.vanguard_quiz_requirements requirement
  where requirement.module_number = p_module_number
    and requirement.required_for_certificate
    and requirement.is_active
    and not exists (
      select 1
      from public.content_overrides override_row
      where override_row.program_id = 'vanguard'
        and override_row.module_id = 'module' || p_module_number::text
        and override_row.section_id = requirement.section_id
        and override_row.is_published
        and override_row.position in ('hide', 'replace')
    )
    and exists (
      select 1
      from public.vanguard_verified_evidence evidence
      where evidence.user_id = account_id
        and evidence.quiz_id = requirement.quiz_id
        and evidence.definition_version = requirement.definition_version
        and evidence.passed
    );

  if passed_count <> required_count then
    raise exception using errcode = '42501', message = 'verified_module_requirements_incomplete';
  end if;

  select
    coalesce(sum(best_attempt.correct_count), 0)::integer,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'quiz_id', requirement.quiz_id,
          'evidence_id', best_attempt.id,
          'correct', best_attempt.correct_count,
          'total', best_attempt.total_count,
          'attempted_at', best_attempt.attempted_at
        ) order by requirement.quiz_id
      ),
      '[]'::jsonb
    )
  into verified_points, evidence_snapshot
  from private.vanguard_quiz_requirements requirement
  join lateral (
    select evidence.id, evidence.correct_count, evidence.total_count, evidence.attempted_at
    from public.vanguard_verified_evidence evidence
    where evidence.user_id = account_id
      and evidence.quiz_id = requirement.quiz_id
      and evidence.definition_version = requirement.definition_version
      and evidence.passed
    order by evidence.correct_count desc, evidence.attempted_at desc
    limit 1
  ) best_attempt on true
  where requirement.module_number = p_module_number
    and requirement.required_for_certificate
    and requirement.is_active
    and not exists (
      select 1
      from public.content_overrides override_row
      where override_row.program_id = 'vanguard'
        and override_row.module_id = 'module' || p_module_number::text
        and override_row.section_id = requirement.section_id
        and override_row.is_published
        and override_row.position in ('hide', 'replace')
    );

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
            'verified_evidence', evidence_snapshot
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
      issued_time, required_count, required_count, required_count,
      verified_points, 100, fingerprint, 2
    )
    on conflict do nothing;

    select certificate.id
    into credential_id
    from public.program_certificates certificate
    where certificate.user_id = account_id
      and certificate.program_key = 'vanguard'
      and certificate.certificate_type = 'module'
      and certificate.module_number = p_module_number;
  end if;

  update public.module_progress progress
  set certificate_id = credential_id,
      certificate_hash = certificate.fingerprint_sha256,
      completed_at = coalesce(progress.completed_at, issued_time),
      updated_at = now()
  from public.program_certificates certificate
  where progress.user_id = account_id
    and progress.module_id = p_module_number
    and certificate.id = credential_id;

  if not found then
    insert into public.module_progress (
      user_id, module_id, completed_at, certificate_id, certificate_hash
    )
    select account_id, p_module_number, issued_time, certificate.id, certificate.fingerprint_sha256
    from public.program_certificates certificate
    where certificate.id = credential_id;
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

revoke all on function public.issue_vanguard_module_certificate(smallint, text)
  from public, anon, authenticated, service_role;
grant execute on function public.issue_vanguard_module_certificate(smallint, text)
  to authenticated;

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
  total_sections_completed integer;
  total_sections_required integer;
  total_interactives_completed integer;
  total_points_earned integer;
  module_fingerprints jsonb;
begin
  if account_id is null then
    raise exception using errcode = '42501', message = 'authentication_required';
  end if;
  if not public.has_program_access(account_id, 'vanguard') then
    raise exception using errcode = '42501', message = 'vanguard_access_required';
  end if;
  if clean_name = '' then
    raise exception using errcode = '22023', message = 'display_name_required';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    account_id::text || ':vanguard:final',
    0
  ));

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
      total_sections_completed,
      total_sections_required,
      total_interactives_completed,
      total_points_earned,
      module_fingerprints
    from public.program_certificates certificate
    where certificate.user_id = account_id
      and certificate.program_key = 'vanguard'
      and certificate.certificate_type = 'module'
      and certificate.module_number between 1 and 4
      and certificate.verification_version >= 2
      and certificate.completion_percentage = 100;

    if durable_module_count <> 4 then
      raise exception using errcode = '42501', message = 'all_verified_module_certificates_required';
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
            'module_certificates', module_fingerprints
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
      credential_id, 'vanguard', account_id, 'final', null, clean_name,
      issued_time, total_sections_completed, total_sections_required,
      total_interactives_completed, total_points_earned, 100, fingerprint, 2
    )
    on conflict do nothing;

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

-- Guided sessions are optional for enrolled learners, never a free-account
-- path around the program paywall.
drop policy if exists "registered users read joined live sessions"
  on public.program_live_sessions;
create policy "entitled registered users read joined live sessions"
  on public.program_live_sessions
  for select
  to authenticated
  using (
    (
      (select public.is_zen_admin())
      or public.has_program_access(
        (select auth.uid()),
        case
          when program_live_sessions.program_key = 'ai-pioneer' then 'pioneer'
          when program_live_sessions.program_key = 'vanguard' then 'vanguard'
          else '__invalid__'
        end
      )
    )
    and exists (
      select 1
      from public.program_live_session_registrations registration
      where registration.session_id = program_live_sessions.id
        and registration.user_id = (select auth.uid())
        and registration.status in ('registered', 'attended')
    )
  );

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
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  account_id uuid := (select auth.uid());
  paid_program_key text := case
    when _program_key = 'ai-pioneer' then 'pioneer'
    when _program_key = 'vanguard' then 'vanguard'
    else null
  end;
begin
  if account_id is null then
    raise exception using errcode = '42501', message = 'authentication_required';
  end if;
  if paid_program_key is null
    or not public.has_program_access(account_id, paid_program_key) then
    raise exception using errcode = '42501', message = 'program_access_required';
  end if;

  return query
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
            and mine.user_id = account_id
            and mine.status in ('registered', 'attended')
        )
      then session.meeting_url
      else null
    end,
    session.capacity,
    (
      select count(*)
      from public.program_live_session_registrations active_registration
      where active_registration.session_id = session.id
        and active_registration.status in ('registered', 'attended')
    ),
    session.status,
    exists (
      select 1
      from public.program_live_session_registrations mine
      where mine.session_id = session.id
        and mine.user_id = account_id
        and mine.status in ('registered', 'attended')
    ),
    session.starts_at > now()
      and (
        session.capacity is null
        or (
          select count(*)
          from public.program_live_session_registrations active_registration
          where active_registration.session_id = session.id
            and active_registration.status in ('registered', 'attended')
        ) < session.capacity
      )
  from public.program_live_sessions session
  where session.program_key = _program_key
    and session.status = 'scheduled'
    and session.ends_at > now()
  order by session.starts_at;
end
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
  paid_program_key text;
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

  paid_program_key := case
    when target_session.program_key = 'ai-pioneer' then 'pioneer'
    when target_session.program_key = 'vanguard' then 'vanguard'
    else null
  end;
  if paid_program_key is null
    or not public.has_program_access(account_id, paid_program_key) then
    raise exception using errcode = '42501', message = 'program_access_required';
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
  ) values (_session_id, account_id, 'registered', now(), null)
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

notify pgrst, 'reload schema';

commit;
