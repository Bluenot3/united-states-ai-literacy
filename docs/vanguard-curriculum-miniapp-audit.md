# Vanguard Curriculum + Mini-App Audit

## Executive summary

This audit was run as a shallow repo inspection over the Vanguard app in `V3-main`. I inspected `package.json`, `src/App.tsx`, module pages, curriculum data files, section renderers, interactive component directories, AI runtime files, route-level tools, and supporting docs. I did not refactor app code, change routes, or execute a full browser QA pass.

High-signal findings:

- 4 Vanguard modules were found.
- 8 canonical merge sections were found, but Modules 1-3 also contain 8 extra top-level wrapper blocks outside the target 4x2 structure.
- 98 canonical lessons were found under the 8 merge sections.
- 190 curriculum interactive placements were found total: 170 inside the 8 canonical sections and 20 in extra top-level wrappers.
- 127 unique curriculum interactive component names are referenced; 75 additional unique interactive names ship in module folders but are not referenced by curriculum data.
- No Notion sync, Notion mapping, or curriculum ingestion layer was found in repo. Vanguard currently behaves as a repo-hardcoded curriculum.
- Merge readiness is blocked more by structure drift, mapping drift, progress-model drift, and orphaned mini-apps than by routing.

## What was inspected

- package and runtime entry points: `package.json`, `src/App.tsx`, `server/index.js`
- curriculum and program data: `src/modules/**/data/curriculumData.ts`, `src/zen-programs/programsRegistry.ts`, `src/data/vanguardDocs.ts`, `VANGUARD_CURRICULUM.md`
- page and router surfaces: `src/pages/Module1Page.tsx` through `Module4Page.tsx`, `DocumentationPage.tsx`, `CredsPage.tsx`, `PioneerProfilePage.tsx`
- mini-app wiring: module `SectionRenderer.tsx` files and module `components/interactive` directories
- progress and credential plumbing: `src/hooks/useModuleExperience.ts`, `src/contexts/AuthContext.tsx`, `src/services/progressEngine.ts`
- AI/WebLLM runtime boundary: `src/lib/ai/webllmProvider.ts`, `src/lib/ai/runProgramAI.ts`, `src/lib/aiClient.ts`, `src/hooks/useWebLLMProvider.ts`, module `GeminiChat.tsx` files

## Vanguard module/section map

| Module | Title | Canonical sections | Lessons | Mapped mini-app placements | Actual trackable nodes | Configured progress total | Extra top-level blocks |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| Module 1 | AI Foundations | Module 1: The Intelligence Inside / Module 2: Generative Intelligence | 32 | 63 | 38 | 50 | overview (6 interactives), ai-foundations (7 interactives), ai-magic-demo (2 interactives), ai-models (1 interactives) |
| Module 2 | Agents & Automation Frameworks | PART 1: Agentic Foundations & Reasoning Systems / PART 2: Advanced Automation & Governance Frameworks | 22 | 34 | 27 | 40 | overview (1 interactives), deliverables (0 interactives), outcome (0 interactives) |
| Module 3 | Personal Intelligence & Cognitive Systems | PART 1: The Architecture of a Second Brain / PART 2: Cognitive Leverage & Decision Systems | 22 | 22 | 25 | 40 | overview (3 interactives) |
| Module 4 | AI Systems Mastery & Professional Integration | Section 1 - Systems Engineering & Operational Excellence / Section 2 - Governance, Analytics & Future Strategy | 22 | 51 | 24 | 60 | none |

Notes:

- Module 1 uses `module-1` and `module-2` as the only clean two-section merge targets, but also ships onboarding/foundations/demo/model-landscape blocks above them.
- Module 2 uses `part-1` and `part-2`, but also ships `overview`, `deliverables`, and `outcome` blocks outside the two-section target.
- Module 3 uses `part-1` and `part-2`, plus an extra `overview` block.
- Module 4 is the only module already shaped like a clean two-section container.
- Section ID strategy is not consistent across modules: Module 1 uses `module-*`, while Modules 2-4 use `part-*`.
- Title strategy is also inconsistent. Example: Module 1 page chrome says `AI Foundations`, while its curriculum file title is `Introduction to Machine Learning`.

## Mini-app inventory

The exhaustive lesson-to-mini-app listing lives in `docs/vanguard-curriculum-miniapp-map.json`. Summary counts from source inspection:

- 170 canonical lesson-bound mini-app placements were found across the 8 target sections.
- 111 unique lesson-bound mini-app/component names were found across those placements.
- 204 orphaned mini-app/tool entries were found outside curriculum bindings, collapsing to 79 unique names.
- 130 unique discoverable mini-app/tool names were found across mapped and orphaned surfaces combined.

### Inventory summary table

| Inventory slice | Count | Notes |
| --- | ---: | --- |
| Canonical lesson-bound placements | 170 | All placements attached to lessons inside the 8 merge sections |
| Unique lesson-bound mini-app names | 111 | Reuse is common across modules |
| Extra top-level wrapper placements | 20 | Live in non-canonical module `overview`/`deliverables`/`foundations` style blocks |
| Orphaned entries | 204 | Includes module-local unused interactive files and route-level standalone tools |
| Unique orphaned names | 79 | High-confidence cleanup or remap candidates |
| Unique discoverable mini-app/tool names | 130 | Combined mapped + orphaned name set |

- API-backed placements: 83
- WebLLM placements: 4
- Simulated-AI placements: 21
- Local-logic placements: 53
- Static placements: 9
- Unknown placements: 0

Additional wiring signals:

- Section-level Suspense loading fallback exists for every mapped interactive surface through module `SectionRenderer` components.
- 121 module-specific interactive sources include an explicit progress/completion hook.
- 52 module-specific interactive sources do not show an explicit completion hook and therefore risk becoming invisible to progress reporting.
- 23 module-specific interactive sources contain explicit fallback, mock, or unsupported-state language.

## Curriculum-to-mini-app mapping

The companion JSON file maps all 98 lessons into the target 8 sections and includes per-mini-app route, source file, runtime type, readiness, and issues.

### Canonical section coverage

| Module | Section | Lessons | Mini-app placements | Content-only lessons | Representative connected mini-apps | Primary issues |
| --- | --- | ---: | ---: | --- | --- | --- |
| Module 1 | Module 1: The Intelligence Inside | 22 | 35 | `1-21` | `NeuralEvolutionChronicle`, `ModelArmsRaceTimeline`, `EthicalDilemmaSimulator`, `MemoryDecayLab` | Extra wrapper blocks above the section; title drift between page chrome and curriculum data |
| Module 1 | Module 2: Generative Intelligence | 10 | 28 | none | `DiffusionFieldExplorer`, `PromptArchitectWorkbench`, `SceneDirectorXR`, `CinematicPromptSequencer` | Section ID convention differs from Modules 2-4; several reused components carry different pedagogical jobs |
| Module 2 | PART 1: Agentic Foundations & Reasoning Systems | 11 | 12 | none | `AgentSystemDesigner`, `LangGraphVisualizer`, `ToolCallDashboard`, `CapstoneAgentBuilder` | Module still carries extra `overview` / `deliverables` / `outcome` nodes outside the canonical split |
| Module 2 | PART 2: Advanced Automation & Governance Frameworks | 11 | 22 | none | `RagBuilder`, `HitlRagSimulator`, `GovernanceDecisionSimulator`, `DecisionAuditLog` | Several AI-heavy apps depend on the shared API proxy without lesson-level runtime contracts |
| Module 3 | PART 1: The Architecture of a Second Brain | 11 | 12 | `3-11` | `DigitalJanitorLab`, `RagBuilder`, `KnowledgeGraphBuilder`, `MeetingSummarizer` | Extra overview block sits outside the target section model |
| Module 3 | PART 2: Cognitive Leverage & Decision Systems | 11 | 10 | `3-22` | `DecisionFatigueMeter`, `DecisionMatrixCalculator`, `ScenarioSimulator`, `ExecutiveBriefBuilder` | Low placement density relative to lesson count; implementation lessons are content-only |
| Module 4 | Section 1 - Systems Engineering & Operational Excellence | 11 | 27 | none | `AiSystemsBlueprintVisualizer`, `MultiAgentChatSandbox`, `AgentSystemDesigner`, `LangGraphVisualizer` | Renderer imports some experiences from Module 2 instead of a shared ownership layer |
| Module 4 | Section 2 - Governance, Analytics & Future Strategy | 11 | 24 | none | `DataDriftRiskLens`, `AiEthicsTracker`, `FutureScenarioPoll`, `InteractiveDebates` | Credential and artifact paths are still weakly integrated with production completion logic |

Coverage summary:

- Lessons with no bound mini-apps: 3
- Canonical lessons with at least one mini-app: 95
- Extra top-level content blocks with interactives but no clean section slot: 8

Missing interaction candidates:
- 1-21 - 1.21 Capstone - Integrated Application (Lesson content is present but no interactive component is bound to it in repo data.)
- 3-11 - 3.11 Build The Omni Studio (Implementation) (Lesson content is present but no interactive component is bound to it in repo data.)
- 3-22 - 3.22 Build The Decision Nexus (Implementation) (Lesson content is present but no interactive component is bound to it in repo data.)

## WebLLM / AI feature inventory

- WebLLM Provider (webllm) - src/lib/ai/webllmProvider.ts
- runProgramAI (webllm+template) - src/lib/ai/runProgramAI.ts
- LocalAIStatusCard (webllm-ui) - src/components/ai/LocalAIStatusCard.tsx
- PromptArchitectWorkbench (hybrid-webllm-api) - src/modules/module1/components/interactive/PromptArchitectWorkbench.tsx
- GeminiChat Widgets (api) - src/modules/module2/components/GeminiChat.tsx; src/modules/module3/components/GeminiChat.tsx; src/modules/module4/components/GeminiChat.tsx
- Documentation Copilot (api) - src/pages/DocumentationPage.tsx

Interpretation:

- WebLLM exists as real infrastructure and has browser support checks plus template fallback handling.
- Most AI-heavy curriculum surfaces are still API-proxy or simulated-AI experiences rather than lesson-manifested local models.
- The module chat assistants are module-wide helpers, not lesson-bound tools.
- No Notion-aware AI runtime or curriculum grounding layer was found.

## Orphaned apps

High-confidence orphan preview (full list is in the JSON manifest under `orphanedMiniApps`):
- AgentSystemDesigner - src/modules/module1/components/interactive/AgentSystemDesigner.tsx (orphaned)
- AiAlignmentTuner - src/modules/module1/components/interactive/AiAlignmentTuner.tsx (orphaned)
- AiEthicsTracker - src/modules/module1/components/interactive/AiEthicsTracker.tsx (orphaned)
- AiPaletteSynthesizer - src/modules/module1/components/interactive/AiPaletteSynthesizer.tsx (orphaned)
- AlgorithmVisualizer - src/modules/module1/components/interactive/AlgorithmVisualizer.tsx (orphaned)
- BenefitSorter - src/modules/module1/components/interactive/BenefitSorter.tsx (orphaned)
- BlockchainExplorer - src/modules/module1/components/interactive/BlockchainExplorer.tsx (orphaned)
- BusinessModelCanvas - src/modules/module1/components/interactive/BusinessModelCanvas.tsx (orphaned)
- CodeDebugger - src/modules/module1/components/interactive/CodeDebugger.tsx (orphaned)
- DockerCommandQuiz - src/modules/module1/components/interactive/DockerCommandQuiz.tsx (orphaned)
- EmotionBlendMixer - src/modules/module1/components/interactive/EmotionBlendMixer.tsx (orphaned)
- FeatureExplorer - src/modules/module1/components/interactive/FeatureExplorer.tsx (orphaned)
- FundingPulseTicker - src/modules/module1/components/interactive/FundingPulseTicker.tsx (orphaned)
- GenerativeSculptor3D - src/modules/module1/components/interactive/GenerativeSculptor3D.tsx (orphaned)
- ImagePromptEnhancer - src/modules/module1/components/interactive/ImagePromptEnhancer.tsx (orphaned)
- JobImpactSimulator - src/modules/module1/components/interactive/JobImpactSimulator.tsx (orphaned)
- LivePatentRadar - src/modules/module1/components/interactive/LivePatentRadar.tsx (orphaned)
- MultiAgentChatSandbox - src/modules/module1/components/interactive/MultiAgentChatSandbox.tsx (orphaned)
- PedagogyMatcher - src/modules/module1/components/interactive/PedagogyMatcher.tsx (orphaned)
- PersonalizationSimulator - src/modules/module1/components/interactive/PersonalizationSimulator.tsx (orphaned)

Orphan pattern summary:

- 200 module-specific unused interactive file entries were found.
- Those collapse to 75 unique component names with no curriculumData reference in their owning modules.
- Additional route-level orphan tools exist: CREDS, Documentation Copilot, Notebook, and OnboardingChat.

## Missing curriculum interactions

Only 3 canonical lessons are fully content-only in the current repo model:

- 1-21 - 1.21 Capstone - Integrated Application (Lesson content is present but no interactive component is bound to it in repo data.)
- 3-11 - 3.11 Build The Omni Studio (Implementation) (Lesson content is present but no interactive component is bound to it in repo data.)
- 3-22 - 3.22 Build The Decision Nexus (Implementation) (Lesson content is present but no interactive component is bound to it in repo data.)

These are strong candidates for either explicit artifact capture, guided submission, or manifest-only linkage rather than free-floating content.

## Duplicates / overlaps

Top overlaps by repeated component reuse:
- SectionQuiz: used 9 times across vanguard-module-1, vanguard-module-2, vanguard-module-3, vanguard-module-4
- EthicalDilemmaSimulator: used 4 times across vanguard-module-1, vanguard-module-3, vanguard-module-4
- MemoryDecayLab: used 4 times across vanguard-module-1, vanguard-module-2, vanguard-module-3, vanguard-module-4
- PrivacyLensDashboard: used 4 times across vanguard-module-1, vanguard-module-2, vanguard-module-3, vanguard-module-4
- AdversarialAttackSimulator: used 3 times across vanguard-module-1, vanguard-module-2, vanguard-module-4
- ContextWindowExplorer: used 3 times across vanguard-module-1, vanguard-module-4
- MeetingSummarizer: used 3 times across vanguard-module-1, vanguard-module-3, vanguard-module-4
- PromptArchitectWorkbench: used 3 times across vanguard-module-1, vanguard-module-3
- DataDecisionFlowchartBuilder: used 3 times across vanguard-module-1, vanguard-module-2, vanguard-module-4
- LangGraphVisualizer: used 3 times across vanguard-module-1, vanguard-module-2, vanguard-module-4

Interpretation:

- Reuse is not inherently bad, but a large share of reuse is concept drift rather than deliberate shared tooling. The same component name is often used to represent different pedagogical jobs in different modules.
- SectionQuiz is the clearest shared assessment primitive.
- Several reused components carry different curriculum meanings across modules, which will complicate a merge unless the manifest distinguishes lesson purpose from component name.

## Broken or risky items

- Progress totals are mismatched: dashboard and badge logic still use 50/40/40/60 while actual trackable counts discovered in curriculum data are 38/27/25/24.
- Module 4 imports some interactive dependencies from Module 2 instead of owning or sharing them cleanly.
- CREDS is a dry-run credential attestation workbench and should not be treated as live production credential infrastructure yet.
- Module profile/notebook surfaces still carry Pioneer naming and storage keys, which is a program-boundary leak.
- No Notion sync or mapping layer exists, so curriculum copy, objectives, and lesson sequencing are all repo-hardcoded.
- Module chat assistants are not lesson-specific and cannot serve as a clean merge target for mapped curriculum interactions.

## Notion source-of-truth recommendation

Safe to move to Notion as source of truth:

- program titles
- module titles
- section titles
- lesson copy
- objectives
- activity instructions
- rubrics
- artifact instructions
- credential criteria

Not safe to move to Notion in the current state:

- executable mini-app code
- routes
- component logic
- WebLLM provider logic
- API proxy logic
- game mechanics
- progress state logic
- certificate plumbing

Current-state conclusion:

- Vanguard is not Notion-ready yet because there is no bridge layer. The repo still treats curriculumData.ts as the effective source of truth.

## Repo-owned mini-app recommendation

Keep repo-owned:

- all `src/modules/**/components/interactive/**` code
- route-level tool surfaces such as CREDS, docs copilot, onboarding, notebook, and module chat widgets
- AI runtime adapters: WebLLM provider, template fallback router, API proxy client, server-side AI endpoints
- progress, artifact, badge, and credential plumbing

## Recommended manifest structure

Recommended bridge model before Lovable merge:

- `programId`: `vanguard`
- `moduleId`: stable Notion-backed module key
- `sectionId`: stable Notion-backed section key
- `lessonId`: stable Notion-backed lesson key
- `miniAppId`: stable repo key, usually the interactiveId when one exists
- `componentName`: repo component reference
- `route`: owning runtime surface such as `/module/2`
- `runtimeType`: `webllm`, `api`, `simulated-ai`, `local-logic`, or `static`
- `artifactType`: optional descriptor for what learner output the mini-app should produce
- `completionMode`: `section-scroll`, `interactive-hook`, `manual`, or `none`

The companion JSON file follows this direction and is intended as the draft bridge manifest.

## Arsenal merge readiness score

**52/100**

Category view:

- route readiness: medium
- content readiness: low
- mini-app readiness: medium-low
- WebLLM readiness: medium-low
- data model readiness: low
- progress/artifact readiness: low
- credential readiness: low
- mobile readiness: unknown without browser pass
- admin/cohort readiness: medium-low

## Top 10 fixes before Lovable merge

1. Introduce a canonical Vanguard manifest keyed by Notion lesson IDs and repo miniApp IDs.
2. Normalize Modules 1-3 to the intended two-section structure before merge mapping starts.
3. Reconcile progress totals in progressEngine with real trackable section counts.
4. Add explicit curriculum bindings or retire the 75 unique orphaned interactive names.
5. Promote CREDS from dry-run attestation workbench to a real issuer pipeline, or keep it completely outside the merge path.
6. Replace Module 4 cross-module interactive imports with owned implementations or shared common components.
7. Bind module chat assistants and docs copilot to lesson/module IDs instead of free-floating summaries.
8. Standardize completion semantics so every mapped mini-app either records completion or is intentionally read-only.
9. Move repo-hardcoded lesson copy, objectives, rubrics, and artifact instructions behind a Notion ingestion boundary.
10. Rename Pioneer-bound profile/notebook storage and labels to Vanguard-safe identifiers before merge.

## Unknowns and limits

- I did not run a browser pass across every mini-app, so mobile behavior and true runtime readiness remain conservative where code signals were insufficient.
- I did not inspect generated build output or node_modules.
- I did not verify any external Notion data because no Notion integration files were found in repo.
- Runtime type and readiness labels in the companion JSON are source-inspection heuristics, not live execution results.
