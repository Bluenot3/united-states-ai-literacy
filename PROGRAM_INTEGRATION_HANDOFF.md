# ZEN Program Ecosystem Integration Handoff

This repo is now prepared as a standalone program module that Arsenal can mount behind its existing auth, dashboard, admin, billing, and Supabase systems.

## Exports

- `src/zen-programs/programIntegrationContract.ts`
  - `ProgramKey`, `ProgramStatus`, `RegistrationStatus`, `ProgramAccessLevel`
  - `ProgramCatalogItem`, `UserProgramState`, `ProgramAccessDecision`
  - `getProgramCatalog()`
  - `getProgramBySlug(slug)`
  - `getProgramByKey(programKey)`
  - `getVisibleProgramsForUser(userProgramStates, isAdmin)`
  - `getProgramAccessDecision(input)`
  - `parseProgramCampaignParams(searchParams)`
- `src/zen-programs/programRegistrationAdapter.ts`
  - `ProgramRegistrationAdapter`
  - mock/local adapter
  - Supabase-ready adapter
  - registration and progress preparation methods
- `src/zen-programs/arsenalProgramBridge.ts`
  - Arsenal-facing bridge metadata
  - ownership boundary between Arsenal and the ZEN Program Ecosystem
  - Vault, Hugging Face publish, CREDS, release-control, and progress-summary link contracts
- `src/zen-programs/components/ProgramAccessGate.tsx`
- `src/zen-programs/pages/ProgramSuitePage.tsx`
- `src/zen-programs/pages/ProgramDetailPage.tsx`
- `src/zen-programs/pages/ProgramRegisterPage.tsx`
- `src/zen-programs/admin/ProgramAdminPanel.tsx`

## Canonical Identity

Final Arsenal integration must pass the Arsenal Supabase auth user id as `userId`.

Canonical id:

```ts
const userId = auth.uid(); // auth.users.id
```

Standalone preview mode uses local synthetic ids only for local mock registration testing. Do not preserve those ids in Arsenal production data.

## Routes Prepared

- `/programs`
- `/programs/:slug`
- `/programs/:slug/register`
- `/register/:slug`
- `/programs/:programId/launch`
- `/admin/programs`

Existing `/hub`, `/programs/:programId` curriculum concepts, curriculum files, mini-apps, and module routes are preserved. Full program curriculum entry is now gated at the launch entry point.

## Arsenal Native Boundary

AI Pioneer and Vanguard already work inside the existing ZEN Program Ecosystem. Do not rebuild either program, recreate the curriculum engine, replace the module routes, or duplicate the program database during the Arsenal merge.

Arsenal should treat this repo as a first-class program module:

- Arsenal owns discovery, registration, access state, entitlement summary, admin release controls, progress summaries, Vault artifact links, Hugging Face publish links, and learner/program status.
- The ZEN Program Ecosystem owns curriculum runtime, lessons, module navigation, embedded program behavior, mini-apps, deep lesson progress, and source program manifests.
- `src/zen-programs/arsenalProgramBridge.ts` is the adapter boundary for those responsibilities.
- AI Pioneer and Vanguard overview pages now surface this bridge explicitly while still launching or previewing the existing program routes.

Prepared link contracts:

- Vault artifact lane: `/vault?program=<programKey>` for Arsenal to mount later.
- Hugging Face publish lane: `/publish/hugging-face?program=<programKey>` for Arsenal or its deployment tooling to mount later.
- CREDS proof lane: `/creds?program=<programKey>` reuses the existing CREDS surface.

## Default Program States

- `ai-pioneer`: `preview`, registration enabled, preview enabled, full access requires enrollment
- `vanguard`: `preview`, registration enabled, preview enabled, full access requires enrollment
- `homeschool-kit`: `waitlist`, registration enabled, preview disabled by default
- `web3-literacy`: `waitlist`, registration enabled, preview disabled by default
- `train-a-trainer`: `waitlist`, registration enabled, preview disabled by default

The existing internal registry ids are mapped to Arsenal-facing keys:

- `blockchain-literacy` -> `web3-literacy`
- `train-the-trainer` -> `train-a-trainer`

## Access Gating

`getProgramAccessDecision()` is pure and backend-independent.

Rules:

- Admin can preview everything without publishing it.
- Logged-out users can view overviews and registration CTAs.
- Authenticated users can register when `registrationEnabled` is true.
- Registered users see waitlist state.
- Full launch requires `enrolled`, `facilitator`, or `admin` access and program `open` or `live`.
- Draft programs are admin-only.
- Archived programs are hidden unless admin or already enrolled.

## Registration Adapter

The default adapter is mock/local unless:

```env
VITE_PROGRAM_REGISTRATION_ADAPTER=supabase
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Arsenal should inject or replace the adapter with its own Supabase client if it already centralizes data access. Do not add a second auth system or second user table.

## Supabase MCP / Project Setup

Codex MCP was configured locally for Supabase project ref `csmuunvhcekcamuccsnn` and `codex mcp login supabase` completed in this workstation session. That enables Codex-side project access after tool reload, but it does not inject browser runtime credentials.

For live program registrations in this repo, configure:

```env
VITE_PROGRAM_REGISTRATION_ADAPTER=supabase
VITE_SUPABASE_URL=https://csmuunvhcekcamuccsnn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable anon key>
```

Apply and review `docs/supabase/programs_handoff_migration.sql` in the Supabase project before enabling the adapter. Never expose a Supabase `service_role` key in Vite/browser environment variables.

## Supabase SQL

Handoff SQL is here:

```text
docs/supabase/programs_handoff_migration.sql
```

It creates:

- `program_catalog`
- `program_registrations`
- `program_access_grants`
- `program_user_progress`

All user-owned rows reference `auth.users(id)`. RLS is enabled. Admin policies currently use the standalone helper name `public.is_zen_vanguard_admin()` because that exists in this repo. During Arsenal merge, replace that helper with Arsenal's real admin role/platform admin policy helper.

## Share Links

Registration pages capture:

- `source`
- `src`
- `ref`
- `referralCode`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Example:

```text
/programs/pioneer/register?utm_source=sms&utm_campaign=ai_pioneer_launch&ref=mentor-a
```

## What Remains For Arsenal Merge

- Apply reviewed SQL in Arsenal Supabase.
- Replace admin helper references with Arsenal's canonical admin helper.
- Inject Arsenal auth context and use `auth.users.id` as `userId`.
- Decide whether logged-out registration becomes an Arsenal login prompt or a separate lead capture flow owned by Arsenal.
- Wire real publish/unlock controls to Arsenal admin APIs.
- Mount or map the prepared Vault and Hugging Face publish lanes in Arsenal.
- Keep AI Pioneer and Vanguard deep curriculum behavior delegated to the existing Program Ecosystem routes.
- Wire progress updates only at central lesson renderer points after merge QA.

## Known Risks

- Standalone local registration uses localStorage and synthetic ids for preview only.
- Existing repo has prior local debug artifacts and unrelated uncommitted program curriculum edits.
- Existing Supabase publish settings and entitlement layers are preserved but not deeply merged with the new registration tables.
- Full lesson-level gating was intentionally not applied to every lesson to avoid breaking current curriculum rendering.
