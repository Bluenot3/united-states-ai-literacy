# CREDS

CREDS is a dry-run credential attestation workbench for holographic proof cards.

Current behavior:

- Client-side only.
- No wallet connection or signature flow.
- No blockchain writes.
- No attestation registry writes.
- No database writes.
- No Supabase, Stripe, payment, enrollment, auth, or course-completion integration.
- Dry-run metadata and attestation payload generation only.

Mock function replacement path:

- `prepareCredentialMetadata()` can later read canonical holder/course/program state from approved storage.
- `generateCredentialHash()` can later use a canonical server-side hash pipeline.
- `buildMintPayload()` can later target a reviewed VC, attestation, or contract payload schema.
- `stampAchievementMock()` can later consume verified completion events.
- `verifyCredentialMock()` can later read wallet signature, indexer, attestation, or contract status.

QA checklist:

- Open `/creds` while authenticated.
- Confirm `/credential-forge` redirects cleanly to `/creds`.
- Change participant, title, cohort, tier, theme, badge style, intensity, density, network, issuer, and proof standard.
- Confirm the card updates live without touching production data.
- Prepare each mock achievement attestation and verify status progression: prepared -> attestation-ready -> anchored.
- Confirm hashes and wallet / registry references are visibly dry-run placeholders.
- Copy metadata JSON and attestation payload.
- Reset design.
- Randomize premium card.
- Verify mobile layout stacks cleanly.
