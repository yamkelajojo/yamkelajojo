# Vertical Slice Decomposition (`to-issues` / `to-tickets`)

Following Matt Pocock's `to-issues` / `to-tickets` tracer-bullet methodology, the PRD (`SPECS_PRD.md` v1.1) is decomposed into six small, independently verifiable vertical slices. Each slice cuts end-to-end across types, domain/data, server/API, UI, and automated verification.

---

## SLICE-01: Foundation, CSS Reset & Accessible App Shell

- **Requirements**: `UI-001`, `UI-002`, `UI-003`, `UI-004`, `A11Y-001`, `SEO-001`, `DEPLOY-001`
- **Blocked by**: None (can start immediately)
- **What to build**:
  End-to-end application shell running on SvelteKit 2 + Svelte 5 + TypeScript + Tailwind CSS v4 + Bits UI + Cloudflare Workers adapter (`wrangler.jsonc`), styled with Josh W. Comeau's current (June 2026) Modern CSS Reset and custom editorial design tokens, complete with keyboard-accessible navigation, Bits UI mobile navigation dialog, `⌘K` quick-navigation dialog, theme switcher, skip-to-content link, and SEO head manager.
- **Acceptance Criteria**:
  - [x] Josh W. Comeau's 2026 CSS reset applied (`*:not(dialog) { margin: 0; }`, `interpolate-size: allow-keywords`, `text-wrap: pretty/balance`, `#sveltekit-root { isolation: isolate; }`) without breaking `<dialog>` or Bits UI primitives.
  - [x] Primary navigation links (`Home`, `Work`, `About`, `Experience`, `GitHub`, `CV`, `Contact`) render with active route indication on desktop and inside a Bits UI `Dialog` drawer on mobile.
  - [x] Keyboard skip link, visible focus rings, theme toggle, and `⌘K` command dialog operate without keyboard traps.

---

## SLICE-02: Structured CV Domain Model & Content Integrity

- **Requirements**: `PROFILE-001`, `PROFILE-002`, `EXP-001`, `EXP-002`, `EDU-001`, `SKILL-001`, `CERT-001`
- **Blocked by**: `SLICE-01`
- **What to build**:
  Typed, normalized CV domain modules (`profile.ts`, `experience.ts`, `education.ts`, `skills.ts`, `certifications.ts`) and pure query helpers that distinguish `professional`, `training`, and `apprenticeship` experiences, group skills into the 8 required domains with honest context labels (no fake percentages), weight tertiary/learnership education above secondary schooling, and model certification status (`AWS Cloud Practitioner — In Progress`) as structured data.
- **Acceptance Criteria**:
  - [x] CustomConnect (`May 2024 – Present`, `professional`), ExploreAI Academy (`Sep 2023 – Aug 2024`, `training`), WeThinkCode_ (`Sep 2022 – Dec 2023`, `training`), and Nova Smart Technologies (`Dec 2021 – Mar 2022`, `apprenticeship`) are accurately represented without duplicate CV typos.
  - [x] Skills are grouped into the 8 PRD categories with explicit `context` (`professional`, `hands-on`, `training`, `learning`, `exploring`) and zero invented percentage metrics.
  - [x] Security skills (`Kali Linux`, `Bash`, `Metasploit Framework`, `Nmap`, `Wireshark`, `Hashing`, `Asymmetric Encryption`) are explicitly framed as security/systems skills and interests, never as professional pentesting employment.
  - [x] Unit & white-box tests verify all data invariants, filtering, and certification status transitions.

---

## SLICE-03: GitHub Adapter, Normalizer, Cache & Resilient API

- **Requirements**: `GITHUB-001`, `GITHUB-002`, `GITHUB-003`, `GITHUB-004`, `COST-001`, `COST-002`, `COST-003`
- **Blocked by**: `SLICE-01`
- **What to build**:
  End-to-end GitHub integration pipeline (`GitHub API → adapter → normalizer → TTL/SWR cache → fallback snapshot → SvelteKit server load & /api/github → UI`) that retrieves `github.com/yamkelajojo` public repositories, normalizes every field, caches responses to avoid per-visitor API calls, and degrades gracefully when GitHub is slow, rate-limited, or unreachable.
- **Acceptance Criteria**:
  - [x] Raw GitHub payloads normalize to `GitHubRepository` (`name`, `fullName`, `description`, `htmlUrl`, `homepage`, `language`, `stars`, `forks`, `topics`, `createdAt`, `updatedAt`, `pushedAt`).
  - [x] Missing fields (`description: null`, `language: null`, `homepage: ""`, missing `topics`), boundary counts (`0`, `1`, `many`), and malformed payloads are handled safely without throwing.
  - [x] Cache prevents redundant upstream requests within TTL and serves stale or curated snapshot data with explicit status metadata (`live` | `cached` | `stale` | `fallback`) on upstream failure.
  - [x] White-box unit and integration tests cover all branches and boundary cases in `SPECS_PRD.md` Section 48.

---

## SLICE-04: Featured Projects, Case Studies & Work Discovery

- **Requirements**: `PROJECT-001`, `PROJECT-002`, `PROJECT-003`, `PROJECT-004`
- **Blocked by**: `SLICE-02`, `SLICE-03`
- **What to build**:
  Curated Featured Projects (`yamkelajojo` portfolio, `greenbidder`, `odin-recipes`, `climate-sentiment-classifier`, `movie-recommender-system`, `dojo-drumkit-studio`) plus `/work` index (with Bits UI domain filter tabs and live GitHub repository enrichment) and `/work/[slug]` reusable case-study detail pages.
- **Acceptance Criteria**:
  - [x] Featured projects separate curated engineering case studies from auto-discovered GitHub repositories while merging live GitHub stats (`stars`, `forks`, `updatedAt`, `language`) by repository name.
  - [x] `/work/[slug]` renders only verified case-study sections that exist for a project and never fabricates metrics.
  - [x] Portfolio itself appears as a featured project (`SPECS_PRD.md` Section 20).

---

## SLICE-05: Full Narrative Experience — Home, About, Experience, GitHub, CV, Contact & Labs

- **Requirements**: `HOME-001`..`004`, `AT-001`..`AT-010`
- **Blocked by**: `SLICE-02`, `SLICE-03`, `SLICE-04`
- **What to build**:
  Complete user-facing pages for `/`, `/about`, `/experience`, `/github`, `/cv` (plus downloadable `/resume/yamkela-jojo-cv.pdf`), `/contact`, and `/labs`.
- **Acceptance Criteria**:
  - [x] Homepage (`AT-001`) communicates software engineering positioning, selected work, technical areas, experience snapshot, live GitHub activity, and CTA without dumping the full CV.
  - [x] About (`AT-002`) & Experience (`AT-003`) tell a coherent career narrative and clearly distinguish professional work from structured training.
  - [x] GitHub (`AT-005`..`007`) provides search, language/topic filtering, sorting, and resilient status display.
  - [x] CV (`AT-008`) provides both an interactive web CV view and a valid downloadable PDF at `/resume/yamkela-jojo-cv.pdf`, linked from Navigation, About, CV, and Contact.

---

## SLICE-06: SEO, Security Headers, CI/CD & Production Readiness Verification

- **Requirements**: `SEO-001`, `PERF-001`, `SEC-001`, `DEPLOY-001`, `TEST-001`, `AT-011`
- **Blocked by**: `SLICE-05`
- **What to build**:
  `/sitemap.xml`, `/robots.txt`, security headers (`hooks.server.ts`), GitHub Actions CI/CD workflow (`.github/workflows/ci.yml`), Cloudflare Worker production build verification, and full V-Model test verification (unit, white-box coverage, integration, accessibility `axe-core`, and E2E journeys).
- **Acceptance Criteria**:
  - [x] `npm run check`, `npm run lint`, `npm run test:coverage`, and `npm run build` pass with zero errors.
  - [x] Cloudflare Worker bundle `.svelte-kit/cloudflare/_worker.js` is generated and verified.
  - [x] Automated accessibility (`axe-core`) and responsive/keyboard checks pass across routes.
