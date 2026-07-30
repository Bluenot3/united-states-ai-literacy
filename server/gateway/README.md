# ZEN AI Gateway

The single AI entry point for the US AI Literacy platform. Every program should
call this instead of a provider SDK, so classroom safety, spend control, and
usage accounting are enforced in one auditable place.

Mounted by `server/index.js` at:

- `/api/gateway/v1` — the gateway
- `/api/ai` — back-compat alias, so pre-existing `/api/ai/generate` and
  `/api/ai/image` callers keep working and inherit every protection

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/chat` (alias `/generate`) | Text generation |
| `POST` | `/image` | Image generation |
| `GET` | `/models` | What this deployment can serve |
| `GET` | `/usage` | Caller's consumption vs. caps |
| `GET` | `/health` | Liveness + config summary (no secrets) |

### `POST /chat`

```jsonc
{
  "task": "coach",          // quick | coach | reason  (default: coach)
  "messages": [{ "role": "user", "content": "what is a prompt?" }],
  "temperature": 0.7,        // clamped to 0..1.5
  "maxTokens": 800,          // clamped to the task's ceiling
  "cache": true              // only honoured when temperature <= 0.35
}
```

Clients ask for a **task**, never a raw model name. The registry picks the
model, which keeps lesson code stable across model changes and stops a
compromised client from steering spend onto an expensive model.

## What it enforces

**Classroom safety** (`policy.js`)
- A guardrail system prompt is prepended to every request and cannot be removed
  by the caller. A client-supplied system message is demoted to "Lesson
  context" *underneath* it.
- Self-harm / crisis phrasing short-circuits **before any provider call** and
  returns fixed, human-written copy pointing at 988. Nothing leaves the server.
  The patterns are phrase-level and high-precision so ordinary lesson traffic
  ("how do I kill a process") does not trip them.
- Credential-shaped strings (OpenAI/Google/GitHub/Slack keys, JWTs) are redacted
  before forwarding.
- Common jailbreak framings are neutralised rather than blocked.
- Image prompts are checked against a small explicit blocklist.
- Optional provider moderation pass (`GATEWAY_MODERATION=on`), which **fails
  open** — a moderation outage must not take a classroom offline.

**Spend control** (`limits.js`)
- Per-user request caps (per-minute and per-day) and an image-per-day cap.
- Per-user *and* program-wide daily USD caps. Rate limits bound speed; the
  spend cap bounds damage when a shared key meets a class of 30.
- Throttled responses carry a real `Retry-After`.

**Cost + latency** (`limits.js`)
- Deterministic (low-temperature) calls are cached, so thirty students working
  the same lesson mostly hit memory.

**Resilience** (`providers.js`, `registry.js`)
- Provider-agnostic adapters (OpenAI, Gemini). Routing falls through to
  whichever provider actually has a key, so a one-key deployment still works.
- Upstream error bodies are never forwarded to the browser — they can echo
  prompt content or key fragments.
- Requests time out (`GATEWAY_TIMEOUT_MS`) rather than hanging a lesson.

**Observability**
- One structured JSON log line per call with request id, task, model, latency,
  tokens, cost and outcome — and no prompt content.

## Configuration

| Variable | Default | Meaning |
| --- | --- | --- |
| `OPENAI_API_KEY` | — | Enables the OpenAI provider |
| `GEMINI_API_KEY` / `GOOGLE_API_KEY` | — | Enables the Gemini provider |
| `OPENAI_BASE_URL` | OpenAI | Override (used by the test stub) |
| `GEMINI_BASE_URL` | Google | Override |
| `GATEWAY_RPM_PER_USER` | `12` | Requests per minute per user |
| `GATEWAY_RPD_PER_USER` | `400` | Requests per day per user |
| `GATEWAY_DAILY_USD_PER_USER` | `1.5` | Daily spend cap per user |
| `GATEWAY_DAILY_USD_GLOBAL` | `100` | Daily spend cap for the whole program |
| `GATEWAY_IMAGES_PER_DAY` | `25` | Image generations per user per day |
| `GATEWAY_CACHE_TTL_MS` | `600000` | Cache entry lifetime |
| `GATEWAY_CACHE_MAX` | `500` | Max cached responses |
| `GATEWAY_TIMEOUT_MS` | `45000` | Upstream timeout |
| `GATEWAY_MODERATION` | off | `on` enables the provider moderation pass |

With no provider key configured the gateway returns a friendly `503` and the
lesson mini-apps fall back to their offline content — the program stays usable.

## Tests

```bash
npm run test:gateway
```

15 tests covering guardrail injection, crisis interception, false-positive
resistance, secret redaction, size limits, image blocking, rate limiting, spend
caps, usage reporting, caching, provider fallback, and cost estimation. No API
key or network access required.

## Known limitations

- **Identity is not authentication.** The `x-zen-user` header is
  client-asserted and therefore spoofable; it only separates honest classroom
  traffic into buckets. The hashed-IP fallback is what actually bounds an
  attacker. When the app forwards a verified Supabase JWT, verify it in
  `resolveIdentity` and prefer the verified subject.
- **State is in-process.** Counters and cache live in bounded `Map`s and reset
  on restart. Correct for a single app server; move to Redis before running
  multiple instances, or the effective caps multiply by instance count.
- Token counts fall back to a ~4-chars-per-token estimate when a provider does
  not report usage, so costs are approximate and rounded up.
