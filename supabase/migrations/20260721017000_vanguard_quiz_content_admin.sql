begin;

-- Extend the existing content overlay rather than introducing another CMS.
alter table public.content_overrides
  drop constraint if exists content_overrides_block_type_check;
alter table public.content_overrides
  add constraint content_overrides_block_type_check
  check (
    block_type in (
      'rich_text', 'embed_url', 'video', 'image', 'html',
      'link_card', 'divider', 'quiz'
    )
  );

create unique index if not exists content_overrides_vanguard_quiz_id_uidx
  on public.content_overrides ((payload ->> 'quiz_id'))
  where program_id = 'vanguard' and block_type = 'quiz';

-- Preserve the original private definitions so removing an override can
-- restore a shipped quiz without reintroducing an answer key to the client.
create table if not exists private.vanguard_shipped_quiz_requirements (
  quiz_id text primary key,
  module_number smallint not null check (module_number between 1 and 4),
  section_id text not null,
  answer_key smallint[] not null check (cardinality(answer_key) > 0),
  passing_percent smallint not null check (passing_percent between 1 and 100),
  required_for_certificate boolean not null,
  created_at timestamptz not null default now()
);

revoke all on private.vanguard_shipped_quiz_requirements
  from public, anon, authenticated, service_role;

insert into private.vanguard_shipped_quiz_requirements (
  quiz_id, module_number, section_id, answer_key, passing_percent,
  required_for_certificate
)
select
  requirement.quiz_id,
  requirement.module_number,
  requirement.section_id,
  requirement.answer_key,
  requirement.passing_percent,
  requirement.required_for_certificate
from private.vanguard_quiz_requirements requirement
where requirement.quiz_id in (
  'quiz-1-1', 'quiz-1-2', 'quiz-1-exit',
  'quiz-2-1', 'quiz-2-2',
  'quiz-3-1', 'quiz-3-2',
  'quiz-4-1', 'quiz-4-2'
)
on conflict (quiz_id) do nothing;

-- The database needs the same section hierarchy as the routed curriculum so
-- certificate checks can distinguish a visible quiz from an orphaned or
-- ancestor-hidden block. New code-defined sections should be registered here
-- before admins attach required quizzes to them.
create table if not exists private.vanguard_curriculum_sections (
  module_number smallint not null check (module_number between 1 and 4),
  section_id text not null,
  ancestor_section_ids text[] not null default '{}'::text[],
  primary key (module_number, section_id)
);

revoke all on private.vanguard_curriculum_sections
  from public, anon, authenticated, service_role;

insert into private.vanguard_curriculum_sections (
  module_number, section_id, ancestor_section_ids
) values
  (1, '__module__', '{}'),
  (1, 'overview', '{}'),
  (1, 'ai-foundations', '{}'),
  (1, 'ai-magic-demo', '{}'),
  (1, 'ai-models', '{}'),
  (1, 'module-1', '{}'),
  (1, 'module-2', '{}'),
  (2, '__module__', '{}'),
  (2, 'overview', '{}'),
  (2, 'part-1', '{}'),
  (2, 'part-2', '{}'),
  (2, 'deliverables', '{}'),
  (2, 'outcome', '{}'),
  (3, '__module__', '{}'),
  (3, 'overview', '{}'),
  (3, 'part-1', '{}'),
  (3, 'part-2', '{}'),
  (4, '__module__', '{}'),
  (4, 'part-1', '{}'),
  (4, 'part-2', '{}')
on conflict (module_number, section_id) do update
set ancestor_section_ids = excluded.ancestor_section_ids;

insert into private.vanguard_curriculum_sections (
  module_number, section_id, ancestor_section_ids
)
select 1, '1-' || value::text, array['module-1']::text[]
from generate_series(1, 22) value
union all
select 1, '2-' || value::text, array['module-2']::text[]
from generate_series(1, 10) value
union all
select 2, '1-' || value::text, array['part-1']::text[]
from generate_series(1, 11) value
union all
select 2, '2-' || value::text, array['part-2']::text[]
from generate_series(1, 11) value
union all
select 3, '3-' || value::text,
  case when value <= 11 then array['part-1']::text[] else array['part-2']::text[] end
from generate_series(1, 22) value
union all
select 4, '1-' || value::text, array['part-1']::text[]
from generate_series(1, 11) value
union all
select 4, '2-' || value::text, array['part-2']::text[]
from generate_series(1, 11) value
on conflict (module_number, section_id) do update
set ancestor_section_ids = excluded.ancestor_section_ids;

create or replace function private.recompute_vanguard_quiz_requirement_activity(
  p_module_number smallint
)
returns void
language sql
security definer
set search_path = ''
as $function$
  with desired as (
    select
      requirement.quiz_id,
      (
        section.section_id is not null
        and (
          exists (
            select 1
            from private.vanguard_shipped_quiz_requirements shipped
            where shipped.quiz_id = requirement.quiz_id
          )
          or exists (
            select 1
            from public.content_overrides quiz_row
            where quiz_row.program_id = 'vanguard'
              and quiz_row.module_id = 'module' || requirement.module_number::text
              and quiz_row.block_type = 'quiz'
              and quiz_row.is_published
              and quiz_row.payload ->> 'quiz_id' = requirement.quiz_id
          )
        )
        and not exists (
          select 1
          from public.content_overrides suppression
          where suppression.program_id = 'vanguard'
            and suppression.module_id = 'module' || requirement.module_number::text
            and suppression.is_published
            and suppression.position in ('hide', 'replace')
            and suppression.section_id = any(
              array_prepend(requirement.section_id, section.ancestor_section_ids)
            )
        )
      ) as should_be_active
    from private.vanguard_quiz_requirements requirement
    left join private.vanguard_curriculum_sections section
      on section.module_number = requirement.module_number
     and section.section_id = requirement.section_id
    where requirement.module_number = p_module_number
  )
  update private.vanguard_quiz_requirements requirement
  set is_active = desired.should_be_active,
      updated_at = now()
  from desired
  where requirement.quiz_id = desired.quiz_id
    and requirement.is_active is distinct from desired.should_be_active;
$function$;

revoke all on function private.recompute_vanguard_quiz_requirement_activity(smallint)
  from public, anon, authenticated, service_role;

create or replace function private.sync_vanguard_quiz_activity_after_overlay()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  old_module smallint;
  new_module smallint;
begin
  if tg_op <> 'INSERT' then
    if old.program_id = 'vanguard' and old.module_id ~ '^module[1-4]$' then
      old_module := right(old.module_id, 1)::smallint;
      perform private.recompute_vanguard_quiz_requirement_activity(old_module);
    end if;
  end if;

  if tg_op <> 'DELETE' then
    if new.program_id = 'vanguard' and new.module_id ~ '^module[1-4]$' then
      new_module := right(new.module_id, 1)::smallint;
      if old_module is null or new_module <> old_module then
        perform private.recompute_vanguard_quiz_requirement_activity(new_module);
      end if;
    end if;
  end if;

  if tg_op = 'DELETE' then return old; end if;
  return new;
end
$function$;

revoke all on function private.sync_vanguard_quiz_activity_after_overlay()
  from public, anon, authenticated, service_role;

drop trigger if exists sync_vanguard_quiz_activity_after_overlay
  on public.content_overrides;
create trigger sync_vanguard_quiz_activity_after_overlay
  after insert or update or delete on public.content_overrides
  for each row execute function private.sync_vanguard_quiz_activity_after_overlay();

do $function$
declare
  module_number smallint;
begin
  for module_number in 1..4 loop
    perform private.recompute_vanguard_quiz_requirement_activity(module_number::smallint);
  end loop;
end
$function$;

-- Quiz rows must go through the atomic RPC. Ordinary overlay rows retain the
-- current RLS-admin workflow.
create or replace function private.guard_vanguard_quiz_override_writes()
returns trigger
language plpgsql
set search_path = ''
as $function$
declare
  touches_vanguard_quiz boolean := false;
begin
  if tg_op <> 'INSERT' then
    touches_vanguard_quiz := touches_vanguard_quiz
      or (old.program_id = 'vanguard' and old.block_type = 'quiz');
  end if;
  if tg_op <> 'DELETE' then
    touches_vanguard_quiz := touches_vanguard_quiz
      or (new.program_id = 'vanguard' and new.block_type = 'quiz');
  end if;

  if touches_vanguard_quiz and current_user in ('anon', 'authenticated', 'service_role') then
    raise exception using
      errcode = '42501',
      message = 'use_vanguard_quiz_admin_rpc';
  end if;

  if tg_op = 'DELETE' then return old; end if;
  return new;
end
$function$;

revoke all on function private.guard_vanguard_quiz_override_writes()
  from public, anon, authenticated, service_role;

drop trigger if exists guard_vanguard_quiz_override_writes
  on public.content_overrides;
create trigger guard_vanguard_quiz_override_writes
  before insert or update or delete on public.content_overrides
  for each row execute function private.guard_vanguard_quiz_override_writes();

-- Retire the split private-definition editor. All browser administration now
-- publishes public copy and private scoring data in one transaction.
revoke all on function public.upsert_vanguard_quiz_requirement(
  text, smallint, text, smallint[], smallint, boolean, boolean
) from public, anon, authenticated, service_role;

create or replace function public.publish_vanguard_quiz_override(
  p_override_id uuid,
  p_module_id text,
  p_section_id text,
  p_position text,
  p_sort_order integer,
  p_quiz_id text,
  p_questions jsonb,
  p_correct_option_indexes smallint[],
  p_passing_percent smallint
)
returns setof public.content_overrides
language plpgsql
security definer
set search_path = ''
as $function$
declare
  account_id uuid := (select auth.uid());
  target_id uuid := coalesce(p_override_id, extensions.gen_random_uuid());
  module_number smallint;
  clean_quiz_id text := lower(left(btrim(coalesce(p_quiz_id, '')), 120));
  clean_section_id text := nullif(left(btrim(coalesce(p_section_id, '')), 160), '');
  question_count integer;
  question_index integer;
  option_count integer;
  option_index integer;
  selected_index smallint;
  array_start integer;
  question_json jsonb;
  options_json jsonb;
  question_text text;
  option_text text;
  explanation_text text;
  clean_questions jsonb := '[]'::jsonb;
  clean_options jsonb;
  clean_payload jsonb;
  existing_row public.content_overrides%rowtype;
  shipped private.vanguard_shipped_quiz_requirements%rowtype;
  requirement_section text;
  result public.content_overrides%rowtype;
begin
  if account_id is null or not public.is_zen_admin() then
    raise exception using errcode = '42501', message = 'admin_required';
  end if;

  if p_module_id !~ '^module[1-4]$' then
    raise exception using errcode = '22023', message = 'invalid_module_id';
  end if;
  module_number := right(p_module_id, 1)::smallint;

  if clean_quiz_id !~ '^quiz-[1-4](-[a-z0-9]+)+$'
    or left(clean_quiz_id, 6) <> ('quiz-' || module_number::text) then
    raise exception using errcode = '22023', message = 'invalid_quiz_id';
  end if;
  if p_position not in ('before', 'after', 'replace', 'append_module')
    or p_sort_order < 0
    or p_passing_percent not between 1 and 100 then
    raise exception using errcode = '22023', message = 'invalid_quiz_placement';
  end if;
  if p_position = 'append_module' and clean_section_id is not null then
    raise exception using errcode = '22023', message = 'module_quiz_section_must_be_empty';
  end if;
  if p_position <> 'append_module' and clean_section_id is null then
    raise exception using errcode = '22023', message = 'quiz_section_required';
  end if;

  if p_override_id is not null then
    select override_row.* into existing_row
    from public.content_overrides override_row
    where override_row.id = p_override_id
    for update;

    if not found or existing_row.program_id <> 'vanguard' then
      raise exception using errcode = 'P0002', message = 'quiz_override_not_found';
    end if;
    if existing_row.block_type = 'quiz'
      and coalesce(existing_row.payload ->> 'quiz_id', '') <> clean_quiz_id then
      raise exception using errcode = '22023', message = 'quiz_id_is_immutable';
    end if;
  end if;

  select baseline.* into shipped
  from private.vanguard_shipped_quiz_requirements baseline
  where baseline.quiz_id = clean_quiz_id;

  if found then
    if shipped.module_number <> module_number
      or shipped.section_id <> clean_section_id
      or p_position not in ('before', 'after') then
      raise exception using errcode = '22023', message = 'shipped_quiz_location_is_fixed';
    end if;
    requirement_section := shipped.section_id;
  else
    if p_position = 'replace' then
      raise exception using errcode = '22023', message = 'custom_quiz_replace_not_supported';
    end if;
    requirement_section := coalesce(clean_section_id, '__module__');
    if not exists (
      select 1
      from private.vanguard_curriculum_sections section
      where section.module_number = module_number
        and section.section_id = requirement_section
    ) then
      raise exception using errcode = '22023', message = 'quiz_section_not_in_current_curriculum';
    end if;
  end if;

  if jsonb_typeof(p_questions) <> 'array' then
    raise exception using errcode = '22023', message = 'quiz_questions_must_be_an_array';
  end if;
  question_count := jsonb_array_length(p_questions);
  if question_count not between 1 and 20
    or p_correct_option_indexes is null
    or cardinality(p_correct_option_indexes) <> question_count then
    raise exception using errcode = '22023', message = 'invalid_quiz_question_count';
  end if;
  array_start := array_lower(p_correct_option_indexes, 1);

  for question_index in 0..question_count - 1 loop
    question_json := p_questions -> question_index;
    if jsonb_typeof(question_json) <> 'object'
      or question_json ?| array[
        'answer', 'answer_index', 'correct', 'correct_index',
        'correct_option_index', 'correct_option_indexes'
      ] then
      raise exception using errcode = '22023', message = 'invalid_public_quiz_question';
    end if;

    question_text := left(btrim(coalesce(question_json ->> 'question', '')), 500);
    options_json := question_json -> 'options';
    if question_text = '' or jsonb_typeof(options_json) <> 'array' then
      raise exception using errcode = '22023', message = 'quiz_question_text_required';
    end if;
    option_count := jsonb_array_length(options_json);
    if option_count not between 2 and 8 then
      raise exception using errcode = '22023', message = 'invalid_quiz_option_count';
    end if;

    clean_options := '[]'::jsonb;
    for option_index in 0..option_count - 1 loop
      if jsonb_typeof(options_json -> option_index) <> 'string' then
        raise exception using errcode = '22023', message = 'quiz_options_must_be_text';
      end if;
      option_text := left(btrim(options_json ->> option_index), 300);
      if option_text = '' then
        raise exception using errcode = '22023', message = 'quiz_option_text_required';
      end if;
      clean_options := clean_options || jsonb_build_array(option_text);
    end loop;

    selected_index := p_correct_option_indexes[array_start + question_index];
    if selected_index is null or selected_index < 0 or selected_index >= option_count then
      raise exception using errcode = '22023', message = 'invalid_correct_option_index';
    end if;

    explanation_text := nullif(left(btrim(coalesce(question_json ->> 'explanation', '')), 1200), '');
    clean_questions := clean_questions || jsonb_build_array(
      jsonb_strip_nulls(jsonb_build_object(
        'question', question_text,
        'options', clean_options,
        'explanation', explanation_text
      ))
    );
  end loop;

  clean_payload := jsonb_build_object(
    'quiz_id', clean_quiz_id,
    'questions', clean_questions,
    'passing_percent', p_passing_percent
  );

  insert into public.content_overrides as override_row (
    id, program_id, module_id, section_id, position, block_type,
    payload, sort_order, is_published, created_by
  ) values (
    target_id, 'vanguard', p_module_id, clean_section_id, p_position, 'quiz',
    clean_payload, p_sort_order, true, account_id::text
  )
  on conflict (id) do update
  set program_id = excluded.program_id,
      module_id = excluded.module_id,
      section_id = excluded.section_id,
      position = excluded.position,
      block_type = excluded.block_type,
      payload = excluded.payload,
      sort_order = excluded.sort_order,
      is_published = true
  returning * into result;

  insert into private.vanguard_quiz_requirements as requirement (
    quiz_id, module_number, section_id, answer_key, passing_percent,
    required_for_certificate, is_active
  ) values (
    clean_quiz_id, module_number, requirement_section,
    p_correct_option_indexes, p_passing_percent, true, true
  )
  on conflict (quiz_id) do update
  set module_number = excluded.module_number,
      section_id = excluded.section_id,
      answer_key = excluded.answer_key,
      passing_percent = excluded.passing_percent,
      required_for_certificate = true,
      is_active = true,
      definition_version = requirement.definition_version + 1,
      updated_at = now();

  perform private.recompute_vanguard_quiz_requirement_activity(module_number);

  return next result;
  return;
end
$function$;

revoke all on function public.publish_vanguard_quiz_override(
  uuid, text, text, text, integer, text, jsonb, smallint[], smallint
) from public, anon, authenticated, service_role;
grant execute on function public.publish_vanguard_quiz_override(
  uuid, text, text, text, integer, text, jsonb, smallint[], smallint
) to authenticated;

create or replace function public.remove_vanguard_quiz_override(
  p_override_id uuid
)
returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
  account_id uuid := (select auth.uid());
  target public.content_overrides%rowtype;
  shipped private.vanguard_shipped_quiz_requirements%rowtype;
  clean_quiz_id text;
begin
  if account_id is null or not public.is_zen_admin() then
    raise exception using errcode = '42501', message = 'admin_required';
  end if;

  select override_row.* into target
  from public.content_overrides override_row
  where override_row.id = p_override_id
  for update;

  if not found
    or target.program_id <> 'vanguard'
    or target.block_type <> 'quiz' then
    raise exception using errcode = 'P0002', message = 'quiz_override_not_found';
  end if;

  clean_quiz_id := target.payload ->> 'quiz_id';
  select baseline.* into shipped
  from private.vanguard_shipped_quiz_requirements baseline
  where baseline.quiz_id = clean_quiz_id;

  if found then
    insert into private.vanguard_quiz_requirements as requirement (
      quiz_id, module_number, section_id, answer_key, passing_percent,
      required_for_certificate, is_active
    ) values (
      shipped.quiz_id, shipped.module_number, shipped.section_id,
      shipped.answer_key, shipped.passing_percent,
      shipped.required_for_certificate, true
    )
    on conflict (quiz_id) do update
    set module_number = excluded.module_number,
        section_id = excluded.section_id,
        answer_key = excluded.answer_key,
        passing_percent = excluded.passing_percent,
        required_for_certificate = excluded.required_for_certificate,
        is_active = true,
        definition_version = requirement.definition_version + 1,
        updated_at = now();

    -- Keep a learner-safe revision marker. Empty questions intentionally make
    -- SectionQuiz fall back to shipped public copy while updated_at provides a
    -- new completion key matching the new private definition version.
    update public.content_overrides
    set payload = jsonb_build_object(
          'quiz_id', clean_quiz_id,
          'questions', '[]'::jsonb,
          'passing_percent', shipped.passing_percent
        ),
        is_published = true,
        updated_at = now()
    where id = p_override_id;

    perform private.recompute_vanguard_quiz_requirement_activity(shipped.module_number);

    return 'restored';
  end if;

  update private.vanguard_quiz_requirements requirement
  set is_active = false,
      required_for_certificate = false,
      definition_version = requirement.definition_version + 1,
      updated_at = now()
  where requirement.quiz_id = clean_quiz_id;

  delete from public.content_overrides where id = p_override_id;
  perform private.recompute_vanguard_quiz_requirement_activity(
    right(target.module_id, 1)::smallint
  );
  return 'removed';
end
$function$;

revoke all on function public.remove_vanguard_quiz_override(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.remove_vanguard_quiz_override(uuid)
  to authenticated;

notify pgrst, 'reload schema';

commit;
