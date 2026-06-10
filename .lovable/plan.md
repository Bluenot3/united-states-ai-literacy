## Goal

Move AI Pioneer toward the Ticket.html "holographic pass" feel and add interactive depth to Modules 1 and 2 — without rebuilding the working dashboard or breaking the existing 3749-line renderer.

## Scope of this pass

### 1. Shared visual system (new file)
Create `src/zen-programs/pioneer/pioneerPass.css` with a small set of reusable utility classes that translate the Ticket.html aesthetic into the existing app:
- `.pioneer-pass` — holographic foil-sweep panel (black/slate base, cyan/emerald/magenta sheen, security-thread lines, perforation edge)
- `.pioneer-glint` — animated foil sweep on hover (respects `prefers-reduced-motion`)
- `.pioneer-barcode` / `.pioneer-qr` — pure-CSS proof-of-work strips
- `.pioneer-pill-{active,ready,demo,external,coming,artifact}` — status pills
- `.pioneer-thread` — security-thread divider
- `.pioneer-reflection-term` — terminal-style reflection card

No new framework. Pure CSS classes the existing JSX can adopt incrementally.

### 2. Section hero treatment
Inside `ProgramDashboardPage.tsx`, retheme the existing section hero block to use `.pioneer-pass` styling (foil sweep, security thread, barcode strip, mini-QR, status pill). This is a CSS class swap on the existing element — no structural change.

### 3. Four new mini-apps (deterministic, no AI calls)
Add four new inline mini-app components and union keys, wired into the existing `renderNativeResource` switch:
- `prediction-engine` — Prediction Engine Simulator (next-token chips with confidence bars)
- `token-budget` — Token Budget Visualizer (paste text → chunk + context-window meter)
- `persona-agent` — Persona Agent Builder (role/audience/tone/limits → generated system prompt)
- `model-fit-router` — Model Fit Router (pick task → recommended model + reasoning)

All four are deterministic/simulated. Honest labels: each carries a `Demo` status pill. No backend, no real API calls, no key storage.

### 4. Curriculum wiring
Update `src/zen-programs/curriculum/pioneer/curriculumData.ts`:
- M1S1: add Prediction Engine + Token Budget resources, keep existing strong content
- M1S2: add Persona Agent Builder, reinforce existing Constraint/API-Orb cards
- M2S1: add Model Fit Router
- M2S2: add `Hugging Face Launch Map` and `Launch Readiness Checklist` as launch-card resources (no new components — rendered via existing list/callout primitives)

Existing section IDs stay stable.

### 5. Safety
All key fields keep the existing masked, session-only API Orb pattern. Only `sk-demo-REPLACE_WITH_YOUR_OWN_KEY` placeholders. No new secrets surface.

## Explicitly out of scope for this pass

To keep the change reviewable and the build clean, these are deferred (and will be reported as "remaining"):
- Prompt Mutation Lab, Context Stack Builder, MC-Bench Judge, Constraint Stack Studio, Output Format Forge, Deepfake Lens deeper rebuild, Modality Mixer, Arena Scorecard, Cost/Speed/Quality slider, File Pack Builder, Gradio Anatomy, Deploy Error Decoder as full mini-apps
- A full redesign of the 3749-line dashboard layout
- Real artifact/reflection persistence beyond existing localStorage
- Real Stripe/entitlement gating (Codex)

These will be honestly labeled in the report as launch-card-only or not-yet.

## Verification
- `bunx tsc --noEmit`
- Visual spot-check on `/programs/pioneer`

## Why this slice

It delivers the holographic Pioneer Pass visual language, four genuinely new interactive labs covering the biggest M1/M2 gaps, and honest launch-card content for the rest — all without touching auth, billing, Vanguard, Arsenal, or the working M1 S1–2 logic.

Approve and I'll implement, or tell me which mini-apps to swap in.
