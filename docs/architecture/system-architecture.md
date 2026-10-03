# System Architecture & Key Decisions

## 1. Request flow

```text
HTTP request
  ├─ matching static asset (CV, icon, image, hashed client file)
  │    └─ Cloudflare Static Assets serves it before Worker code (run_worker_first: false)
  └─ SvelteKit page or API route (/ , /work, /github, /api/github, ...)
       ↓
     Cloudflare Workers Caching (cache.enabled: true)
       ├─ eligible hit: return stored response before Worker code runs
       │                (still a Worker request for quota accounting)
       └─ miss / expiry / revalidation: invoke generated adapter Worker
            ├─ adapter-internal caches.default lookup (inside Worker; not the selected cache)
            └─ SvelteKit handler
                 ├─ GitHub-backed routes call api.github.com
                 │    ├─ 4.5 s timeout; at most 20 pages of 100 repositories
                 │    ├─ validate and normalize public repository metadata
                 │    └─ on cold failure, return maintained snapshot + failure metadata
                 └─ return HTML or JSON with route Cache-Control and security headers
```

SvelteKit page routes are not assumed to be static just because a Static Assets binding exists. Pages such as `/`, `/work`, and `/github` are server-rendered and can invoke the Worker; the CV PDF, icons, images, and hashed build assets are static files. The `run_worker_first: false` setting lets Cloudflare serve matching static assets before Worker code.

**Adapter-generated cache nuance:** inspection of `.svelte-kit/cloudflare/_worker.js` shows the adapter includes a `worktop` wrapper that calls `caches.default.match()` before `server.respond()` and may `put()` eligible responses afterward. That Cache API layer executes inside the Worker; unlike Workers Caching, it does not prevent Worker invocation or CPU use. The Cloudflare Cache API docs describe functional operations for custom-domain Workers; do not assume it works equivalently for this project's `workers.dev` hostname. It is not an application-managed data cache and the selected Workers Caching response policy remains the intended front-of-Worker cache.

The four GitHub-backed routes—`/`, `/work`, `/github`, and `/api/github`—share `loadGitHubRepositories` and the same upstream validation/normalization behavior. The service has **no process-local or KV cache**. It makes a GitHub request whenever that server code runs. Response caching is configured at the Worker level, outside the service.

## 2. GitHub response and failure behavior

- A valid GitHub response, including an empty repository list, is marked `source: "github-api"` and carries an upstream `fetchedAt` timestamp.
- Repository pagination follows GitHub's `Link` header, validates same-origin next-page URLs, and stops safely after 20 pages. The unit suite covers repositories beyond page 100 and the pagination limit.
- Descriptions, languages, homepage, dates, topics, fork/archive flags, and counts are normalized into the public domain model. Explicitly private records are not exposed. Forks and archived public repositories remain represented for the UI to filter or label.
- GitHub HTTP errors/rate limits, request timeouts, malformed payloads, unsafe page links, and invalid configuration produce a **manually maintained snapshot**, `source: "fallback-snapshot"`, no live-fetch timestamp, and a safe failure message. Raw upstream response bodies are not shown.
- GitHub-backed page loads mark the rendered response `503` when live retrieval failed, while retaining the rendered fallback UI. `/api/github` returns a JSON `503` with `Retry-After: 300` for the fallback response.
- A cold Worker-cache miss has no previously cached live response to serve. In-process stale data is not claimed or returned.

## 3. ADR-001 — Keep the existing SvelteKit Cloudflare adapter

**Decision:** Continue using `@sveltejs/adapter-cloudflare` with the current options in `svelte.config.js`, and use the adapter-generated `.svelte-kit/cloudflare/_worker.js` plus the configured `ASSETS` binding in `wrangler.jsonc`.

**Verification:** Build the adapter output, run it with `wrangler dev --local`, and exercise page routes, the JSON endpoint, static files, SEO endpoints, response headers, and the GitHub failure path using a controlled local upstream stub. This verifies the generated Worker path rather than substituting Vite's Node preview. Local Wrangler tests verify application behavior and emitted headers; they do not prove a production edge cache HIT.

## 4. ADR-002 — Use Workers Caching for cacheable route responses

**Decision:** Keep `cache.enabled: true` in Wrangler and express public route freshness with standard `Cache-Control` response headers. This is Cloudflare **Workers Caching**, not the programmatic Workers Cache API, an application-level memory cache, Static Assets caching, or scheduled synchronization.

The GitHub-backed success policy is:

```text
public, max-age=1800, stale-while-revalidate=1800, stale-if-error=86400
```

The maintained-snapshot policy is:

```text
public, max-age=300, stale-while-revalidate=300
```

Other cacheable GET/HEAD pages use `PUBLIC_PAGE_CACHE_CONTROL`; non-success pages without an explicit safe policy, unsafe requests, and POST actions default to `private, no-store`. Public query strings are canonicalized with a no-store 308 redirect, and the public `?refresh=1` behavior is deliberately removed. For SvelteKit data requests, the hook reads the original request URL and retains only a well-formed two-bit invalidation mask (one root layout plus one page node in the current route tree) and a single `x-sveltekit-trailing-slash=1` marker. Malformed masks, duplicate internal parameters, and other query strings are redirected to the canonical data URL, bounding public cache variants while preserving the framework protocol. Update the mask shape and built-Worker tests if nested layouts are added.

**Trade-offs:** Cloudflare checks Workers Caching before invoking an enabled Worker. A hit avoids Worker execution and CPU, but still counts as a Worker request. Misses, expiration, revalidation, and the cold cache after a new Worker version deploy can invoke the Worker and GitHub; short response TTLs or high miss rates do not guarantee low request usage. By default, cache entries are version-scoped; enabling cross-version reuse avoids a cold start at the cost of potentially serving an older version's response until expiry or purge. A successful cached response can be returned stale within the configured stale windows as described by Cloudflare, but that is not process-local stale data and it does not make a cold miss resilient by itself. `Cf-Cache-Status` on a deployed response is the operational signal for HIT, MISS, REVALIDATED, STALE, and related states.

Cloudflare documents Workers Caching as a cache in front of the Worker, separate from the cache for outgoing `fetch()` subrequests. See [Workers Cache](https://developers.cloudflare.com/workers/cache/) and [Workers Caching configuration](https://developers.cloudflare.com/workers/cache/configuration/).

## 5. Alternatives considered

| Option | Why it was not selected |
| --- | --- |
| Workers Cache API (`caches.default`) | It is a programmatic cache API, independent of Workers Caching, and adds explicit keying/read/write/invalidation logic. Cloudflare's [Cache API documentation](https://developers.cloudflare.com/workers/runtime-apis/cache/) describes functional operations on custom-domain Workers; behavior for this project's `workers.dev` hostname must not be assumed. |
| Scheduled GitHub Actions snapshot | It avoids runtime GitHub subrequests only if the workflow updates a committed snapshot. GitHub says scheduled workflows may be delayed/dropped, run from the default branch, and can be disabled for inactive public repositories. It adds repository-write/workflow maintenance and is not a reliable real-time freshness guarantee. See [GitHub scheduled workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows). |
| Cron Trigger + KV snapshot | A scheduled `scheduled()` handler could refresh a stored snapshot, while request handlers read KV. Free quotas include KV reads/writes, but integrating the scheduled handler and KV binding with the existing SvelteKit Worker adds persistence, failure, and testing complexity. It remains an option if controlling GitHub upstream calls becomes more important than simplicity. See [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) and [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/). |

## 6. ADR-003 — Use an explicit production SEO origin

`SITE_ORIGIN` is read server-side through `$env/dynamic/private`, validated as a bare HTTPS origin, and passed to `SeoHead` through root layout data. Canonical URLs, Open Graph values, JSON-LD, `sitemap.xml`, and `robots.txt` use that configured origin, never the request `Host` header. `wrangler.jsonc` contains the current `workers.dev` origin; change it when deploying to a custom domain. A missing or invalid value falls back to the checked-in canonical origin.

## 7. ADR-004 — Editorial design tokens and accessible controls

`src/app.css` centralizes light/dark surface, text, border, accent, focus, language, and status colors in CSS custom properties. Components consume those semantic tokens while retaining route-specific editorial structure. Responsive verification checks actual document overflow; no global `overflow-x: hidden` should conceal a layout defect. Navigation dialogs, tabs, keyboard quick-jump, visible focus styles, skip navigation, reduced-motion behavior, and the theme preference are part of the interaction contract.
