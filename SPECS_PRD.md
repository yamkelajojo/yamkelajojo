# Personal Developer Portfolio

## Software Requirements Specification, Product Requirements & Test-Driven Development Plan

**Document Version:** 1.0
**Status:** Implementation Baseline
**Application Type:** Personal developer portfolio / public web application
**Primary Deployment:** Cloudflare Workers
**Primary Framework:** SvelteKit + Svelte 5 + TypeScript
**UI Foundation:** Bits UI
**Source Control:** GitHub
**Testing Strategy:** TDD + STLC + V-Model + White-Box + Black-Box Testing
**Initial Hosting Target:** R0 hosting cost
**Optional Domain:** `yourname.dev`

---

# 1. Purpose

The purpose of this project is to create a production-quality personal developer portfolio that presents the developer's professional work, engineering experience, GitHub repositories, technical capabilities and selected projects through a polished, responsive and highly usable web application.

The portfolio must not function merely as an online CV.

It must itself demonstrate:

* frontend engineering ability
* component architecture
* responsive UI engineering
* API integration
* data modelling
* accessibility
* performance engineering
* automated testing
* CI/CD
* production deployment
* maintainability
* engineering discipline

The website shall automatically retrieve public GitHub repository information and present it in the portfolio without requiring manual updates for ordinary repository metadata changes.

---

# 2. Product Vision

Create a fast, highly polished developer portfolio that feels like a carefully engineered product rather than a template.

The application should communicate:

> "This website is itself evidence of how I build software."

The portfolio should combine strong visual design with technically sound architecture.

The system should remain intentionally simple where complexity produces no value.

---

# 3. Core Principles

## 3.1 Requirements before implementation

No significant feature should be implemented merely because it seems useful.

Every feature must originate from an explicit requirement.

Each requirement must have:

1. acceptance criteria
2. verification method
3. corresponding tests
4. implementation
5. regression coverage

---

## 3.2 Test-Driven Development

Major functionality shall follow:

```text
Requirement
     ↓
Test specification
     ↓
Failing test
     ↓
Minimal implementation
     ↓
Passing test
     ↓
Refactor
     ↓
Regression verification
```

The implementation agent must not treat tests as an afterthought.

---

## 3.3 V-Model / STLC

The project shall use the following relationship:

```text
                    REQUIREMENTS
                         │
                         ▼
                 ACCEPTANCE TESTS
                         │
                         ▼
                  SYSTEM DESIGN
                         │
                         ▼
                   SYSTEM TESTS
                         │
                         ▼
                COMPONENT DESIGN
                         │
                         ▼
                INTEGRATION TESTS
                         │
                         ▼
                 DETAILED DESIGN
                         │
                         ▼
                    UNIT TESTS
                         │
                         ▼
                    IMPLEMENTATION
```

Testing therefore begins while requirements and architecture are being defined, not after development finishes.

---

# 4. Scope

## 4.1 In Scope

The first production version shall include:

* landing/home page
* personal introduction
* professional summary
* selected projects
* project detail pages
* GitHub repository integration
* automatic repository metadata updates
* technology information
* experience/education information
* GitHub profile access
* project repository links
* optional live-project links
* responsive navigation
* responsive layouts
* accessibility
* keyboard navigation
* responsive mobile experience
* animations and transitions
* reduced-motion support
* SEO metadata
* social metadata
* sitemap
* robots configuration
* custom 404/error handling
* automated testing
* CI/CD
* production build verification
* Cloudflare deployment

---

# 5. Explicit Non-Goals

The first version shall not unnecessarily include:

* authentication
* portfolio administrator dashboard
* user accounts
* CMS
* paid third-party database
* Python backend
* VPS hosting
* Docker-based production infrastructure
* Redis
* Kubernetes
* unnecessary microservices
* unnecessary external SaaS dependencies
* a custom backend server

A backend/API layer may exist inside the SvelteKit/Cloudflare Worker environment where functionality genuinely requires server-side execution.

---

# 6. Technology Stack

## 6.1 Application

* SvelteKit
* Svelte 5
* TypeScript

Cloudflare provides an official SvelteKit deployment path for Workers, including SSR and Worker-backed application functionality.

---

## 6.2 UI

Primary UI primitive library:

**Bits UI**

Bits UI is a headless component system for Svelte 5 that provides accessible component primitives while leaving visual styling under application control.

The application should not visually resemble an unmodified component-library template.

Bits UI components shall be used as behavioral/accessibility primitives while the portfolio's visual design system remains custom.

---

## 6.3 Styling

Use:

* Tailwind CSS
* CSS where it produces simpler or more appropriate results
* CSS custom properties/design tokens

Avoid hard-coded values when they should instead belong to the design system.

---

## 6.4 Icons

Use a lightweight open-source icon system such as Lucide where required.

---

## 6.5 Testing

### Unit / white-box

Use:

* Vitest
* coverage reporting

### Component/integration

Use appropriate Svelte testing utilities where component-level interaction requires them.

### Browser/system/E2E

Use:

* Playwright

---

## 6.6 Hosting

Deploy the application as a Cloudflare Worker with Workers Static Assets.

Cloudflare currently recommends Workers Static Assets for new full-stack/static applications rather than the older Workers Sites mechanism.

Cloudflare can deploy the Worker and static assets as a single application.

---

# 7. Hosting and Cost Requirements

## COST-001 — Zero Hosting Cost

The production application shall be designed to operate within Cloudflare's available free-tier resources for a normal personal portfolio.

Static asset delivery must use Cloudflare's static asset mechanism where appropriate.

Cloudflare currently states that requests serving static assets are free and unlimited, while requests invoking Worker code are subject to Workers usage limits.

---

## COST-002 — No Accidental Paid Usage

The application shall not intentionally depend on:

* Cloudflare Workers Paid plan
* paid database plans
* paid monitoring
* paid analytics
* paid UI libraries
* paid API services
* paid hosting services

without explicit future approval.

The repository must not contain configuration that silently changes the project into a paid architecture.

---

## COST-003 — Fail Safely at Free-Tier Limits

The architecture shall be designed so that exceeding free-tier limits does not create unexpected billing.

The project documentation must clearly identify any future action that would require upgrading an account or purchasing a service.

---

# 8. Domain Requirements

## DOMAIN-001 — Free Initial Deployment

The application shall first be accessible using the Cloudflare-provided Worker domain.

Example:

```text
https://portfolio-name.<account>.workers.dev
```

---

## DOMAIN-002 — Optional `.dev` Domain

The architecture shall support attaching a custom `.dev` domain later without modifying the application architecture.

Example:

```text
https://yamkela.dev
```

The `.dev` domain itself is a domain-registration expense and is therefore excluded from the R0 hosting objective.

The deployment target must remain Cloudflare Workers regardless of whether the application uses the default Worker hostname or a future custom domain.

---

# 9. Application Information Architecture

The initial route structure should follow:

```text
/
├── /about
├── /work
├── /work/[slug]
├── /github
├── /experience
├── /contact
└── /404
```

The exact route structure may be refined during implementation if usability or information architecture testing demonstrates a better structure.

---

# 10. Home Page Requirements

## HOME-001 — Hero

The home page shall clearly communicate:

* developer identity
* primary professional focus
* short value proposition
* primary call to action
* GitHub access
* selected work access

The hero must remain understandable without animation.

---

## HOME-002 — Selected Work

The home page shall provide access to selected projects.

Each featured project shall provide:

* project name
* short description
* technology summary
* visual representation
* project detail link
* repository link where available
* live demo link where available

---

## HOME-003 — Professional Snapshot

The home page should provide concise access to:

* technical focus
* current/recent work
* relevant technology areas
* GitHub
* CV/resume where appropriate

---

## HOME-004 — Responsive Presentation

The home page must function correctly across:

* mobile
* tablet
* laptop
* desktop
* large desktop

No important content may depend exclusively on hover.

---

# 11. Project Requirements

## PROJECT-001 — Featured Projects

Featured projects shall be manually curated.

This allows important projects to receive richer contextual presentation than automatically imported repositories.

---

## PROJECT-002 — Project Case Study

A project detail page may contain:

```text
Project overview
Problem
Context
Role
Architecture
Technology
Engineering decisions
Challenges
Testing
Results
Screenshots/media
Repository
Live application
```

Only relevant sections should be displayed for a given project.

Empty sections shall not be rendered.

---

## PROJECT-003 — GitHub Repository Reference

Where applicable, a project shall link directly to its source repository.

---

## PROJECT-004 — Automatic Repository Discovery

The application shall be capable of retrieving public repository metadata from GitHub.

Automatically retrieved repository metadata shall include, where supplied by GitHub:

```text
repository
stars
forks
language
last updated
description
topics
```

The internal application model should normalize the GitHub response rather than coupling UI components directly to the external API response.

---

# 12. GitHub Integration Architecture

The preferred data flow is:

```text
GitHub API
    │
    ▼
GitHub adapter
    │
    ▼
Repository normalization
    │
    ▼
Application domain model
    │
    ▼
UI components
```

The UI shall never depend directly on raw GitHub API response structures.

---

# 13. GitHub Repository Data Model

The normalized repository object should conceptually contain:

```ts
type GitHubRepository = {
    name: string
    fullName: string
    description: string | null
    htmlUrl: string
    homepage: string | null
    language: string | null
    stars: number
    forks: number
    topics: string[]
    createdAt: string
    updatedAt: string
    pushedAt: string | null
}
```

The actual implementation may evolve while preserving the requirements.

---

# 14. GitHub Automatic Updates

## GITHUB-001

Repository metadata shall update automatically without requiring manual editing of repository values inside the portfolio source code.

For example, if a repository's:

```text
star count
description
topics
fork count
last updated timestamp
```

changes, the portfolio should eventually reflect the new values.

---

## GITHUB-002 — Caching

The application shall not make unnecessary GitHub API requests for every page visitor.

A cache/revalidation strategy must be used.

Preferred model:

```text
Visitor
   ↓
Cloudflare Worker
   ↓
cached GitHub metadata
   │
   ├── fresh → return
   │
   └── stale → fetch GitHub
                  ↓
               normalize
                  ↓
                cache
```

---

## GITHUB-003 — Graceful Degradation

If GitHub is temporarily unavailable:

* the portfolio must continue functioning
* cached metadata should remain usable where possible
* the UI must not crash
* the visitor should not receive raw API errors

---

## GITHUB-004 — Partial Data

The UI must gracefully handle:

```text
description = null
language = null
topics = []
stars = 0
forks = 0
homepage = null
```

Missing optional data must not create broken layouts.

---

# 15. GitHub Testing Requirements

The following branches must be explicitly considered in white-box testing:

```text
repository exists
repository unavailable

description exists
description missing

language exists
language missing

topics exist
topics empty

homepage exists
homepage missing

stars > 0
stars = 0

forks > 0
forks = 0

GitHub succeeds
GitHub returns an error
GitHub returns malformed/incomplete data
```

---

# 16. Data Ownership Rules

GitHub owns:

```text
repository metadata
stars
forks
language
topics
timestamps
repository URL
```

The portfolio owns:

```text
featured status
case study
personal commentary
problem statement
architecture explanation
engineering explanation
screenshots
display order
portfolio-specific categorization
```

This separation must be maintained.

---

# 17. UI Requirements

## UI-001 — Custom Design System

The portfolio shall use a coherent internal design system.

The system should define:

* typography
* spacing
* radii
* shadows
* borders
* surfaces
* colors
* interaction states
* motion
* responsive behavior

---

## UI-002 — Bits UI

Bits UI shall be used where accessible interactive primitives are required, including appropriate components such as:

* dialog
* dropdown
* tooltip
* tabs
* accordion
* popover
* navigation interactions

Bits UI is intentionally headless, allowing the portfolio to maintain full visual control.

---

## UI-003 — No Library-Looking UI

Components must not simply inherit generic library styling.

The visual language shall be deliberately designed for the portfolio.

---

## UI-004 — Interaction States

Interactive elements must have defined:

* default
* hover
* focus
* active
* disabled
* loading
* error

states where applicable.

---

# 18. Accessibility Requirements

The portfolio shall meet practical accessibility expectations.

Requirements include:

* keyboard navigation
* visible focus
* semantic HTML
* accessible names
* appropriate ARIA only where required
* sufficient contrast
* accessible interactive controls
* reduced-motion support
* meaningful link text
* image alternative text
* no keyboard traps

Automated accessibility checks shall supplement manual verification.

---

# 19. Responsive Requirements

The application must be tested against representative viewport classes:

```text
Mobile
Tablet
Laptop
Desktop
Large desktop
```

Tests must verify:

* navigation
* hero
* project cards
* project pages
* typography
* media
* footer
* interactive controls

No horizontal scrolling should occur unless explicitly intended.

---

# 20. Motion Requirements

Animations should improve comprehension and perceived quality rather than exist merely for decoration.

Animations must:

* have coherent timing
* not interfere with interaction
* not delay access to content unnecessarily
* preserve usability
* support reduced-motion preferences

A reduced-motion mode shall remove or significantly reduce non-essential animation.

---

# 21. Performance Requirements

Performance is a first-class requirement.

The application shall:

* optimize images
* avoid unnecessary JavaScript
* lazy-load non-critical media where appropriate
* minimize client-side work
* avoid unnecessary dependencies
* avoid blocking the initial render
* use static asset delivery whenever practical
* keep dynamic Worker execution limited to actual server-side requirements

Cloudflare's current Workers model allows static assets and Worker code to operate together, making it appropriate to keep static content on the asset path and reserve Worker execution for dynamic functionality.

---

# 22. SEO Requirements

The application shall provide:

* page titles
* meta descriptions
* canonical URLs where appropriate
* Open Graph metadata
* Twitter/X metadata where appropriate
* sitemap
* robots configuration
* meaningful semantic headings
* crawlable project pages

Each project detail page must have page-specific metadata.

---

# 23. Error Handling

The application shall gracefully handle:

```text
GitHub unavailable
GitHub timeout
unexpected API response
invalid project data
missing images
invalid project slug
unknown route
Worker/API failure
```

Errors must never expose sensitive implementation details.

---

# 24. Security Requirements

The application shall:

* never expose secrets in client-side JavaScript
* never commit API tokens
* use environment bindings/secrets for sensitive server-side values
* validate externally received data
* sanitize untrusted content where required
* avoid unnecessary server-side capabilities
* avoid exposing internal errors

Public GitHub repository data may be displayed without secret credentials where technically appropriate.

---

# 25. SEO, Accessibility and Security Are Acceptance Requirements

These are not optional polish tasks.

A feature shall not be considered complete if it functions visually but:

* fails keyboard navigation
* exposes a secret
* breaks mobile layouts
* produces invalid accessible names
* causes avoidable severe performance issues
* exposes raw internal errors

---

# 26. Testing Strategy

Testing shall combine:

### Black-box testing

Tests based on requirements and expected system behavior.

### White-box testing

Tests derived from internal:

* statements
* branches
* conditions
* paths
* loops
* data handling

### Unit testing

Individual functions/components.

### Integration testing

Interactions between modules.

### System testing

The complete deployed application.

### Acceptance testing

Verification against the original product requirements.

### Regression testing

Previously verified behavior must remain functional after modifications.

---

# 27. White-Box Coverage Strategy

Coverage shall focus on meaningful engineering risk.

The project should measure:

* statement coverage
* branch coverage
* function coverage
* condition coverage where appropriate

100% coverage shall not be treated as the sole definition of quality.

Critical business/data paths require stronger testing than trivial presentation code.

---

# 28. Example White-Box Test

For a repository metadata mapper:

```text
Input:
GitHub repository with:
description = "Example"
language = "TypeScript"
topics = ["svelte", "portfolio"]
stars = 10
forks = 2
```

Expected normalized output:

```text
description = "Example"
language = "TypeScript"
topics = ["svelte", "portfolio"]
stars = 10
forks = 2
```

Additional tests:

```text
description = null
language = null
topics = []
stars = 0
forks = 0
```

---

# 29. Boundary Testing

Boundary tests shall include appropriate cases such as:

```text
0 repositories
1 repository
many repositories

0 stars
1 star
large star count

0 forks
1 fork
large fork count

0 topics
1 topic
many topics

empty description
short description
long description
```

List rendering shall be tested with enough items to expose layout problems.

---

# 30. Integration Testing

Integration tests shall verify flows such as:

```text
GitHub response
      ↓
adapter
      ↓
normalizer
      ↓
portfolio data
      ↓
component
      ↓
rendered repository card
```

The tests should verify not only individual functions but whether modules communicate correctly.

---

# 31. Browser / E2E Testing

Playwright shall verify important visitor journeys.

### Example:

```text
Open /
   ↓
Hero visible
   ↓
Select Work
   ↓
Work page loads
   ↓
Select project
   ↓
Project page loads
   ↓
GitHub link available
   ↓
Navigate back
   ↓
Application remains functional
```

---

# 32. Mobile Browser Testing

At minimum, Playwright verification shall include representative mobile dimensions.

Tests shall cover:

* navigation
* menu
* scrolling
* project cards
* project detail pages
* buttons/links
* images
* footer

---

# 33. Accessibility Testing

Automated browser checks should verify major accessibility concerns.

Manual verification shall also be performed for:

* keyboard flow
* focus behavior
* navigation order
* reduced motion
* semantic structure

---

# 34. Visual Regression

Visual regression testing should be used selectively for important stable surfaces.

Candidates:

* homepage hero
* main navigation
* selected-project cards
* project detail hero
* mobile navigation
* major responsive layouts

Visual tests must not become so brittle that ordinary harmless content changes constantly fail CI.

---

# 35. Test Naming Standard

Tests should describe behavior.

Prefer:

```text
displays cached repository metadata when GitHub is unavailable
```

rather than:

```text
testGithub2
```

Requirements should map to tests through stable identifiers.

Example:

```text
GITHUB-003
   ↓
TEST-GITHUB-003-A
TEST-GITHUB-003-B
TEST-GITHUB-003-C
```

---

# 36. Requirement Traceability

The project shall maintain traceability:

```text
Requirement
    ↓
Acceptance Criterion
    ↓
System Test
    ↓
Integration Test
    ↓
Unit/White-Box Tests
    ↓
Implementation
```

A feature should not be marked complete without demonstrating this relationship.

---

# 37. Example Traceability Matrix

| Requirement               | Unit | Integration | E2E | Acceptance |
| ------------------------- | ---- | ----------- | --- | ---------- |
| HOME-001 Hero             | ✓    | —           | ✓   | ✓          |
| PROJECT-001 Featured work | ✓    | ✓           | ✓   | ✓          |
| GITHUB-001 Auto update    | ✓    | ✓           | ✓   | ✓          |
| GITHUB-003 GitHub failure | ✓    | ✓           | ✓   | ✓          |
| UI-002 Bits UI            | —    | ✓           | ✓   | ✓          |
| Accessibility             | —    | —           | ✓   | ✓          |
| Responsive layout         | —    | —           | ✓   | ✓          |
| SEO                       | —    | ✓           | ✓   | ✓          |
| Error handling            | ✓    | ✓           | ✓   | ✓          |

---

# 38. CI/CD Pipeline

Every pull request should execute the applicable quality gates.

Preferred sequence:

```text
Git push
   ↓
Install dependencies
   ↓
Type check
   ↓
Lint
   ↓
Unit tests
   ↓
Coverage
   ↓
Integration tests
   ↓
Production build
   ↓
Browser/E2E tests
   ↓
Accessibility checks
   ↓
Deployment eligibility
```

A failed critical test shall prevent production deployment.

---

# 39. Production Deployment

The production deployment shall target Cloudflare Workers.

The application shall use the current SvelteKit/Cloudflare integration rather than legacy Workers Sites infrastructure. Cloudflare's current documentation provides direct SvelteKit deployment through Workers and Wrangler.

---

# 40. Deployment Environments

At minimum:

```text
Local
Preview
Production
```

The project should support testing changes before production.

---

# 41. Environment Variables

Environment configuration shall distinguish:

```text
PUBLIC_*
server-only secrets
deployment configuration
```

No secret may be exposed through public SvelteKit environment variables.

---

# 42. Repository Structure

Suggested structure:

```text
portfolio/
│
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── navigation/
│   │   │   ├── projects/
│   │   │   ├── github/
│   │   │   └── shared/
│   │   │
│   │   ├── data/
│   │   ├── github/
│   │   ├── utils/
│   │   └── types/
│   │
│   ├── routes/
│   │   ├── +page.svelte
│   │   ├── about/
│   │   ├── work/
│   │   ├── github/
│   │   ├── experience/
│   │   ├── contact/
│   │   └── api/
│   │
│   └── app.html
│
├── static/
│   ├── images/
│   ├── resume/
│   └── icons/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   ├── requirements/
│   ├── architecture/
│   └── testing/
│
├── package.json
├── svelte.config.js
├── vite.config.ts
├── wrangler.jsonc
└── README.md
```

The final structure may change where justified by the implementation.

---

# 43. Dependency Principles

Every dependency must justify its existence.

Before installing a package, determine:

1. Is native Svelte/browser functionality sufficient?
2. Is the functionality already provided by SvelteKit?
3. Is Bits UI sufficient?
4. Does the dependency materially improve maintainability?
5. Does it increase bundle size?
6. Does it introduce unnecessary security or maintenance risk?
7. Does it introduce a paid service or external dependency?

Avoid dependency accumulation.

---

# 44. Design Requirements

The portfolio should be:

* modern
* professional
* distinctive
* restrained
* technically credible
* responsive
* fast
* accessible

Avoid:

* excessive gradients
* generic AI-dashboard aesthetics
* excessive glassmorphism
* animation for its own sake
* enormous text that makes the website difficult to navigate
* overuse of cards
* visual clutter
* template-like layouts

The design should make the work the primary subject.

---

# 45. GitHub Presentation Requirements

A repository card should be capable of displaying:

```text
Repository name
Description
Primary language
Stars
Forks
Topics
Last updated
```

Example conceptual presentation:

```text
CHECKSTAR

Digital supermarket platform...

Vue · Laravel · TypeScript

★ 12    Forks 3

supermarket
laravel
vue
typescript

Updated 3 days ago

[View project] [GitHub]
```

The exact visual implementation is determined during UI design.

---

# 46. Data Freshness

Repository metadata does not need to update in real time.

The acceptable requirement is:

> Changes to public GitHub metadata should propagate automatically within the application's configured revalidation window without requiring a source-code change.

The initial revalidation strategy should prioritize:

* low GitHub API usage
* low Worker execution
* resilience
* acceptable freshness

rather than real-time synchronization.

---

# 47. Failure State Requirements

If GitHub metadata cannot be retrieved:

The UI shall prefer:

```text
cached data
```

then:

```text
static portfolio metadata
```

then:

```text
graceful unavailable state
```

It shall not present:

```text
500 GitHub API Error
```

to normal visitors.

---

# 48. Observability

Production issues should be diagnosable without creating unnecessary paid dependencies.

The application should provide:

* structured server-side logging where useful
* meaningful error messages
* environment-aware logging
* deployment visibility
* client-safe error handling

Avoid logging:

* secrets
* tokens
* unnecessary personal data

---

# 49. Resume/CV

The portfolio may expose a downloadable PDF CV.

The file should:

* be accessible
* have a meaningful filename
* open correctly
* not block page loading
* have an appropriate link label

The CV is a static asset and should be served through the static delivery path.

---

# 50. Contact Functionality

The initial portfolio may provide:

```text
email link
GitHub
LinkedIn
other professional links
```

A custom contact form should only be introduced if there is a justified backend/email delivery architecture that remains compatible with the project's cost requirements.

A contact form must not be implemented merely to make the site look more complete.

---

# 51. Security Testing

Tests should cover:

* secret exposure
* unsafe rendering
* malformed external data
* invalid routes
* unexpected API responses
* server error leakage
* unauthorized access to any server-only functionality

---

# 52. Performance Acceptance Criteria

The application shall not introduce unnecessary client-side processing.

Performance review must explicitly inspect:

* bundle size
* JavaScript execution
* image payloads
* font loading
* third-party requests
* API request frequency
* animation cost
* mobile performance

The application should remain useful if non-essential external services fail.

---

# 53. Definition of Done

A feature is **not done** merely because it works manually.

A feature is complete when:

```text
Requirement exists
        AND
Acceptance criteria exist
        AND
Tests exist
        AND
Tests failed before implementation where TDD applies
        AND
Implementation exists
        AND
Unit/white-box tests pass
        AND
Integration tests pass
        AND
Relevant E2E tests pass
        AND
Responsive behavior verified
        AND
Accessibility considered
        AND
Error states verified
        AND
Production build passes
        AND
No regression introduced
```

---

# 54. Definition of Production Ready

The portfolio is production-ready when:

* all critical requirements are implemented
* all critical tests pass
* production build succeeds
* CI succeeds
* E2E tests succeed
* responsive layouts are verified
* accessibility checks pass
* critical GitHub integration paths work
* GitHub failure handling works
* no secrets are exposed
* SEO requirements are satisfied
* static assets load correctly
* Cloudflare deployment succeeds
* production URL is accessible
* no known critical defects remain

---

# 55. Development Phases

## Phase 0 — Repository and Tooling

Establish:

* SvelteKit
* TypeScript
* Bits UI
* styling system
* testing framework
* Playwright
* linting
* formatting
* Cloudflare configuration
* CI baseline

No visual polish should be prioritized before the engineering foundation works.

---

## Phase 1 — Requirements and Architecture

Produce:

* route map
* component architecture
* data models
* GitHub integration design
* caching design
* testing strategy
* traceability matrix

---

## Phase 2 — Core Shell

Implement and test:

* root layout
* navigation
* responsive navigation
* footer
* typography
* design tokens
* global accessibility behavior
* page transition system

---

## Phase 3 — Home Page

Implement:

* hero
* selected projects
* professional summary
* calls to action

Complete corresponding unit, integration and E2E tests.

---

## Phase 4 — Projects

Implement:

* project model
* featured projects
* project listing
* project detail pages
* project case-study structure

---

## Phase 5 — GitHub Integration

Implement:

```text
GitHub API adapter
      ↓
normalization
      ↓
cache/revalidation
      ↓
repository UI
```

Develop tests before or alongside each implementation stage.

---

## Phase 6 — Quality Engineering

Perform:

* white-box analysis
* branch coverage review
* integration verification
* accessibility verification
* responsive testing
* E2E testing
* visual regression review
* performance review
* security review

---

## Phase 7 — Production Deployment

Deploy to:

```text
*.workers.dev
```

Verify the production application.

Then optionally attach:

```text
yourname.dev
```

without modifying the core application architecture.

---

# 56. Initial Acceptance Test Suite

The initial release should contain at least the following acceptance scenarios.

### AT-001 — Homepage

```text
Given a visitor opens the portfolio
When the homepage loads
Then the identity, professional positioning and primary navigation are visible
And the page is usable without JavaScript-dependent animation
```

### AT-002 — Responsive Navigation

```text
Given a mobile viewport
When the visitor opens navigation
Then the navigation is accessible
And all primary destinations can be reached
And no content is clipped
```

### AT-003 — Featured Project

```text
Given a featured project exists
When the visitor selects it
Then the corresponding project page opens
And project information is displayed
And repository/live links are available when configured
```

### AT-004 — GitHub Metadata

```text
Given a public repository exists
When repository information is retrieved
Then the portfolio displays the supported repository metadata
```

### AT-005 — Automatic Update

```text
Given repository metadata changes on GitHub
When the portfolio's cache becomes eligible for revalidation
Then subsequent visitors eventually receive the updated metadata
without modifying portfolio source code
```

### AT-006 — GitHub Failure

```text
Given GitHub is unavailable
When a visitor loads repository information
Then the portfolio remains usable
And cached or fallback information is displayed where available
And no raw server error is exposed
```

### AT-007 — Accessibility

```text
Given a keyboard-only visitor
When they navigate the application
Then every critical interactive function is reachable and usable
```

### AT-008 — Production Build

```text
Given the complete project
When the production build executes
Then the build completes successfully
And the generated application can be deployed to Cloudflare
```

### AT-009 — Deployment

```text
Given all required CI checks pass
When the production deployment executes
Then the Cloudflare deployment succeeds
And the public application responds successfully
```

---

# 57. Engineering Agent Instructions

Any AI coding agent working on this repository shall follow these rules.

## Rule 1

Do not immediately start modifying code.

First inspect:

* repository
* existing files
* package configuration
* test configuration
* deployment configuration
* documentation
* requirements

---

## Rule 2

Before implementing a significant feature:

1. identify the requirement
2. define acceptance criteria
3. identify relevant tests
4. implement tests
5. implement the smallest correct solution
6. run tests
7. review the implementation
8. refactor if justified
9. run regression tests

---

## Rule 3

Do not remove or weaken tests merely to make a build pass.

---

## Rule 4

Do not disable linting, type checking, coverage or E2E tests merely because they expose implementation problems.

---

## Rule 5

Do not install a package simply because it is convenient.

Investigate whether the existing stack already solves the problem.

---

## Rule 6

Do not introduce paid infrastructure without explicit approval.

---

## Rule 7

Do not overengineer.

The simplest architecture satisfying the requirements is preferred.

---

## Rule 8

Before considering a feature complete, inspect the resulting UI manually and through automated browser testing.

A passing unit-test suite does not establish that the application is visually or interactively correct.

---

# 58. Agent Self-Review Requirement

Before declaring implementation complete, the agent must review:

### Functional

* Does the feature satisfy the requirement?

### Structural

* Is the architecture coherent?
* Are concerns appropriately separated?

### Testing

* Are important branches tested?
* Are failure states tested?
* Are boundary conditions tested?

### UI

* Does it look intentional?
* Does it work on mobile?
* Does it work with keyboard navigation?
* Does it handle loading/error/empty states?

### Performance

* Did this introduce unnecessary JavaScript?
* Did it introduce unnecessary requests?

### Security

* Are secrets protected?
* Is external data handled safely?

### Maintenance

* Is the implementation understandable?
* Is the code more complex than necessary?

---

# 59. Final Architectural Principle

The portfolio must remain architecturally capable without becoming architecturally complicated.

The intended final system is:

```text
                         GITHUB
                            │
                            │ public repository data
                            ▼
                    ┌───────────────┐
                    │ GitHub Adapter│
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Normalization │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Cache / Data  │
                    └───────┬───────┘
                            │
                            ▼
┌───────────────────────────────────────────────────┐
│                    SVELTEKIT                       │
│                                                   │
│  Home │ About │ Work │ Projects │ GitHub │ CV   │
│                                                   │
│              Bits UI + Custom Design              │
│                                                   │
└──────────────────────────┬────────────────────────┘
                           │
                           ▼
                  CLOUDFLARE WORKERS
                           │
              ┌────────────┴─────────────┐
              │                          │
              ▼                          ▼
       Static Assets                Dynamic APIs
              │                          │
              └────────────┬─────────────┘
                           ▼
                       INTERNET
                           │
                           ▼
                  portfolio.workers.dev
                           │
                    optional later
                           ▼
                       yourname.dev
```

Cloudflare's current Workers architecture explicitly supports combining static assets with Worker logic, and its current SvelteKit guide supports deploying SvelteKit directly to Workers.

---

# 60. Release Standard

The portfolio shall be considered a successful implementation only when it demonstrates all three dimensions simultaneously:

```text
              ┌─────────────────┐
              │   ENGINEERING   │
              │                 │
              │ architecture    │
              │ testing         │
              │ CI/CD           │
              │ security        │
              └────────┬────────┘
                       │
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌─────────────────┐          ┌─────────────────┐
│      DESIGN     │          │    EXPERIENCE   │
│                 │          │                 │
│ visual system   │          │ responsive      │
│ typography      │          │ accessible      │
│ motion          │          │ fast            │
│ hierarchy       │          │ intuitive       │
└─────────────────┘          └─────────────────┘
```

None of these dimensions should be treated as a substitute for another.

A visually impressive portfolio with weak engineering is incomplete.

A technically sound portfolio that looks unfinished is also incomplete.

The target is a portfolio that functions as a **live demonstration of engineering quality**.

---

# 61. Source-of-Truth Rule

This document shall be treated as the baseline product specification.

When implementation decisions conflict with the requirements:

1. identify the conflict
2. inspect the relevant requirement
3. update the requirement if the product decision genuinely changed
4. update tests
5. update implementation
6. rerun regression testing

The implementation must not silently redefine the product requirements.

---

# 62. Initial Success Definition

The project succeeds when a stranger can receive the public URL, open it without installation or account creation, understand who the developer is, inspect meaningful projects, inspect current GitHub work, navigate the site comfortably on desktop and mobile, and perceive the website itself as evidence of competent software engineering.

The application must achieve this while maintaining a deliberately low-cost infrastructure architecture and a rigorous TDD/STLC/V-Model development process.
