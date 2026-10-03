# System Architecture & Key Decisions

## 1. Architectural Overview

```text
                         GITHUB REST API
                (users/yamkelajojo/repos)
                            │
                            ▼
             ┌──────────────────────────────┐
             │  src/lib/github/service.ts   │
             │  1. Fresh Cache Lookup       │
             │  2. Upstream Fetch (timeout) │
             │  3. normalizeGitHubRepos()   │
             │  4. Stale Cache Fallback     │
             │  5. Curated Static Fallback  │
             └──────────────┬───────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                SVELTEKIT 2 + SVELTE 5                   │
│                                                         │
│  Structured Domain Data (src/lib/data/*.ts)             │
│  ├── profile.ts         ├── skills.ts                   │
│  ├── experience.ts      ├── certifications.ts           │
│  ├── education.ts       └── projects.ts                 │
│                                                         │
│  Routes (src/routes/)                                   │
│  ├── / (Home)           ├── /github (Live Repos)        │
│  ├── /work              ├── /cv (+ PDF download)        │
│  ├── /work/[slug]       ├── /contact                    │
│  ├── /about             ├── /labs                       │
│  ├── /experience        └── /api/github, /sitemap.xml   │
│                                                         │
│  UI Foundation: Bits UI + Tailwind CSS v4 + Custom CSS  │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
            CLOUDFLARE WORKERS STATIC ASSETS
        (.svelte-kit/cloudflare/_worker.js + ASSETS)
```

## 2. Key Architectural Decisions (ADRs)

### ADR-001: SvelteKit 2.70 + Svelte 5 + `@sveltejs/adapter-cloudflare` v7
- **Context**: `SPECS_PRD.md` Section 52 mandates `svelte.config.js`, `vite.config.ts`, and `wrangler.jsonc` targeting Cloudflare Workers with Svelte 5 and Bits UI.
- **Decision**: Use `@sveltejs/kit@^2.70.3`, `svelte@^5.57.1`, `@sveltejs/adapter-cloudflare@^7.2.9`, `bits-ui@^2.19.5`, and `wrangler@^4.147.0`.
- **Rationale**: SvelteKit 2.70 supports Svelte 5 runes (`$state`, `$derived`, `$props`) and preserves standard `svelte.config.js` compatibility alongside `vite.config.ts` and Wrangler v4 Static Assets.

### ADR-002: Multi-Tier GitHub Caching & Zero-Crash Degradation (`R0/month` Discipline)
- **Context**: Cloudflare Workers free tier allows 100,000 requests/day and GitHub's unauthenticated public API allows 60 requests/hour per IP. Making an upstream GitHub request on every page visit would quickly exhaust rate limits or slow page loads.
- **Decision**:
  1. **Tier 1 — In-Memory / Edge TTL Cache (`15 minutes` fresh, `24 hours` stale window)**: Requests within the fresh window return immediately without network I/O.
  2. **Tier 2 — HTTP Cache-Control Headers (`s-maxage=900, stale-while-revalidate=3600`)**: Allows Cloudflare's edge cache to serve repeat visitors without invoking upstream fetches.
  3. **Tier 3 — Stale Cache & Curated Snapshot Fallback**: If GitHub returns `403/429` (rate limit), `5xx`, malformed JSON, or times out (`4500ms` abort controller), the service returns stale cached repositories if present, or falls back to the verified snapshot of `yamkelajojo`'s public repositories with `source: 'fallback'` and `isStale: true`. Raw error objects or stack traces are never exposed to visitors.

### ADR-003: Josh W. Comeau's 2026 Modern CSS Reset + Editorial Monograph Design System
- **Context**: `initial_prompt.md` Section 5 & 12 require applying the current version of Josh W. Comeau's custom CSS reset (`https://www.joshwcomeau.com/css/custom-css-reset/`, updated June 2026) and avoiding generic AI gradients, glassmorphism, or template dashboards.
- **Decision**:
  - Apply all 10 rules from Josh W. Comeau's 2026 reset in `src/app.css`, preserving `*:not(dialog) { margin: 0; }` so native `<dialog>` and Bits UI modal primitives retain proper positioning, and setting `#sveltekit-root { isolation: isolate; }`.
  - Pair warm paper/alabaster surfaces (`#f7f4ee`) and deep obsidian dark mode (`#0f1211`) with structural hairline rules (`1px solid`), terracotta/copper accents (`#b84a27` / `#e06d44`), forest verdigris (`#1f6f54`), and a disciplined typographic hierarchy.
