# Yamkela Jojo — Developer Portfolio

A SvelteKit portfolio for **Yamkela Jojo**, a Durban-based full-stack and software developer. It presents professional experience, projects, a web CV and downloadable PDF, and public GitHub repository data.

Built with SvelteKit 2, Svelte 5, TypeScript, Tailwind CSS 4, Bits UI, and `@sveltejs/adapter-cloudflare`. Cloudflare Workers and Static Assets are the deployment target; the app is designed to use Cloudflare's free-plan services without a separate database or paid backend. Free-plan quotas still apply.

## Architecture

- **Cloudflare Worker + Static Assets:** SvelteKit server routes are handled by the generated Worker. Files such as the CV PDF, icons, images, and hashed client assets are served through the configured Static Assets binding (`run_worker_first: false`). This does not make every page static: `/`, `/work`, `/github`, `/api/github`, and other SvelteKit routes can invoke the Worker.
- **GitHub data:** `/`, `/work`, `/github`, and `/api/github` call the same server-side GitHub client when their Worker handler runs. It requests public repositories, follows up to 20 pages, applies a 4.5-second timeout, validates and normalizes the response, and falls back to a maintained snapshot when GitHub fails. A cold failure returns fallback data with an explicit failure status; it does not pretend the snapshot was freshly fetched.
- **No application-managed data cache:** the GitHub service does not implement a memory/TTL cache or scheduled synchronization job. The snapshot is a manually maintained fallback. The generated adapter Worker also contains an internal `caches.default` response wrapper around SvelteKit; it runs after Worker invocation, is distinct from Workers Caching, and is not relied on for correctness or for skipping Worker CPU.
- **SEO origin:** canonical, Open Graph, JSON-LD, sitemap, and robots URLs use the configured server-side `SITE_ORIGIN`, never an untrusted request `Host` header.

## GitHub response caching: chosen approach and trade-offs

This project uses **Cloudflare Workers Caching** (`cache.enabled: true` in `wrangler.jsonc`) and response `Cache-Control` headers. It is distinct from the programmatic Workers Cache API and from Static Assets' own delivery/cache behavior.

| Option | Benefits | Trade-offs |
| --- | --- | --- |
| **Workers Caching — selected** | No KV binding, scheduled job, or app-level cache code. Cloudflare checks eligible responses before invoking the Worker. Successful GitHub-backed pages and `/api/github` are fresh for 30 minutes, allow a 30-minute stale-while-revalidate window, and specify stale-if-error for up to 24 hours. Fallback responses have a five-minute freshness window. | A cache hit still counts as a Worker request; it avoids Worker execution/CPU, not the request itself. It does not guarantee low request use: misses, expiry, revalidation, query variants, bypasses, and cold caches after a new version deploy can invoke the Worker and GitHub. By default, each Worker version has its own cache, so every deployment starts cold; enabling cross-version reuse trades that warm-up for potentially serving an older version's response until expiry or purge. A cold miss has no prior success to serve stale. Check `Cf-Cache-Status` on the deployed response to observe actual behavior. |
| **Workers Cache API (`caches.default`)** | Programmatic control over cache keys, reads, writes, and invalidation. | Separate from Workers Caching and requires application-level cache logic. Cloudflare's Cache API documentation describes functional operations for Workers on custom domains; this project must not assume equivalent behavior for its `workers.dev` URL. Not selected. |
| **GitHub Actions snapshot** | Can refresh a committed JSON snapshot without a runtime GitHub subrequest. | Adds workflow and repository-write/update concerns. Scheduled workflows may be delayed or dropped, run from the default branch, and may be disabled for inactive public repositories. Not selected as a freshness guarantee. |
| **Cron Trigger + KV** | A scheduled Worker can refresh a snapshot; request handlers can read KV instead of calling GitHub on every cold cache miss. KV has a free allowance, including 100,000 reads/day and 1,000 writes/day. | Adds a `scheduled()` handler, KV binding, persistence/versioning rules, and integration with the existing SvelteKit Worker. More moving parts than route-response caching. Not selected. |

The generated SvelteKit adapter Worker also contains a `caches.default` lookup/write wrapper around the SvelteKit handler. This adapter-internal Cache API layer runs only after the Worker has been invoked; it is distinct from the selected Workers Caching layer and is not counted on to skip Worker CPU or to make `workers.dev` behavior reliable. The [Cache API documentation](https://developers.cloudflare.com/workers/runtime-apis/cache/) describes functional operations for Workers on custom domains, so validate any reliance on the adapter wrapper for the actual hostname.

Cloudflare's Workers Free plan currently includes 100,000 Worker requests/day. Workers Caching hits count toward that request allowance, though the Worker code does not run on a hit. Do not interpret caching as a way to eliminate request charges or as a guarantee that the portfolio will stay below quota under arbitrary traffic.

The public `?refresh=1` bypass is intentionally unavailable. Public query strings are canonicalized with a no-store redirect. For SvelteKit data requests, only the current route tree's well-formed two-bit invalidation mask and a single recognized trailing-slash marker are retained; malformed masks and other query parameters are removed. This keeps the framework's data protocol working while bounding cache variants, rather than giving visitors an unrestricted GitHub synchronization bypass. If nested layouts are added, update the accepted mask shape and its Worker regression tests.

## Repository structure

```text
src/
├── lib/
│   ├── components/       # Navigation, GitHub status/cards, project cards, shared UI
│   ├── data/              # Typed profile, experience, skills, projects, education
│   ├── github/            # API client, normalization, response policy, fallback snapshot
│   ├── types/             # Portfolio and GitHub domain types
│   └── utils/             # SEO, formatting, and contact-draft validation
├── routes/                # SSR pages, GitHub JSON endpoint, sitemap and robots
├── hooks.server.ts        # Query canonicalization, response and security headers
└── app.css                # Reset, responsive styles, and light/dark design tokens
static/                    # CV PDF, icons, Open Graph cover, project diagrams
scripts/                   # Built Worker integration/E2E harness
tests/
├── unit/                  # Domain, normalization, cache-policy, and utility tests
├── integration/           # Server routes, response policy, rendered pages, accessibility
└── e2e/                   # Playwright tests against the built Cloudflare Worker
```

## Setup and quality checks

Requirements: Node.js 22 and npm. Install dependencies with:

```bash
npm ci --legacy-peer-deps
```

Run checks in this order:

```bash
npm run check
npm run lint
npm run test:coverage
npm run build
npx playwright install chromium
npm run test:e2e
```

`test:coverage` runs the unit and integration suites. `test:e2e` requires a prior Worker build and launches the generated adapter output with Wrangler plus a local, controlled GitHub API stub; it does not call GitHub's live API. Desktop and mobile projects exercise browser journeys, and a separate failure-mode Worker verifies the fallback UI. The CI workflow runs the same gates and installs Chromium before E2E.

`npm run verify` runs the checks, build, and E2E suite (Playwright's browser must already be installed).

## Local development and Worker preview

```bash
npm run dev       # Vite/SvelteKit development server
npm run build     # adapter-cloudflare production output
npm run preview   # Wrangler local Worker runtime + Static Assets; requires build
```

`npm run preview` uses the same Wrangler configuration and generated Worker that deployment uses. Configure `SITE_ORIGIN` in the local environment or `wrangler.jsonc` for the origin you intend to test. `SITE_ORIGIN` must be an HTTPS origin without a path, query, or fragment. The checked-in Wrangler value targets the project's `workers.dev` URL; change it to the custom production domain if one is configured.

## Deploy to Cloudflare Workers

After setting the correct `SITE_ORIGIN` and authenticating Wrangler:

```bash
npm run cf:deploy
```

This script runs `npm run build` and then `wrangler deploy`. To preview the build locally first, run `npm run preview`. The Cloudflare adapter options in `svelte.config.js` and Static Assets settings in `wrangler.jsonc` are the deployment configuration; avoid substituting a Node/Vite preview when verifying Worker behavior.

The public GitHub API works without a token at its unauthenticated rate limit. An optional server-side `GITHUB_TOKEN` may be configured with `npx wrangler secret put GITHUB_TOKEN`; never expose it through a `PUBLIC_` variable or commit it.

The contact form currently **validates and sanitizes a draft only**. It does not send or store a message; visitors should use the verified LinkedIn or GitHub links on the Contact page to get in touch.
