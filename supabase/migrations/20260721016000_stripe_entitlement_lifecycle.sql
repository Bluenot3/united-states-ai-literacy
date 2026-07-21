begin;

-- Stripe remains a payment source; program_entitlements remains the one and
-- only program-access gate. These fields make Stripe mutations order-aware
-- without storing webhook payloads or introducing a parallel entitlement row.
alter table public.program_entitlements
  add column if not exists stripe_state text not null default 'unmanaged',
  add column if not exists stripe_last_event_id text,
  add column if not exists stripe_last_event_type text,
  add column if not exists stripe_last_event_created_at timestamptz,
  add column if not exists stripe_last_event_priority smallint,
  add column if not exists stripe_fully_refunded_at timestamptz,
  add column if not exists stripe_revocation_reason text;

do $constraints$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'program_entitlements_stripe_state_check'
      and conrelid = 'public.program_entitlements'::regclass
  ) then
    alter table public.program_entitlements
      add constraint program_entitlements_stripe_state_check
      check (stripe_state in ('unmanaged', 'active', 'disputed', 'refunded', 'manual'));
  end if;
end
$constraints$;

-- Fail rather than silently collapse ambiguous historical payment ownership.
-- The current launch database has no entitlement rows, so these checks are
-- expected to pass; a future failure requires a deliberate data audit.
do $stripe_identity_preflight$
begin
  if exists (
    select stripe_checkout_session_id
    from public.program_entitlements
    where stripe_checkout_session_id is not null
    group by stripe_checkout_session_id
    having count(*) > 1
  ) then
    raise exception 'duplicate_stripe_checkout_session_ids_require_review';
  end if;

  if exists (
    select stripe_payment_intent_id
    from public.program_entitlements
    where stripe_payment_intent_id is not null
    group by stripe_payment_intent_id
    having count(*) > 1
  ) then
    raise exception 'duplicate_stripe_payment_intent_ids_require_review';
  end if;
end
$stripe_identity_preflight$;

create unique index if not exists program_entitlements_checkout_session_uidx
  on public.program_entitlements (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

create unique index if not exists program_entitlements_payment_intent_uidx
  on public.program_entitlements (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  stripe_created_at timestamptz not null,
  stripe_object_id text not null,
  payment_intent_id text,
  checkout_session_id text,
  stripe_customer_id text,
  stripe_price_id text,
  user_id uuid references auth.users(id) on delete set null,
  program_key text,
  requested_action text not null,
  event_priority smallint not null,
  restore_eligible boolean not null default true,
  applied boolean not null default false,
  ignored_reason text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  constraint stripe_webhook_events_event_id_check
    check (length(event_id) between 5 and 255),
  constraint stripe_webhook_events_program_key_check
    check (program_key is null or program_key in ('pioneer', 'vanguard')),
  constraint stripe_webhook_events_action_check
    check (requested_action in ('grant', 'revoke', 'restore'))
);

alter table public.stripe_webhook_events
  add column if not exists event_priority smallint not null default 0,
  add column if not exists restore_eligible boolean not null default true,
  add column if not exists checkout_session_id text,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_price_id text;

create index if not exists stripe_webhook_events_payment_intent_idx
  on public.stripe_webhook_events (payment_intent_id, stripe_created_at desc)
  where payment_intent_id is not null;

create index if not exists stripe_webhook_events_user_program_idx
  on public.stripe_webhook_events (user_id, program_key, stripe_created_at desc)
  where user_id is not null and program_key is not null;

alter table public.stripe_webhook_events enable row level security;
revoke all on public.stripe_webhook_events from public, anon, authenticated;
grant all on public.stripe_webhook_events to service_role;

create or replace function public.apply_stripe_program_entitlement_event(
  _event_id text,
  _event_type text,
  _event_created_at timestamptz,
  _stripe_object_id text,
  _action text,
  _user_id uuid,
  _program_key text,
  _payment_intent_id text,
  _checkout_session_id text default null,
  _stripe_customer_id text default null,
  _stripe_price_id text default null,
  _amount_total integer default null,
  _currency text default null,
  _note text default null,
  _restore_eligible boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  current_entitlement public.program_entitlements%rowtype;
  inserted_event_id text;
  account_email text;
  registration_program_key text;
  event_priority smallint;
  outcome text;
  inserted_entitlement_count integer := 0;
  prior_payment_action text;
  prior_restore_eligible boolean;
  prior_full_refund boolean := false;
  entitlement_row_found boolean := false;
  incoming_payment_grant_at timestamptz;
  incoming_checkout_session_id text;
  incoming_stripe_customer_id text;
  incoming_stripe_price_id text;
  restore_replaces_purchase boolean := false;
begin
  if _event_id is null or length(_event_id) < 5
    or _event_type is null
    or _event_created_at is null
    or _stripe_object_id is null
    or _payment_intent_id is null
    or _user_id is null
    or _program_key not in ('pioneer', 'vanguard')
    or _action not in ('grant', 'revoke', 'restore')
    or (_action = 'grant' and (_checkout_session_id is null or _stripe_price_id is null)) then
    raise exception using errcode = '22023', message = 'invalid_stripe_entitlement_event';
  end if;

  event_priority := case
    when _event_type = 'charge.refunded' then 50
    when _action = 'revoke' and _event_type = 'charge.dispute.closed' then 40
    when _action = 'restore' then 30
    when _event_type = 'charge.dispute.created' then 20
    else 10
  end;

  -- Serialize all payment state transitions for one learner/program. The event
  -- primary key separately handles the same Stripe event delivered repeatedly.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(_user_id::text || ':' || _program_key, 0)
  );

  insert into public.stripe_webhook_events (
    event_id,
    event_type,
    stripe_created_at,
    stripe_object_id,
    payment_intent_id,
    checkout_session_id,
    stripe_customer_id,
    stripe_price_id,
    user_id,
    program_key,
    requested_action,
    event_priority,
    restore_eligible
  ) values (
    _event_id,
    _event_type,
    _event_created_at,
    _stripe_object_id,
    _payment_intent_id,
    _checkout_session_id,
    _stripe_customer_id,
    _stripe_price_id,
    _user_id,
    _program_key,
    _action,
    event_priority,
    _restore_eligible
  )
  on conflict (event_id) do nothing
  returning event_id into inserted_event_id;

  if inserted_event_id is null then
    return jsonb_build_object('applied', false, 'outcome', 'duplicate_event');
  end if;

  -- A refund or dispute can precede checkout fulfillment. Create only the
  -- canonical entitlement row in a non-access state so that its newer negative
  -- event blocks a delayed checkout event for the same PaymentIntent.
  insert into public.program_entitlements (
    user_id,
    program_key,
    status,
    source,
    stripe_payment_intent_id,
    access_starts_at,
    stripe_state
  ) values (
    _user_id,
    _program_key,
    'pending',
    'stripe',
    _payment_intent_id,
    _event_created_at,
    'unmanaged'
  )
  on conflict (user_id, program_key) do nothing;
  get diagnostics inserted_entitlement_count = row_count;

  select *
  into current_entitlement
  from public.program_entitlements
  where user_id = _user_id
    and program_key = _program_key
  for update;
  entitlement_row_found := found;

  if _action = 'restore'
    and current_entitlement.stripe_payment_intent_id is distinct from _payment_intent_id then
    -- A dispute can resolve after a newer purchase's checkout was recorded but
    -- while an older purchase still owns the canonical row. Only that newer
    -- verified grant may replace the row; a late restore for an older purchase
    -- can never roll the entitlement backward.
    select
      ledger.stripe_created_at,
      coalesce(ledger.checkout_session_id, ledger.stripe_object_id),
      ledger.stripe_customer_id,
      ledger.stripe_price_id
    into
      incoming_payment_grant_at,
      incoming_checkout_session_id,
      incoming_stripe_customer_id,
      incoming_stripe_price_id
    from public.stripe_webhook_events as ledger
    where ledger.payment_intent_id = _payment_intent_id
      and ledger.user_id = _user_id
      and ledger.program_key = _program_key
      and ledger.requested_action = 'grant'
    order by ledger.stripe_created_at desc, ledger.event_id desc
    limit 1;

    restore_replaces_purchase := _restore_eligible
      and incoming_payment_grant_at is not null
      and (
        current_entitlement.access_starts_at is null
        or incoming_payment_grant_at > current_entitlement.access_starts_at
      );
  end if;

  if _action = 'grant' then
    -- A program row is reused across purchases, so global row timestamps must
    -- never let an older PaymentIntent suppress a legitimate repurchase. Read
    -- only this PaymentIntent's prior ledger state before granting it.
    select exists (
      select 1
      from public.stripe_webhook_events as ledger
      where ledger.payment_intent_id = _payment_intent_id
        and ledger.user_id = _user_id
        and ledger.program_key = _program_key
        and ledger.event_id <> _event_id
        and ledger.event_type = 'charge.refunded'
    ) into prior_full_refund;

    select ledger.requested_action, ledger.restore_eligible
    into prior_payment_action, prior_restore_eligible
    from public.stripe_webhook_events as ledger
    where ledger.payment_intent_id = _payment_intent_id
      and ledger.user_id = _user_id
      and ledger.program_key = _program_key
      and ledger.event_id <> _event_id
      and ledger.requested_action in ('revoke', 'restore')
    order by
      ledger.stripe_created_at desc,
      ledger.event_priority desc,
      ledger.event_id desc
    limit 1;
  end if;

  if not entitlement_row_found then
    -- The unconditional insert above and per-user/program advisory lock make
    -- this an invariant. Fail atomically so Stripe retries instead of recording
    -- a negative event without durable revocation state.
    raise exception using
      errcode = 'P0001',
      message = 'stripe_entitlement_row_missing_after_insert';
  elsif current_entitlement.source <> 'stripe' then
    outcome := 'manual_override';
  elsif _action = 'revoke'
    and current_entitlement.stripe_payment_intent_id is distinct from _payment_intent_id then
    outcome := 'payment_intent_mismatch';
  elsif _action = 'restore'
    and current_entitlement.stripe_payment_intent_id is distinct from _payment_intent_id
    and not restore_replaces_purchase then
    outcome := 'payment_intent_mismatch';
  elsif _action = 'grant'
    and current_entitlement.stripe_checkout_session_id = _checkout_session_id
    and current_entitlement.stripe_payment_intent_id = _payment_intent_id
    and current_entitlement.status = 'active' then
    outcome := 'already_granted';
  elsif _action = 'grant' and prior_full_refund then
    outcome := 'full_refund_terminal';
  elsif _action = 'grant' and prior_payment_action = 'revoke' then
    outcome := 'payment_intent_access_blocked';
  elsif _action = 'grant'
    and prior_payment_action = 'restore'
    and not coalesce(prior_restore_eligible, false) then
    outcome := 'payment_intent_restore_blocked';
  elsif _action = 'grant'
    and current_entitlement.stripe_payment_intent_id = _payment_intent_id
    and current_entitlement.stripe_fully_refunded_at is not null then
    outcome := 'full_refund_terminal';
  elsif _action = 'restore' and not _restore_eligible then
    outcome := 'restore_reconciliation_blocked';
  elsif _action = 'restore'
    and (
      (
        current_entitlement.stripe_payment_intent_id = _payment_intent_id
        and current_entitlement.stripe_fully_refunded_at is not null
      )
      or (
        current_entitlement.stripe_state <> 'disputed'
        and inserted_entitlement_count = 0
        and not restore_replaces_purchase
      )
    ) then
    outcome := 'restore_state_blocked';
  elsif current_entitlement.stripe_payment_intent_id = _payment_intent_id
    and (
      current_entitlement.stripe_last_event_created_at > _event_created_at
      or (
        current_entitlement.stripe_last_event_created_at = _event_created_at
        and coalesce(current_entitlement.stripe_last_event_priority, 0) >= event_priority
      )
    ) then
    outcome := 'stale_event';
  else
    if _action = 'grant' then
      update public.program_entitlements
      set
        status = 'active',
        source = 'stripe',
        stripe_customer_id = _stripe_customer_id,
        stripe_checkout_session_id = _checkout_session_id,
        stripe_subscription_id = null,
        stripe_payment_intent_id = _payment_intent_id,
        stripe_price_id = _stripe_price_id,
        amount_total = _amount_total,
        currency = lower(_currency),
        access_starts_at = _event_created_at,
        access_ends_at = null,
        note = coalesce(_note, note),
        stripe_state = 'active',
        stripe_fully_refunded_at = null,
        stripe_revocation_reason = null,
        stripe_last_event_id = _event_id,
        stripe_last_event_type = _event_type,
        stripe_last_event_created_at = _event_created_at,
        stripe_last_event_priority = event_priority,
        updated_at = now()
      where user_id = _user_id and program_key = _program_key;
    elsif _action = 'restore' then
      update public.program_entitlements
      set
        status = 'active',
        source = 'stripe',
        stripe_customer_id = case
          when restore_replaces_purchase then incoming_stripe_customer_id
          else coalesce(_stripe_customer_id, stripe_customer_id)
        end,
        stripe_checkout_session_id = case
          when restore_replaces_purchase then incoming_checkout_session_id
          else stripe_checkout_session_id
        end,
        stripe_subscription_id = null,
        stripe_payment_intent_id = case
          when restore_replaces_purchase then _payment_intent_id
          else stripe_payment_intent_id
        end,
        stripe_price_id = case
          when restore_replaces_purchase then incoming_stripe_price_id
          else stripe_price_id
        end,
        access_starts_at = case
          when restore_replaces_purchase then incoming_payment_grant_at
          else access_starts_at
        end,
        access_ends_at = null,
        note = coalesce(_note, note),
        stripe_state = 'active',
        stripe_fully_refunded_at = null,
        stripe_revocation_reason = null,
        stripe_last_event_id = _event_id,
        stripe_last_event_type = _event_type,
        stripe_last_event_created_at = _event_created_at,
        stripe_last_event_priority = event_priority,
        updated_at = now()
      where user_id = _user_id and program_key = _program_key;
    else
      update public.program_entitlements
      set
        status = 'revoked',
        access_ends_at = _event_created_at,
        note = coalesce(_note, note),
        stripe_state = case when _event_type = 'charge.refunded' then 'refunded' else 'disputed' end,
        stripe_fully_refunded_at = case
          when _event_type = 'charge.refunded' then _event_created_at
          else stripe_fully_refunded_at
        end,
        stripe_revocation_reason = case
          when _event_type = 'charge.refunded' then 'full_refund'
          when _event_type = 'charge.dispute.closed' then 'dispute_lost'
          else 'dispute_opened'
        end,
        stripe_last_event_id = _event_id,
        stripe_last_event_type = _event_type,
        stripe_last_event_created_at = _event_created_at,
        stripe_last_event_priority = event_priority,
        updated_at = now()
      where user_id = _user_id and program_key = _program_key;
    end if;

    select lower(email)
    into account_email
    from auth.users
    where id = _user_id;

    if account_email is null then
      raise exception using errcode = '23503', message = 'stripe_user_not_found';
    end if;

    registration_program_key := case
      when _program_key = 'pioneer' then 'ai-pioneer'
      else 'vanguard'
    end;

    insert into public.program_registrations as registration (
      user_id,
      program_key,
      status,
      email,
      source,
      enrolled_at,
      cancelled_at,
      updated_at
    ) values (
      _user_id,
      registration_program_key,
      case when _action = 'revoke' then 'cancelled' else 'enrolled' end,
      account_email,
      'stripe',
      case when _action = 'revoke' then null else _event_created_at end,
      case when _action = 'revoke' then _event_created_at else null end,
      now()
    )
    on conflict (user_id, program_key) do update
    set
      status = excluded.status,
      email = coalesce(excluded.email, registration.email),
      source = 'stripe',
      enrolled_at = case
        when excluded.status = 'enrolled' then coalesce(registration.enrolled_at, excluded.enrolled_at)
        else registration.enrolled_at
      end,
      cancelled_at = excluded.cancelled_at,
      updated_at = now();

    if _program_key = 'vanguard' then
      update public.user_profiles
      set
        is_entitled = (_action <> 'revoke'),
        stripe_customer_id = coalesce(_stripe_customer_id, stripe_customer_id),
        updated_at = now()
      where id = _user_id;
    end if;

    outcome := 'applied';
  end if;

  update public.stripe_webhook_events
  set
    applied = (outcome = 'applied'),
    ignored_reason = case when outcome = 'applied' then null else outcome end,
    processed_at = now()
  where event_id = _event_id;

  return jsonb_build_object(
    'applied', outcome = 'applied',
    'outcome', outcome,
    'userId', _user_id,
    'programKey', _program_key
  );
end
$function$;

revoke all on function public.apply_stripe_program_entitlement_event(
  text,
  text,
  timestamptz,
  text,
  text,
  uuid,
  text,
  text,
  text,
  text,
  text,
  integer,
  text,
  text,
  boolean
) from public, anon, authenticated, service_role;
grant execute on function public.apply_stripe_program_entitlement_event(
  text,
  text,
  timestamptz,
  text,
  text,
  uuid,
  text,
  text,
  text,
  text,
  text,
  integer,
  text,
  text,
  boolean
) to service_role;

-- Canonical admin actions become explicit manual overrides. Stripe events are
-- still ledgered afterward, but the service-role RPC refuses to overwrite them.
create or replace function public.grant_program_access(
  _user_id uuid,
  _program_key text,
  _source text default 'admin',
  _access_ends_at timestamptz default null,
  _note text default null
)
returns public.program_entitlements
language plpgsql
security definer
set search_path = ''
as $function$
declare
  result public.program_entitlements;
  manual_source text;
begin
  if not public.is_zen_admin() then
    raise exception using errcode = '42501', message = 'not_authorized';
  end if;
  if _program_key not in ('pioneer', 'vanguard') then
    raise exception using errcode = '22023', message = 'invalid_program_key';
  end if;

  manual_source := coalesce(nullif(lower(trim(_source)), ''), 'admin');
  if manual_source = 'stripe' then manual_source := 'admin'; end if;

  insert into public.program_entitlements as entitlement (
    user_id, program_key, status, source, access_starts_at, access_ends_at, note, stripe_state
  ) values (
    _user_id, _program_key, 'active', manual_source, now(), _access_ends_at, _note, 'manual'
  )
  on conflict (user_id, program_key) do update
  set
    status = 'active',
    source = excluded.source,
    access_starts_at = now(),
    access_ends_at = excluded.access_ends_at,
    note = coalesce(excluded.note, entitlement.note),
    stripe_state = 'manual',
    stripe_revocation_reason = null,
    updated_at = now()
  returning * into result;

  return result;
end
$function$;

revoke all on function public.grant_program_access(uuid, text, text, timestamptz, text)
  from public, anon, authenticated, service_role;
grant execute on function public.grant_program_access(uuid, text, text, timestamptz, text)
  to authenticated;

create or replace function public.revoke_program_access(
  _user_id uuid,
  _program_key text,
  _note text default null
)
returns public.program_entitlements
language plpgsql
security definer
set search_path = ''
as $function$
declare
  result public.program_entitlements;
begin
  if not public.is_zen_admin() then
    raise exception using errcode = '42501', message = 'not_authorized';
  end if;

  update public.program_entitlements
  set
    status = 'revoked',
    source = 'admin',
    access_ends_at = now(),
    note = coalesce(_note, note),
    stripe_state = 'manual',
    stripe_revocation_reason = 'manual',
    updated_at = now()
  where user_id = _user_id and program_key = _program_key
  returning * into result;

  return result;
end
$function$;

revoke all on function public.revoke_program_access(uuid, text, text)
  from public, anon, authenticated, service_role;
grant execute on function public.revoke_program_access(uuid, text, text)
  to authenticated;

commit;
