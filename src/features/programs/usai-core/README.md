# USAI Core — ZEN Vanguard Program Module

**Program:** ZEN Vanguard | AI Literacy Certification  
**Version:** 3.1.0  
**Source repo:** [Bluenot3/V3](https://github.com/Bluenot3/V3)  
**Migrated:** 2026-05-05  

---

## What This Is

The ZEN Vanguard is a full-stack professional AI literacy platform with:
- **4 guided curriculum modules** (AI Foundations → Prompt Engineering → Deployment → Leadership)
- **Supabase authentication** (email/password, per-user progress tracking)
- **Stripe payment integration** (gated access to full curriculum)
- **Certification system** (per-module certificates + final certification)
- **Admin dashboard** (student analytics, session history, progress management)
- **Express API backend** (billing status, Stripe webhooks, admin bypass)

---

## Directory Structure

```
usai-core/
├── src/                    ← Full React source (migrated from V3-main/src/)
│   ├── App.tsx             ← Root router and provider setup
│   ├── main.tsx            ← Vite entry point
│   ├── components/         ← UI components (ZenCard, ZenButton, modules, etc.)
│   ├── contexts/           ← AuthContext, BillingContext
│   ├── data/               ← Static program content, module section data
│   ├── hooks/              ← useAuth, useBilling, etc.
│   ├── modules/            ← module1–module4 lesson content
│   ├── pages/              ← All route-level pages
│   ├── services/           ← dal.ts (Supabase DAL), CertificateService.ts
│   ├── types.ts            ← Shared TypeScript types
│   └── utils/              ← Helpers, formatters
├── public/                 ← Static assets (favicon, og-image, fonts, etc.)
├── configs/                ← Reference build configs (vite, tsconfig, tailwind)
├── manifest.json           ← Full dependency manifest + integration notes
├── .env.example            ← Required environment variables (no secrets)
└── README.md               ← This file
```

---

## Dependencies — Shell Conflicts

Before this module can run inside the staging shell or Arsenal, the host must be upgraded:

| Package | Shell Version | Required Version | Action |
|---------|--------------|-----------------|--------|
| `react` | ^18.3.1 | **^19.0.0** | Upgrade shell |
| `react-dom` | ^18.3.1 | **^19.0.0** | Upgrade shell |
| `react-router-dom` | ^6.30.1 | **^7.1.0** | Upgrade shell |

These are breaking changes — test the full shell after upgrading.

**New deps to add to root (non-breaking):**

```bash
npm install @supabase/supabase-js@^2 cytoscape@^3 mermaid@^11 @mermaid-js/parser@^1 pdfjs-dist@^5 @google/genai@^1
npm install --save-dev @types/cytoscape
```

---

## Running Standalone (for development)

```bash
cd src/features/programs/usai-core

# Copy configs back to a standalone root
cp configs/vite.config.mjs ../../..   # three levels up to where you init a standalone project
cp configs/tsconfig.json   ../../..
# ... etc

# Install deps using the manifest.json runtimeDependencies list
npm install

# Set env vars
cp .env.example .env.local
# Edit .env.local with real Supabase/Stripe credentials

# Run
npm run dev
```

---

## Integration Notes for Arsenal

1. **Router**: Extract `src/App.tsx` routes and mount them under `/program/usai-core/*` in the Arsenal router.
2. **Providers**: Wrap the usai-core subtree with `<AuthProvider>` and `<BillingProvider>`.
3. **Backend**: The Express API in `server/` handles Stripe webhooks and billing — deploy as a separate service or merge into Arsenal's API layer.
4. **Auth bypass**: `VITE_ENABLE_DEMO_LOGIN=true` enables a local preview user (no Supabase required) — useful for staging.
5. **Path aliases**: `@/` maps to `src/` — configure in Arsenal's vite/tsconfig.

---

## Staging Shell Notes

Per the staging shell policy:  
> "Do not add auth, database, payments, or backend logic to this shell."

The usai-core module is parked here as a code asset. The shell's own `App.tsx` and `main.tsx` are unchanged. Integration happens when this module moves to Arsenal.
