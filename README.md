# Yamkela Jojo — Personal Developer Portfolio

A production-grade, edge-deployed personal engineering portfolio for **Yamkela Jojo** — Full-Stack Developer (`Laravel/PHP`, `Vue/Nuxt`, `SvelteKit/TypeScript`, `React Native/Expo`, `Python`, `SQL`, and cloud/security tooling).

Engineered with **SvelteKit 2 + Svelte 5 + TypeScript + Bits UI + Tailwind CSS 4 + Cloudflare Workers**, targeting **R0/month** operational cost and developed using **Vertical Slice Architecture**, **Test-Driven Development (TDD)**, and **V-Model Requirements Traceability**.

---

## Architecture & Engineering Highlights

- **Edge-First Zero-Cost Architecture (`R0/month`)**: Built with `@sveltejs/adapter-cloudflare` and `wrangler.jsonc` Static Assets (`run_worker_first: false`), serving static pages and CV downloads directly from Cloudflare's edge CDN without invoking Worker CPU quotas.
- **Resilient 4-Tier GitHub Integration**: `src/lib/github/` normalizes `api.github.com/users/yamkelajojo/repos` through a clean adapter boundary (`Cache [1h TTL] -> Live GitHub REST API -> Stale Cache [24h] -> Verified Static Snapshot`), ensuring `/`, `/work`, and `/github` never break under rate-limiting or network outages.
- **Strictly Honest Career & Skill Taxonomy**: `src/lib/data/` encodes every CV claim with explicit evidence provenance (`Professional Production`, `Structured Training`, `Academic Foundation`, `Project-Verified`, `Active Exploration`), never inventing metrics or conflating learnerships with commercial employment.
- **Modern CSS Reset & Editorial Design System**: Incorporates the June 2026 revision of [Josh W. Comeau's Custom CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/) alongside custom light/dark editorial design tokens, `@media (prefers-reduced-motion: reduce)` safeguards, and `@media print` resume styles.
- **Accessible Interactive Primitives**: Built with headless WAI-ARIA compliant [Bits UI](https://www.bits-ui.com) Svelte 5 primitives (`Dialog`, `Tabs`, `Accordion`) and verified with automated `axe-core` WCAG 2.1 AA audits across every route.
- **Lightweight Hardware Footprint**: Configured with `maxWorkers: 2` and zero external runtime services (no Docker, database daemon, or separate backend), keeping memory usage comfortable on an 8 GB RAM Windows 11 development laptop.

---

## Documentation Index

| Document | Purpose |
| :--- | :--- |
| [`SPECS_PRD.md`](./SPECS_PRD.md) | Complete Software Requirements Specification, Product Requirements & Test-Driven Development Plan (Sections 1–66) |
| [`GLOSSARY.md`](./GLOSSARY.md) | Ubiquitous domain language and architectural seam definitions |
| [`docs/requirements/vertical-slices.md`](./docs/requirements/vertical-slices.md) | Tracer-bullet vertical slice decomposition (`SLICE-01` through `SLICE-06`) with blocking dependencies |
| [`docs/requirements/traceability-matrix.md`](./docs/requirements/traceability-matrix.md) | V-Model Requirements-to-Verification Traceability Matrix (`AT-001` through `AT-010`) |
| [`docs/architecture/system-architecture.md`](./docs/architecture/system-architecture.md) | System architecture diagram and Architectural Decision Records (`ADR-001` through `ADR-004`) |
| [`docs/testing/testing-strategy.md`](./docs/testing/testing-strategy.md) | TDD workflow (`RED -> GREEN -> REFACTOR`), white-box/black-box test design, and `axe-core` accessibility verification |

---

## Repository Structure

```text
├── docs/
│   ├── architecture/system-architecture.md
│   ├── requirements/traceability-matrix.md
│   ├── requirements/vertical-slices.md
│   └── testing/testing-strategy.md
├── src/
│   ├── app.css                         # Tailwind v4 + Josh W. Comeau 2026 Custom CSS Reset + tokens
│   ├── app.d.ts                        # SvelteKit platform & Cloudflare Worker types
│   ├── app.html                        # HTML shell + zero-flash theme initialization
│   ├── hooks.server.ts                 # Security headers (nosniff, SAMEORIGIN, COOP, Referrer-Policy)
│   ├── lib/
│   │   ├── components/
│   │   │   ├── experience/             # ExperienceCard
│   │   │   ├── github/                 # RepoCard
│   │   │   ├── navigation/             # Header (Bits UI Dialog mobile drawer), Footer
│   │   │   ├── projects/               # ProjectCard
│   │   │   ├── shared/                 # SeoHead (Canonical, OpenGraph, JSON-LD)
│   │   │   └── ui/                     # Icon, ContextBadge
│   │   ├── data/
│   │   │   ├── certifications.ts       # Structured certification status (AWS Cloud Practitioner — In Progress)
│   │   │   ├── education.ts            # WSU National Diploma, WeThinkCode_ NQF 5, ExploreAI NQF 5 & Kokstad NSC
│   │   │   ├── experience.ts           # CustomConnect (Junior Web Developer), ExploreAI, WeThinkCode_ & Nova Smart
│   │   │   ├── profile.ts              # Identity, positioning, narrative & contact links
│   │   │   ├── projects.ts             # 6 deep engineering case studies & 4 lab experiments
│   │   │   └── skills.ts               # Categorized skills with honest context levels
│   │   ├── github/
│   │   │   ├── cache.ts                # TTL + stale-while-revalidate memory cache
│   │   │   ├── fallback.ts             # Verified 10-repository snapshot for yamkelajojo
│   │   │   ├── normalizer.ts           # GitHub REST API payload normalizer, filter & sorter
│   │   │   └── service.ts              # Resilient 4-tier fetchUserRepositories service
│   │   ├── types/                      # Domain & GitHub TypeScript interfaces
│   │   └── utils/                      # SEO/JSON-LD, date/language formatters, contact validation
│   └── routes/
│       ├── +layout.svelte              # Global Skip-to-Content, Header, main landmark, Footer
│       ├── +error.svelte               # Accessible error boundary
│       ├── +page.{server.ts,svelte}    # Home (Hero, Credibility Strip, Featured Work, GitHub, CTA)
│       ├── work/                       # Work index (Bits UI Tabs category filter) & [slug] case studies
│       ├── about/+page.svelte          # Narrative, Bits UI Tabs skill matrix, Education, Certifications
│       ├── experience/+page.svelte     # Professional Experience vs. Structured Training + Tabs
│       ├── github/+page.{server.ts,svelte} # Live GitHub Explorer (search, language, sort, fallback banner)
│       ├── cv/+page.svelte             # Interactive web CV + PDF download + @media print layout
│       ├── contact/+page.{server.ts,svelte} # Direct channels + server-validated message composer
│       ├── labs/+page.svelte           # Interactive GitHub normalizer sandbox & domain exploration notes
│       ├── api/github/+server.ts       # JSON endpoint with edge Cache-Control headers
│       ├── sitemap.xml/+server.ts      # Dynamic XML sitemap across all canonical routes & slugs
│       └── robots.txt/+server.ts       # Robots directives & sitemap declaration
├── static/
│   ├── icons/favicon.svg
│   ├── images/                         # Open Graph cover & project architectural blueprint SVGs
│   └── resume/yamkela-jojo-cv.pdf      # Downloadable CV PDF
└── tests/
    ├── unit/                           # 10 unit & white-box test suites (data, github, utils)
    ├── integration/                    # 4 integration, server-load, artifact & axe-core accessibility suites
    └── e2e/                            # Playwright end-to-end & accessibility specification
```

---

## Local Development & Verification

### Prerequisites

- **Node.js** `>= 20.x` (verified on `v22.22.3`)
- **npm** `>= 10.x`

### Setup

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Quality Gates (Typecheck, Lint, Test Coverage, Build)

```bash
# 1. SvelteKit type sync + svelte-check
npm run check

# 2. ESLint static analysis
npm run lint

# 3. Unit, white-box, integration & axe-core accessibility tests with V8 coverage
npm run test:coverage

# 4. Production Cloudflare Worker build
npm run build
```

---

## Content Maintenance Guide

All portfolio content is strongly typed in `src/lib/data/` and guarded by unit tests in `tests/unit/data/`:

1. **Update Profile / Bio / Links**: Edit `src/lib/data/profile.ts`.
2. **Add or Update Work Experience**: Edit `src/lib/data/experience.ts`. Ensure `category` is set accurately (`'professional'` vs `'training'` vs `'apprenticeship'`).
3. **Add a Featured Case Study**: Add a `FeaturedProject` entry in `src/lib/data/projects.ts` with `slug`, `summary`, `problem`, `approach`, `architectureOverview`, `engineeringDecisions`, `stack`, and optional `githubRepoName` (which automatically links live GitHub telemetry to `/work/[slug]`).
4. **Update Skills or Certifications**: Edit `src/lib/data/skills.ts` or `src/lib/data/certifications.ts`.
5. **Replace Downloadable CV PDF**: Replace `static/resume/yamkela-jojo-cv.pdf` and keep `profile.resumePath` in `src/lib/data/profile.ts` aligned.

---

## Deployment to Cloudflare Workers (`R0/month`)

This repository is pre-configured with `@sveltejs/adapter-cloudflare` (`svelte.config.js`) and `wrangler.jsonc`:

```bash
# Build and preview locally on the Cloudflare Workers runtime
npm run preview

# Deploy to Cloudflare Workers
npm run deploy
```

Optional environment variable on Cloudflare Workers:
- `GITHUB_TOKEN`: Optional read-only GitHub personal access token (`wrangler secret put GITHUB_TOKEN`) to raise the server-side GitHub REST API rate limit from 60 requests/hour to 5,000 requests/hour. The application remains 100% functional without a token.
