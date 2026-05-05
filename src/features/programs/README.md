# ZEN Programs — Staging Shell

This is a **temporary staging repository**, not the final Arsenal production codebase.

## Purpose

- Provide a clean integration target for merging existing program projects.
- Stabilize and reconcile program modules before they move into Arsenal.

## Workflow

1. Existing program projects (AI Pioneer, Vanguard, Web3 Literacy, Homeschool Kit, Train-a-Trainer) will be merged here manually via GitHub, Codex, or Claude Code.
2. Conflicts and shared dependencies will be resolved in this repo.
3. Once stable, the consolidated code will be merged into the Arsenal monorepo.

## Important

- **Nothing here should be treated as final Arsenal production code.**
- Do not add auth, database, payments, or backend logic to this shell.
- Keep changes minimal and merge-friendly.

---

## Program Module Registry

| Module | Path | Status | React | Notes |
|--------|------|--------|-------|-------|
| **usai-core** | `usai-core/` | ✅ Imported | 19 | ZEN Vanguard AI Literacy — requires React 19 + Router v7 before integrating |
| ai-pioneer | — | ⏳ Pending | — | |
| web3-literacy | — | ⏳ Pending | — | |
| homeschool-kit | — | ⏳ Pending | — | |
| train-a-trainer | — | ⏳ Pending | — | |

---

## Shared Directories (for cross-module use)

| Directory | Purpose |
|-----------|---------|
| `components/` | Shared UI primitives usable across programs |
| `data/` | Shared static data, content schemas |
| `pages/` | Shared page wrappers / layout shells |
| `utils/` | Shared utility functions |
