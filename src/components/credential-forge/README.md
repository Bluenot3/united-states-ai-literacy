# Credential Forge

Credential Forge is an isolated visual prototype for holographic credential cards.

Current behavior:

- Client-side only.
- No wallet connection.
- No blockchain writes.
- No database writes.
- No Supabase, Stripe, payment, enrollment, auth, or course-completion integration.
- Mock metadata and mint payload generation only.

Mock function replacement path:

- `prepareCredentialMetadata()` can later read canonical holder/course/program state from approved storage.
- `generateCredentialHash()` can later use a canonical server-side hash pipeline.
- `buildMintPayload()` can later target a reviewed contract payload or attestation schema.
- `stampAchievementMock()` can later consume verified completion events.
- `verifyCredentialMock()` can later read indexer, attestation, or contract status.

QA checklist:

- Open `/credential-forge` while authenticated.
- Change participant, title, cohort, tier, theme, badge style, intensity, density, and chain placeholder.
- Confirm the card updates live without touching production data.
- Stamp each mock achievement and verify status progression: pending -> confirmed -> anchored.
- Confirm hashes are visibly fake placeholders.
- Copy metadata JSON and mint payload.
- Reset design.
- Randomize premium card.
- Verify mobile layout stacks cleanly.
