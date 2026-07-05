## Phase 1 — ZEN Sovereign UI (visual layer only)

Scope guardrail: no changes to routes, auth, Supabase, entitlements, `server/`, module curriculum, or module page logic. Only CSS, Tailwind config, shell components, zen/* components, and landing/home page get touched.

---

### 1. Fonts (bug fix)
- `src/index.css` line 1: replace the Cinzel+Outfit `@import` with a single import for **Space Grotesk (600, 700), Outfit (300–700), JetBrains Mono (400, 600)**.
- `index.html` already imports Space Grotesk + JetBrains Mono via a second `<link>`; keep that, remove the Orbitron/Cinzel families from `<link>` and the CSS import.
- `tailwind.config.js`: drop `display: Cinzel` → set `display: Space Grotesk`; remove `orbitron`.
- Global find/replace `'Orbitron'` → `'Space Grotesk'` and `Cinzel` → `Space Grotesk` inside `src/index.css` (dozens of hits in the Antigravity block).

### 2. Root tokens
Add a single `:root` block near the top of `index.css` with the new token names alongside legacy aliases so existing components keep working:

```css
:root {
  --zen-void: #050A18;
  --zen-midnight: #0D1730;
  --zen-panel: rgba(9,16,31,.88);
  --zen-border: rgba(240,214,142,.14);
  --zen-gold: #C9A84C;
  --zen-brass: #F5D88D;
  --pio-cyan: #22D3EE;
  --pio-violet: #8B5CF6;
  --sem-success: #34D399;
  --sem-warning: #FBBF24;
  --sem-danger:  #FB7185;
}
```

Legacy `--c/--p/--g/--y/--bg` remap to the new palette (cyan→pio-cyan, purple→pio-violet, yellow→gold, bg→zen-void). This transparently retints the Antigravity block without deleting it.

### 3. Type scale & a11y
- Global sweep of `src/index.css` and shell components: replace any `font-size: .42rem–.58rem` and `text-[9px]`/`text-[10px]` in Header/Sidebar with **min 11px** and tracking `.18–.22em`.
- Body base bumped to 15px (`html { font-size: 15px }` or `.zen-body { font-size: 15px }`).
- `@media (prefers-reduced-motion: reduce)` block already exists → keep and extend to disable the new `.zen-glass--live` sweep.

### 4. Consolidated glass system
Add one component layer in `index.css`:

```css
.zen-glass { background: var(--zen-panel); border: 1px solid var(--zen-border); border-radius: 1.25rem; backdrop-filter: blur(20px) saturate(1.4); box-shadow: inset 0 1px 0 rgba(245,216,141,.06), 0 4px 24px rgba(0,0,0,.35); }
.zen-glass--elevated { /* gold refraction sweep on hover (adapted from .glass-card) */ }
.zen-glass--live { /* conic cyan→violet border sweep + 4 corner brackets, adapted from .card-border/.ag-corner */ }
```

Legacy classes `.ag-glass`, `.card-glass`, `.card-glass-premium`, `.glass-card`, `.liquid-glass`, `.liquid-glass-card`, `.glass-morphism` become thin aliases: `.card-glass, .glass-card, .ag-glass, ... { @apply zen-glass; }` — preserves every existing consumer without ripping through 200+ files.

### 5. Kill the override forest
- Delete the `.dark-mode .bg-white { ... !important }` patch block from `index.css`.
- Rework only the shell files listed in step 6 to stop using `bg-white`/`text-black`; other pages that still ship `bg-white` continue to render correctly because the app is dark-first and shells no longer inject `dark-mode` overrides.
- Remove the light/dark toggle if it only swaps between two darks — inspect `ThemeContext.tsx`, keep the "high-contrast" branch, cut the fake light branch. If the toggle is not visible in the shell, leave the context alone and only remove its UI trigger.

### 6. Shell restyle (visual only)
Update to use tokens + `zen-glass` classes; no prop or export changes:
- `src/components/Header.tsx` — swap `text-[9px]/[10px]` micro-labels to 11px+ with 0.2em tracking, retint stat pills to `zen-glass`.
- `src/components/GlobalSidebar.tsx`, `MobileBottomNav.tsx`, `ModuleSidebar.tsx`, `Layout.tsx` — replace ad-hoc surfaces with `zen-glass`, gold accents for prestige areas, cyan→violet only on progress bars and active-state indicators.
- `src/components/ProgressRing.tsx`, `QuickActions.tsx` — progress stroke = cyan→violet linear gradient, completed = gold.
- `src/components/zen/*` (ZenHeaderBanner, ZenStatGauge, ZenActionTile, ZenIdentityCard, ZenTelemetryCard) — normalize to `zen-glass` + new type scale; keep icon glyphs.

### 7. Landing page hero
Target: whichever component renders `/` (per `Layout.tsx` comment it's the hub page, likely `src/pages/CommandCenterPage.tsx` or `src/zen-programs/pages/ProgramHubPage.tsx`). Confirm route, then rebuild only the hero section:
- Void backdrop, faint gold grid (reuse existing `.aurora-bg::after` grid).
- H1 in Space Grotesk 600, ~64px desktop / ~40px mobile: **"The First Youth AI Literacy Program in U.S. History"**.
- Sub-line: "Students don't study AI here. They ship it."
- Stat row: "Year 3 · Boys & Girls Clubs of Greater Washington · Students deploy live AI apps by Week 4".
- Two side-by-side program cards:
  - **AI Pioneer Program** — tag "Build & Launch Track", accent cyan/violet, `zen-glass--live`, CTA "Enter Pioneer Track" → existing `/programs/pioneer` route. No age mentioned on card.
  - **Vanguard Program** — tag "Professional Track", accent gold, `zen-glass--elevated`, CTA "Enter Vanguard" → existing `/programs/vanguard` (or current entry route).
- Lucide icons only, no emoji.

### 8. QA
Run in one shot:
- `rg -n "Orbitron|Cinzel" src/ index.html` → expect zero hits.
- `rg -n "font-size:\s*\.\d+rem|text-\[9px\]|text-\[10px\]" src/components src/pages/*.tsx src/index.css` → expect no hits inside shell files.
- `bunx tsgo --noEmit`.
- Playwright: load `/`, `/programs/pioneer`, `/module/1`, `/dashboard` at 375px width; assert no horizontal scroll and screenshot each.

### Assumptions worth flagging
- Non-shell pages that still reference legacy classes stay visually intact via the alias layer; a Phase 2 pass would rip out aliases.
- The landing hero copy uses the exact strings you provided. If the primary landing route is not `/`, I'll wire the hero into whichever component `<Route path="/" />` renders and confirm in the final report.
- The `ThemeContext` light-mode removal is conditional on it being purely cosmetic; if it swaps semantic tokens I'll leave it and just hide the toggle.
