
-- =========================================================================
-- 1. Admin allowlist
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.admin_allowlist (
    email text PRIMARY KEY,
    created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_allowlist TO authenticated;
GRANT ALL ON public.admin_allowlist TO service_role;

ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated can read allowlist" ON public.admin_allowlist;
CREATE POLICY "authenticated can read allowlist"
    ON public.admin_allowlist FOR SELECT
    TO authenticated
    USING (true);

INSERT INTO public.admin_allowlist(email) VALUES
    ('royaltokens@gmail.com'),
    ('admin@zenvanguard.com'),
    ('alexleschik@bgcgw.org'),
    ('testadmin@zenai.co'),
    ('alex1leschik@gmail.com'),
    ('huxley@zenai.biz')
ON CONFLICT (email) DO NOTHING;

-- =========================================================================
-- 2. Admin helpers
-- =========================================================================
CREATE OR REPLACE FUNCTION public.is_zen_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_allowlist
        WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;

GRANT EXECUTE ON FUNCTION public.is_zen_admin() TO authenticated, anon;

CREATE OR REPLACE FUNCTION public.is_content_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.is_zen_admin();
$$;

GRANT EXECUTE ON FUNCTION public.is_content_admin() TO authenticated, anon;

-- =========================================================================
-- 3. program_entitlements
-- =========================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.program_entitlements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    program_key text NOT NULL,
    status text NOT NULL DEFAULT 'active',
    source text NOT NULL DEFAULT 'stripe',
    stripe_customer_id text,
    stripe_checkout_session_id text,
    stripe_subscription_id text,
    stripe_payment_intent_id text,
    stripe_price_id text,
    amount_total integer,
    currency text,
    access_starts_at timestamptz DEFAULT now(),
    access_ends_at timestamptz,
    note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, program_key),
    CONSTRAINT program_entitlements_program_key_check
        CHECK (program_key IN ('pioneer', 'vanguard')),
    CONSTRAINT program_entitlements_status_check
        CHECK (status IN ('active','trialing','pending','past_due','canceled','revoked','expired'))
);

CREATE INDEX IF NOT EXISTS program_entitlements_user_idx
    ON public.program_entitlements(user_id);
CREATE INDEX IF NOT EXISTS program_entitlements_program_idx
    ON public.program_entitlements(program_key, status);

GRANT SELECT ON public.program_entitlements TO authenticated;
GRANT ALL ON public.program_entitlements TO service_role;

ALTER TABLE public.program_entitlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "entitlements_self_read" ON public.program_entitlements;
CREATE POLICY "entitlements_self_read"
    ON public.program_entitlements FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_zen_admin());

DROP POLICY IF EXISTS "entitlements_admin_all" ON public.program_entitlements;
CREATE POLICY "entitlements_admin_all"
    ON public.program_entitlements FOR ALL
    TO authenticated
    USING (public.is_zen_admin())
    WITH CHECK (public.is_zen_admin());

-- =========================================================================
-- 4. program_profiles
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.program_profiles (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name text,
    username text,
    bio text,
    country text,
    organization text,
    track text,
    experience_level text,
    goal text,
    mission_badge text,
    program text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.program_profiles TO authenticated;
GRANT ALL ON public.program_profiles TO service_role;

ALTER TABLE public.program_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_self_rw" ON public.program_profiles;
CREATE POLICY "profiles_self_rw"
    ON public.program_profiles FOR ALL
    TO authenticated
    USING (user_id = auth.uid() OR public.is_zen_admin())
    WITH CHECK (user_id = auth.uid() OR public.is_zen_admin());

-- =========================================================================
-- 5. has_program_access + admin grant/revoke RPCs
-- =========================================================================
CREATE OR REPLACE FUNCTION public.has_program_access(_user_id uuid, _program_key text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
    SELECT
        EXISTS (
            SELECT 1 FROM public.admin_allowlist a
            JOIN auth.users u ON lower(u.email) = lower(a.email)
            WHERE u.id = _user_id
        )
        OR EXISTS (
            SELECT 1
            FROM public.program_entitlements e
            WHERE e.user_id = _user_id
              AND e.program_key = _program_key
              AND e.status IN ('active','trialing')
              AND (e.access_starts_at IS NULL OR e.access_starts_at <= now())
              AND (e.access_ends_at IS NULL OR e.access_ends_at > now())
        );
$$;

GRANT EXECUTE ON FUNCTION public.has_program_access(uuid, text) TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION public.grant_program_access(
    _user_id uuid,
    _program_key text,
    _source text DEFAULT 'admin',
    _access_ends_at timestamptz DEFAULT NULL,
    _note text DEFAULT NULL
)
RETURNS public.program_entitlements
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result public.program_entitlements;
BEGIN
    IF NOT public.is_zen_admin() THEN
        RAISE EXCEPTION 'not_authorized';
    END IF;

    INSERT INTO public.program_entitlements AS e
        (user_id, program_key, status, source, access_starts_at, access_ends_at, note)
    VALUES
        (_user_id, _program_key, 'active', coalesce(_source, 'admin'), now(), _access_ends_at, _note)
    ON CONFLICT (user_id, program_key) DO UPDATE SET
        status = 'active',
        source = coalesce(excluded.source, e.source),
        access_starts_at = coalesce(e.access_starts_at, now()),
        access_ends_at = excluded.access_ends_at,
        note = coalesce(excluded.note, e.note),
        updated_at = now()
    RETURNING * INTO result;

    RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.grant_program_access(uuid, text, text, timestamptz, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.revoke_program_access(
    _user_id uuid,
    _program_key text,
    _note text DEFAULT NULL
)
RETURNS public.program_entitlements
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result public.program_entitlements;
BEGIN
    IF NOT public.is_zen_admin() THEN
        RAISE EXCEPTION 'not_authorized';
    END IF;

    UPDATE public.program_entitlements
       SET status = 'revoked',
           note = coalesce(_note, note),
           updated_at = now()
     WHERE user_id = _user_id
       AND program_key = _program_key
    RETURNING * INTO result;

    RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.revoke_program_access(uuid, text, text) TO authenticated;

-- =========================================================================
-- 6. content_overrides (Admin Content Overlay CMS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.content_overrides (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id text NOT NULL,
    module_id text NOT NULL,
    section_id text,
    position text NOT NULL CHECK (position IN ('before','after','replace','hide','append_module')),
    block_type text NOT NULL CHECK (block_type IN ('rich_text','embed_url','video','image','html','link_card','divider')),
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    sort_order int NOT NULL DEFAULT 0,
    is_published boolean NOT NULL DEFAULT false,
    created_by text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_overrides_lookup_idx
    ON public.content_overrides (program_id, module_id, is_published, sort_order);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_overrides TO authenticated;
GRANT ALL ON public.content_overrides TO service_role;

ALTER TABLE public.content_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students read published" ON public.content_overrides;
CREATE POLICY "students read published"
    ON public.content_overrides FOR SELECT
    TO authenticated
    USING (is_published = true OR public.is_zen_admin());

DROP POLICY IF EXISTS "admins insert overrides" ON public.content_overrides;
CREATE POLICY "admins insert overrides"
    ON public.content_overrides FOR INSERT
    TO authenticated
    WITH CHECK (public.is_zen_admin());

DROP POLICY IF EXISTS "admins update overrides" ON public.content_overrides;
CREATE POLICY "admins update overrides"
    ON public.content_overrides FOR UPDATE
    TO authenticated
    USING (public.is_zen_admin())
    WITH CHECK (public.is_zen_admin());

DROP POLICY IF EXISTS "admins delete overrides" ON public.content_overrides;
CREATE POLICY "admins delete overrides"
    ON public.content_overrides FOR DELETE
    TO authenticated
    USING (public.is_zen_admin());

-- =========================================================================
-- 7. Shared updated_at trigger
-- =========================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS program_entitlements_set_updated_at ON public.program_entitlements;
CREATE TRIGGER program_entitlements_set_updated_at
    BEFORE UPDATE ON public.program_entitlements
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS program_profiles_set_updated_at ON public.program_profiles;
CREATE TRIGGER program_profiles_set_updated_at
    BEFORE UPDATE ON public.program_profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS content_overrides_set_updated_at ON public.content_overrides;
CREATE TRIGGER content_overrides_set_updated_at
    BEFORE UPDATE ON public.content_overrides
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
