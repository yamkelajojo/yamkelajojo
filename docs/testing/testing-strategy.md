# Testing Strategy (TDD + STLC + V-Model)

## 1. Testing Pyramid & V-Model Verification

1. **Unit & White-Box Testing (`tests/unit/`)**:
   - Executed via Vitest (`npm run test:unit`).
   - Targets all statements, branches, conditions, loops, and boundaries across:
     - `src/lib/github/normalizer.ts` (all optional/nullable fields, malformed inputs, sorting, topic sanitization, zero/single/many boundaries)
     - `src/lib/github/cache.ts` (cache miss, fresh hit, stale hit, expiration, manual invalidation)
     - `src/lib/github/service.ts` (upstream 200 OK, fresh cache bypass, stale fallback on 500/403/timeout, static curated fallback on cold failure, project-to-repo enrichment)
     - `src/lib/data/*.ts` (CV normalization invariants, experience type separation, skill context integrity, certification status transitions, featured project case study completeness)
     - `src/lib/utils/*.ts` (SEO canonical/meta builder, contact form validation & sanitization, date formatting)

2. **Integration & Component/Accessibility Testing (`tests/integration/`)**:
   - Executed via Vitest + `@testing-library/svelte` + `axe-core` (`npm run test:integration`).
   - Verifies component rendering, Bits UI interactions (tabs, dialogs, accordions), server load functions (`+page.server.ts`, `/api/github`, `/sitemap.xml`, `/robots.txt`), security headers (`hooks.server.ts`), and automated WCAG 2.1 AA accessibility checks via `axe-core`.

3. **End-to-End Browser Testing (`tests/e2e/`)**:
   - Specified with `@playwright/test` + `@axe-core/playwright` (`tests/e2e/portfolio.spec.ts`) across desktop (`1280×800`) and mobile (`390×844`) viewports.
   - Covers critical user journeys (`AT-001` through `AT-011`):
     - `Home → Work → Project Case Study → GitHub`
     - `Home → About → Experience`
     - `Home → CV (and PDF download)`
     - `Mobile viewport → Menu Dialog → Route Navigation`
     - `Keyboard-only navigation & focus management`
