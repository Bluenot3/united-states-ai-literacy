# Design preview harness

The AI Pioneer console lives at `/programs/pioneer`, which sits behind
authentication **and** a billing entitlement. That makes it impossible to show
a reviewer, a teacher, or a partner without provisioning them an account.

This harness mounts the same page with only the context it actually needs — no
Supabase, no Stripe, no API server — so the console can be reviewed as a plain
static site.

```bash
npm run preview:pioneer   # dev server at http://127.0.0.1:5180
npm run build:preview     # static bundle in dist-preview/
```

`dist-preview/` is self-contained: drop it on any static host (Vercel, Netlify,
S3, GitHub Pages) or open it behind any local file server.

### URL flags

| URL | Effect |
| --- | --- |
| `/` | Fresh learner — everything at zero |
| `/?seed=mid` | Part-way through, so completed states, earned XP and cleared worlds are visible without clicking through first |
| `/?seed=reset` | Clears saved progress |

Progress persists in `localStorage`, so clicking through earns XP and triggers
rank-ups exactly as it would for a learner.

### Scope

This is a review tool, not part of the product:

- nothing under `src/` imports it,
- it is built only by `vite.preview.config.ts`, never by `npm run build`,
- the page is marked `noindex, nofollow`.

Live labs embed third-party sites (Hugging Face, NVIDIA) and are click-to-load,
so they stay inert until a reviewer chooses to run one.
