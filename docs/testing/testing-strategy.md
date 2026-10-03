# Testing Strategy (TDD + STLC + V-Model)

Use **RED → GREEN → REFACTOR → REGRESSION** for meaningful behavior changes: first add a failing behavior-focused test, implement the smallest correct change, improve structure without changing behavior, then run the relevant suite and full quality gates. A passing test is not evidence for an untested Cloudflare platform behavior.

## 1. Unit tests — `tests/unit/`

Run with `npm run test:unit`; coverage is produced by `npm run test:coverage`.

High-value seams include:

- `src/lib/github/normalizer.ts`: nullable and absent fields, unsafe URLs, counts, topics, sorting, forks, archived flags, and private records.
- `src/lib/github/service.ts`: successful and empty responses, public repositories beyond page 100, pagination bounds and unsafe links, HTTP/rate-limit failures, malformed JSON/payloads, timeouts, invalid configuration, safe fallback text, and token confinement.
- `src/lib/github/cache-policy.ts`: success and snapshot `Cache-Control`, response status, source metadata, and retry headers. This is policy testing, not a simulation of Cloudflare's deployed cache.
- Portfolio domain data and SEO/contact utilities: content invariants, canonical origin validation, JSON-LD/XML escaping, and server-side draft validation/sanitization.

There is deliberately no unit-tested in-process cache module: the GitHub service does not memoize results. Workers Caching is configured by Wrangler and is tested separately through response policy plus Worker-runtime smoke tests.

## 2. Integration and component tests — `tests/integration/`

Run with `npm run test:integration` or as part of `npm run test:coverage`.

- `server-loads-and-artifacts.test.ts` exercises page loads, the GitHub JSON endpoint, fallback status, the contact action, and checked-in downloadable/static artifacts.
- `seo-and-security.test.ts` verifies configured-origin sitemap/robots, response headers, error/POST cache policy, and public query canonicalization.
- `pages-and-accessibility.test.ts` renders actual route components with representative live and fallback data, exercises filtering/sorting behavior, and runs axe-core checks. jsdom color contrast is disabled there; browser axe tests use rendered pages.

## 3. End-to-end browser tests — `tests/e2e/`

`npm run test:e2e` requires `npm run build` first. Playwright starts the generated adapter Worker through Wrangler (`wrangler dev --local`) and a controlled local GitHub API stub; a second Worker mode returns a rate-limit response. Tests never depend on GitHub availability or credentials.

The desktop and mobile projects cover:

- Home → selected work → case study → related case study.
- Skip-to-content and keyboard quick-jump; desktop navigation and the mobile drawer.
- Theme changes and persistence, project filtering, GitHub search/language/fork/sort behavior, and archived/sparse repository rendering.
- Live API and rate-limit snapshot UI, configured canonical/OG/JSON-LD/sitemap/robots origin, query-bypass rejection, PDF/static assets, contact draft validation, and 404 navigation.
- Axe scans at mobile width and horizontal-overflow checks across 390, 768, and 1280 CSS-pixel viewports for the principal routes.

These tests verify the **built Worker output locally**, including the adapter-generated Worker, Static Assets, routes, response headers, and fallback behavior. Local Wrangler does not prove production Workers Caching hit rates. Confirm a real deployed cache HIT/STALE/REVALIDATED behavior from `Cf-Cache-Status` before claiming production edge-cache behavior; that deployment observation is not replaced by a unit test.

## 4. CI quality gates

The GitHub Actions workflow runs, in order: dependency installation, SvelteKit/type checking, ESLint, Vitest unit/integration coverage, Cloudflare Worker build, Playwright Chromium installation with OS dependencies, and Playwright E2E. Playwright owns both Wrangler server lifecycles through its `webServer` configuration; the E2E harness has explicit ports, readiness URLs, separate persistence paths, and bounded startup timeouts.
