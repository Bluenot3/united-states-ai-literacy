create table if not exists public.program_publish_settings (
    program_id text primary key,
    availability_status text not null default 'coming-soon',
    published boolean not null default false,
    admin_preview_enabled boolean not null default true,
    public_label text,
    admin_label text,
    arsenal_ready_status text not null default 'staging',
    arsenal_merge_notes text,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    metadata jsonb not null default '{}'::jsonb,
    constraint program_publish_settings_availability_status_check
        check (availability_status in ('available', 'unavailable', 'coming-soon', 'draft', 'private-beta')),
    constraint program_publish_settings_arsenal_ready_status_check
        check (arsenal_ready_status in ('not-started', 'staging', 'merge-ready', 'merged'))
);

create index if not exists program_publish_settings_published_idx
    on public.program_publish_settings (published);

create index if not exists program_publish_settings_availability_status_idx
    on public.program_publish_settings (availability_status);

drop trigger if exists set_program_publish_settings_updated_at on public.program_publish_settings;
create trigger set_program_publish_settings_updated_at
    before update on public.program_publish_settings
    for each row
    execute function public.set_updated_at();

insert into public.program_publish_settings (
    program_id,
    availability_status,
    published,
    admin_preview_enabled,
    public_label,
    admin_label,
    arsenal_ready_status,
    arsenal_merge_notes,
    metadata
)
values
    (
        'ai-pioneer',
        'available',
        true,
        true,
        'Available',
        'Published',
        'staging',
        'Build-first Hugging Face launch curriculum is staged in ZEN before Arsenal ingestion.' || chr(10) ||
        'Keep route and dashboard behavior stable until Arsenal merge planning starts.',
        '{"seeded_from":"registry","publish_controls_enabled":true}'::jsonb
    ),
    (
        'vanguard',
        'private-beta',
        true,
        true,
        'Private Beta',
        'Published Private Beta',
        'merge-ready',
        'Vanguard is stabilized through the bridge manifest and should remain a staged ZEN program until Arsenal ingestion is explicitly started.' || chr(10) ||
        'Wrapper sections, completion modes, trackable totals, and CREDS dry-run boundaries are manifest-backed.',
        '{"seeded_from":"registry","publish_controls_enabled":true}'::jsonb
    ),
    (
        'homeschool-kit',
        'coming-soon',
        false,
        true,
        'Coming Soon',
        'Unpublished',
        'staging',
        'Needs final content packaging, entitlement wiring, and publish persistence before public launch.',
        '{"seeded_from":"registry","publish_controls_enabled":true}'::jsonb
    ),
    (
        'blockchain-literacy',
        'coming-soon',
        false,
        true,
        'Coming Soon',
        'Unpublished',
        'staging',
        'Keep wallet and credential flows simulation-first until live wallet infrastructure exists.',
        '{"seeded_from":"registry","publish_controls_enabled":true}'::jsonb
    ),
    (
        'train-the-trainer',
        'coming-soon',
        false,
        true,
        'Coming Soon',
        'Unpublished',
        'staging',
        'Facilitator resources need admin publish controls and cohort delivery metadata before release.',
        '{"seeded_from":"registry","publish_controls_enabled":true}'::jsonb
    ),
    (
        'arsenal-builder-labs',
        'coming-soon',
        false,
        true,
        'Coming Soon',
        'Unpublished',
        'staging',
        'Remain staged in ZEN until the actual Arsenal merge path is approved.',
        '{"seeded_from":"registry","publish_controls_enabled":true}'::jsonb
    ),
    (
        'hermes',
        'available',
        true,
        true,
        'Available',
        'Published',
        'staging',
        'Preserves current free/open-source positioning while centralizing availability metadata.',
        '{"seeded_from":"registry","publish_controls_enabled":true}'::jsonb
    )
on conflict (program_id) do nothing;

alter table public.program_publish_settings enable row level security;

drop policy if exists "public read program publish settings" on public.program_publish_settings;
create policy "public read program publish settings"
    on public.program_publish_settings
    for select
    to anon, authenticated
    using (true);

drop policy if exists "admins read program publish settings" on public.program_publish_settings;
create policy "admins read program publish settings"
    on public.program_publish_settings
    for select
    to authenticated
    using (public.is_zen_vanguard_admin());

