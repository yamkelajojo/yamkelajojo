# Personal Developer Portfolio

## Software Requirements Specification, Product Requirements & Test-Driven Development Plan

**Document Version:** 1.1
**Status:** Implementation Baseline
**Application Type:** Personal developer portfolio / public web application
**Primary Framework:** SvelteKit + Svelte 5 + TypeScript
**UI Foundation:** Bits UI
**Styling:** Tailwind CSS + custom design system
**Hosting:** Cloudflare Workers
**Source Control:** GitHub
**Testing:** TDD + STLC + V-Model + White-Box + Black-Box + E2E
**Initial Hosting Target:** R0 hosting cost
**Future Domain:** `.dev` custom domain
**Primary GitHub:** `github.com/yamkelajojo`

---

# 1. Product Purpose

The portfolio is a production-quality personal website that presents the developer's work, experience, technical capabilities, education, projects and professional progression.

It must function as both:

1. a practical professional portfolio for recruiters, employers and collaborators; and
2. a live demonstration of the developer's engineering ability.

The website itself should demonstrate:

* frontend development
* full-stack development
* application development
* API integration
* responsive UI engineering
* data handling
* testing
* CI/CD
* accessibility
* performance engineering
* production deployment
* GitHub integration
* maintainable software architecture

The portfolio must not feel like a static online CV.

---

# 2. Developer Profile

The content architecture must reflect the developer's actual background.

## 2.1 Primary Professional Identity

The primary professional positioning is:

> **Full-stack/software developer with professional web development experience and broader experience across application development, data science and emerging cybersecurity/cloud technologies.**

The portfolio should prioritize software development as the central professional identity.

---

# 3. Professional Narrative

The website should communicate the progression:

```text
Information Technology
        ↓
Software Development
        ↓
Full-Stack Web Development
        ↓
Data Science / Machine Learning
        ↓
Broader Application Development
        ↓
Cybersecurity + Cloud interests
```

This progression should feel intentional rather than presenting unrelated technologies.

The portfolio must avoid implying that all listed technologies represent equal levels of professional experience.

For example:

```text
Professional experience
        ≠
Training experience
        ≠
Personal experimentation
        ≠
Current learning
```

The content model must distinguish these categories.

---

# 4. Professional Experience

The portfolio shall represent the following experience history supplied in the CV.

## 4.1 CustomConnect

**Role:** Junior Web Developer
**Location:** Durban
**Period:** May 2024 – Present

Professional experience should emphasize:

### Full-stack web development

* Laravel
* PHP
* application routing
* backend development
* frontend/backend integration
* internal business platforms

### Frontend development

* Vue.js
* Tailwind CSS
* Bootstrap
* custom CSS
* component-based development
* reusable UI

### Database

* MySQL
* Laravel database integration
* application data management

### Collaboration

* standups
* Microsoft Teams
* collaboration with CEO
* Data Analysts
* IT leadership
* business process improvement

### Business systems

Examples of work represented in the CV include:

* asset ticket logging
* employee dashboards
* internal business platforms

The portfolio should convert this into outcome-oriented descriptions where verified.

It should not invent metrics or business outcomes that are not supported by the CV or project records.

---

# 5. Data Science Experience

## 5.1 ExploreAI Academy

**Program:** Full Stack Data Science Learnership
**Location:** Durban
**Period:** September 2023 – August 2024

The portfolio should represent this as structured technical training and practical experience rather than professional employment.

Relevant areas:

* machine learning
* predictive modelling
* linear and multiple regression
* decision trees
* random forests
* natural language processing
* unsupervised learning
* clustering
* anomaly detection
* Kaggle competitions
* hackathons
* Python
* Pandas
* Matplotlib
* Jupyter
* Streamlit
* data visualization
* Power BI
* data storytelling
* Git
* project collaboration

The portfolio should distinguish this from the developer's professional employment experience.

---

# 6. Software Development Experience

## 6.1 WeThinkCode_

**Program:** Full Stack Software Development Learnership
**Location:** Durban
**Period:** September 2022 – December 2023

Areas to represent:

* Test-Driven Development
* Java
* Python
* networking
* client/server applications
* protocols
* Docker
* Maven
* JVM
* package management
* SQLite
* JDBC
* Flutter
* Dart
* Git
* GitLab
* software collaboration
* software testing
* PyQt5
* security fundamentals

The portfolio should particularly highlight the fact that structured software testing and TDD are part of the developer's training background.

This directly reinforces the engineering philosophy of this portfolio itself.

---

# 7. Earlier Web Development Experience

## 7.1 Nova Smart Technologies

**Role:** Web Developer Apprentice
**Location:** Durban
**Period:** December 2021 – March 2022

Relevant areas:

* WordPress
* web design
* Figma
* plugin integration
* SEO
* MySQL
* content management

This should appear lower in the experience timeline while still contributing to the overall development progression.

---

# 8. Education

The portfolio shall represent:

## National Diploma: Information Technology — Applications Development

**Walter Sisulu University**
January 2019 – December 2021

Relevant technical areas:

* Java
* Oracle
* VB.NET
* C#
* GUI development
* information systems
* system software
* application development

---

## NQF Level 5 Qualification: Systems Development

**WeThinkCode_**
January 2022 – December 2023

---

## NQF Level 5 Qualification

**ExploreAI Academy, South Africa**
September 2023 – August 2024

---

## Grade 12 NSC

**Kokstad College**
January 2013 – December 2017

Relevant subjects should only be displayed if they contribute meaningfully to the professional story.

The portfolio should not give secondary-school information the same visual weight as tertiary education or professional experience.

---

# 9. Certification

The CV currently identifies:

**AWS Cloud Practitioner — In Progress**

Because certification status can change over time, the website should model certification status as data rather than hard-coded prose.

Example:

```text id="g9q7f3"
Certification
├── name
├── provider
├── status
├── date
├── credentialUrl
└── verificationUrl
```

Possible statuses:

```text
In Progress
Completed
Expired
Planned
```

The portfolio must not continue displaying "In Progress" after certification completion without the content being updated.

---

# 10. Technical Skill Model

Rather than displaying one giant list of technologies, skills should be grouped by area.

## Software Development

* Java
* Python
* PHP
* JavaScript
* TypeScript where applicable
* HTML
* CSS

## Web Development

* Laravel
* Vue.js
* Nuxt.js
* React.js
* SvelteKit for the portfolio itself
* Tailwind CSS

## Data Science

* Python
* Pandas
* Matplotlib
* Streamlit
* machine learning
* data visualization
* Power BI
* Jupyter

## Databases

* MySQL
* SQLite
* Oracle
* SQL
* JDBC

## Mobile / Application Development

* Flutter
* Dart
* application development

## Testing / Engineering

* Test-Driven Development
* unit testing
* integration testing
* Git
* GitLab
* Docker
* Maven

## Security / Systems

The CV identifies familiarity with:

* Kali Linux
* Bash
* Metasploit Framework
* Nmap
* Wireshark
* hashing
* asymmetric encryption

These should be presented as **security/system skills and interests**, not as evidence of professional penetration-testing employment unless a specific professional engagement exists.

## Design / Product

* Figma
* UI/UX
* component-based UI
* responsive design

---

# 11. Skill Representation Rules

The website shall avoid misleading skill presentation.

It should not imply:

```text
"I know everything equally well."
```

Instead, the UI should distinguish:

```text
Professional
Experienced
Hands-on
Academic / Training
Currently Learning
Exploring
```

Where meaningful.

The exact labels should be designed carefully so the site remains clean.

The system must never invent skill proficiency percentages.

Avoid:

```text
Java     ██████████ 95%
Python   ████████░░ 80%
```

unless there is a legitimate evidence-based reason to present such measurements.

---

# 12. Career Narrative

The About section should tell a coherent story.

The suggested narrative structure is:

```text
Software development foundation
        ↓
Web/application development
        ↓
Professional full-stack work
        ↓
Data science and machine learning
        ↓
Security and cloud interests
        ↓
Continued technical development
```

The portfolio should communicate breadth without presenting the developer as unfocused.

---

# 13. Primary Navigation

The initial navigation should be:

```text
Home
Work
About
Experience
GitHub
CV
Contact
```

A future "Labs" section may be introduced if there is enough technical experimentation to justify it.

---

# 14. Labs / Experiments

The architecture should allow an optional section:

```text
/Labs
```

This is particularly suitable for:

* cybersecurity experiments
* data science experiments
* AI experiments
* application prototypes
* technical demonstrations
* unusual engineering work
* browser experiments

This provides a place for technically interesting work that does not belong in the primary professional case-study section.

It prevents the main portfolio from becoming overloaded.

---

# 15. GitHub Integration

The GitHub profile is:

```text
https://github.com/yamkelajojo
```

The portfolio should treat GitHub as both:

1. a professional identity/link; and
2. a live data source.

The system should automatically retrieve public repository metadata.

---

# 16. Automatic GitHub Repository Data

The GitHub integration should support:

```text
Repository name
Description
Primary language
Stars
Forks
Last updated
Topics
Repository URL
Live/demo URL where available
```

Potential additional metadata:

```text
Created date
Last pushed date
Default branch
Visibility
```

Only useful information should be displayed to visitors.

---

# 17. Featured vs Automatic Projects

The portfolio must separate:

### Featured projects

Manually curated.

These receive:

* custom descriptions
* architecture
* engineering decisions
* screenshots
* challenges
* results
* testing information
* live/demo links

### GitHub projects

Automatically discovered.

These receive:

* repository metadata
* language
* stars
* forks
* topics
* updated date
* GitHub link

Architecture:

```text id="j5ul7c"
                  GitHub
                     │
             ┌───────┴────────┐
             ▼                ▼
      Featured Projects   Repository Index
             │                │
             ▼                ▼
       Case Studies     Auto-generated data
```

---

# 18. Project Case Study Structure

The portfolio should provide a reusable case-study structure:

```text
Project
│
├── Overview
├── Problem
├── Approach
├── Role
├── Technology
├── Architecture
├── Key Decisions
├── Challenges
├── Testing
├── Screenshots
├── Results
└── Links
```

Sections should only render when relevant information exists.

---

# 19. Project Taxonomy

Projects should be categorisable by domain.

Potential categories:

```text
Web
Mobile
Full Stack
Data Science
AI / ML
Cybersecurity
DevOps / Cloud
UI / UX
Experiments
```

A single project may have several categories.

---

# 20. Personal Portfolio as a Project

The portfolio itself should appear as a project in the developer's work history.

It should demonstrate:

```text
SvelteKit
Svelte 5
TypeScript
Bits UI
Tailwind
Cloudflare Workers
GitHub API
TDD
Playwright
Vitest
CI/CD
```

This creates a recursive but useful concept:

> The portfolio demonstrates the same engineering practices it claims the developer values.

---

# 21. Home Page Content Strategy

The homepage should not reproduce the CV.

Recommended structure:

```text
Hero
  ↓
Short professional positioning
  ↓
Selected work
  ↓
Technical areas
  ↓
Experience snapshot
  ↓
GitHub activity/work
  ↓
Call to action
```

The CV remains available through `/CV` or a direct download.

---

# 22. Hero Positioning

The hero should communicate the central identity without trying to list everything.

The concept should revolve around:

```text
Software development
+
building useful products
+
full-stack capability
+
technical curiosity
```

Cybersecurity and data science should appear naturally as secondary areas of expertise/interests rather than competing for the same headline.

---

# 23. About Page

The About page may contain:

```text
Who I am
How I got into software
Professional experience
Technical interests
Current direction
Education
Certification
```

The page should feel like a professional narrative rather than another resume dump.

---

# 24. Experience Timeline

The site should present experience chronologically.

Example structure:

```text
2024 → Present
CustomConnect
Junior Web Developer

2023 → 2024
ExploreAI Academy
Full Stack Data Science

2022 → 2023
WeThinkCode_
Full Stack Software Development

2021 → 2022
Nova Smart Technologies
Web Developer Apprentice
```

The exact visual treatment is determined during design.

Overlapping education/training periods must not be "fixed" by changing dates without evidence.

---

# 25. Resume Integration

The site shall provide a downloadable CV.

The CV should be linked prominently but not dominate the site.

Recommended placement:

```text
Navigation → CV
About → Download CV
Contact → CV
```

The actual PDF should remain a separate file.

The website content should not depend on the PDF being parsed at runtime.

---

# 26. Professional Links

The portfolio should include:

### GitHub

`https://github.com/yamkelajojo`

### LinkedIn

`https://www.linkedin.com/in/yamkela-jojo-911774217`

Links should be represented as structured content so they can be changed without editing UI components.

---

# 27. Content Data Model

Professional information should live in structured data rather than being scattered through Svelte components.

Example conceptual model:

```ts id="m1d7hv"
type Profile = {
    name: string
    headline: string
    summary: string
    location?: string
    githubUrl: string
    linkedinUrl: string
    resumeUrl: string
}
```

Experience:

```ts id="v07x2a"
type Experience = {
    company: string
    role: string
    location?: string
    startDate: string
    endDate?: string
    type: 'professional' | 'training' | 'apprenticeship'
    description: string
    technologies: string[]
    highlights: string[]
}
```

Education:

```ts id="xv0pl8"
type Education = {
    institution: string
    qualification: string
    startDate: string
    endDate?: string
    level?: string
    subjects?: string[]
}
```

Skills:

```ts id="3m2pxj"
type Skill = {
    name: string
    category: string
    context: 'professional' | 'training' | 'hands-on' | 'learning' | 'exploring'
}
```

Certifications:

```ts id="f6f5n2"
type Certification = {
    name: string
    provider: string
    status: 'in-progress' | 'completed' | 'planned' | 'expired'
    date?: string
    credentialUrl?: string
}
```

This model allows the portfolio to evolve without rewriting UI components.

---

# 28. GitHub Data Model

```ts id="n0xqcw"
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

The UI shall depend on this normalized model rather than GitHub's raw response.

---

# 29. Content Accuracy Requirement

The portfolio must not:

* invent professional achievements
* invent project results
* invent employment responsibilities
* invent certifications
* inflate technical expertise
* fabricate metrics
* imply professional cybersecurity experience where only training/interest is documented

Where a case study needs a metric that is not available, the section should be omitted rather than fabricated.

---

# 30. CV Normalization Requirements

Before the CV information is entered into the portfolio, it should be normalized.

The supplied CV contains some duplicated wording and areas where a modern portfolio can communicate the experience more clearly.

For example, the CustomConnect CV currently contains duplicate "Development and Security" wording. The portfolio content should use the underlying information without reproducing accidental duplication.

The website should present polished content, while the downloadable CV remains its own document.

---

# 31. Hosting Architecture

```text id="h8oykq"
                    INTERNET
                       │
                       ▼
                Cloudflare Workers
                       │
          ┌────────────┴─────────────┐
          │                          │
          ▼                          ▼
   Static Assets                 Worker Logic
          │                          │
          │                    ┌─────┴─────┐
          │                    ▼           ▼
          │                 GitHub      Optional
          │                   API       D1/KV
          │
          └──────────────┬───────────────┘
                         ▼
                    SvelteKit
                         │
                         ▼
                    Visitor
```

The application does not require a Python backend.

---

# 32. GitHub Data Flow (Implemented Architecture)

Cloudflare Workers Caching is configured before Worker invocation. It is separate from the GitHub service and from the Workers Cache API:

```text
GET /, /work, /github, or /api/github
   ↓
Cloudflare Workers Caching
   ├── eligible hit → return stored response before Worker code
   │                  (still counts as a Worker request; Worker CPU is skipped)
   └── cold miss / expiry / revalidation → SvelteKit Worker
                                        ↓
                                  GitHub REST API
                                        ↓
                                validate + normalize
                                        ↓
                         HTML/JSON response + Cache-Control
```

The service has no process-local or KV cache. When its Worker handler runs it makes a bounded GitHub request (4.5-second timeout, up to 20 pages of 100 repositories); response headers provide cache policy for Cloudflare Workers Caching. A cached HIT can reduce Worker execution and GitHub subrequests, but still counts as a Worker request. Misses and revalidations can invoke GitHub, so caching alone does not guarantee low request use. Observe deployed `Cf-Cache-Status` values to confirm real cache behavior.

Successful GitHub-backed responses use `public, max-age=1800, stale-while-revalidate=1800, stale-if-error=86400`. Fallback responses use a five-minute freshness window. A public `?refresh=1` bypass is not available; public query strings redirect to their canonical path with `Cache-Control: private, no-store`. SvelteKit data requests retain only a well-formed two-bit invalidation mask for the current single-layout route tree and one recognized trailing-slash marker; malformed or duplicate internal parameters and other query values are canonicalized away. This bounds cache variants without breaking the data protocol. Revisit the accepted mask shape if nested layouts are added.

---

# 33. GitHub Failure Behaviour (Implemented Architecture)

If a Worker invocation cannot safely use GitHub data:

```text
1. Return the maintained, manually curated public repository snapshot.
2. Mark the payload `source: "fallback-snapshot"`, omit a live `fetchedAt`, and expose a safe failure code/message.
3. Return a 503 status for the GitHub-backed page or JSON endpoint while rendering usable fallback UI.
4. Never expose raw GitHub response bodies or stack traces.
```

A cold Worker-cache miss cannot serve a previous live response because no cached response exists. The maintained snapshot is not an in-process stale cache. If a prior successful response is served stale by Workers Caching under the configured directives, that is Cloudflare cache behavior and is observed separately through `Cf-Cache-Status`.

---

# 34. UI Foundation

Use Bits UI for appropriate interactive primitives.

Possible areas:

* navigation
* dialogs
* popovers
* tabs
* accordions
* tooltips
* menus
* command interfaces

Bits UI provides behavior/accessibility primitives while the application retains full visual control. ([bits-ui.com](https://www.bits-ui.com/docs/introduction?utm_source=chatgpt.com))

---

# 35. Visual Direction

The portfolio should feel:

* modern
* restrained
* highly intentional
* professional
* technically sophisticated
* personal

It should not feel like:

* an AI-generated template
* a SaaS dashboard
* a generic Bootstrap portfolio
* a GitHub clone
* an over-animated developer playground

---

# 36. Motion System

Motion shall be purposeful.

Potential uses:

* route transitions
* navigation transitions
* project-card interactions
* subtle reveal animations
* interactive metadata
* hover relationships
* scroll transitions

Reduced motion must be respected.

---

# 37. Accessibility

Requirements:

* semantic HTML
* keyboard support
* visible focus
* accessible names
* correct heading hierarchy
* usable mobile navigation
* accessible dialogs/popovers
* alt text
* contrast
* reduced motion
* no keyboard traps

Accessibility is part of acceptance testing.

---

# 38. Responsive Testing

At minimum test:

```text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

Verify:

* no unintended horizontal scroll
* usable navigation
* project cards
* project detail pages
* image scaling
* text wrapping
* footer
* buttons
* interactions

---

# 39. SEO

Required:

* title
* description
* Open Graph
* canonical URLs where appropriate
* sitemap
* robots.txt
* semantic headings
* project-specific metadata
* meaningful URLs

---

# 40. Performance

The portfolio must prioritize:

* fast initial loading
* low JavaScript payload
* optimized images
* minimal third-party dependencies
* efficient fonts
* static asset delivery
* minimal API calls
* efficient animation

Cloudflare's Workers Static Assets architecture is particularly appropriate because static files can be served separately from dynamic Worker execution. ([developers.cloudflare.com](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/?utm_source=chatgpt.com))

---

# 41. Cost Requirements

Hosting target:

```text
R0/month
```

The project should remain within appropriate Cloudflare free-tier usage for ordinary portfolio traffic.

No paid service may be introduced without explicit approval.

The future `.dev` domain is a separate domain-registration expense.

---

# 42. Testing Philosophy

The project shall use:

```text
TDD
+
STLC
+
V-Model
+
White-box testing
+
Black-box testing
+
Integration testing
+
System testing
+
Acceptance testing
+
Regression testing
```

---

# 43. TDD Cycle

Every significant behavior follows:

```text id="rq2c5f"
RED
Write failing test
      ↓
GREEN
Implement minimum behavior
      ↓
REFACTOR
Improve implementation
      ↓
REGRESSION
Run relevant suite
```

---

# 44. White-Box Testing

White-box testing shall inspect internal implementation.

Target:

* statements
* branches
* conditions
* paths
* loops
* transformations
* error handling

Coverage should be measured.

The goal is meaningful coverage of critical logic rather than blindly achieving 100%.

---

# 45. Black-Box Testing

Tests shall also validate behavior without relying on implementation details.

Example:

```text
Given a visitor opens a project
When they select the GitHub link
Then the correct repository is opened
```

The test should care about the requirement, not how the component is internally implemented.

---

# 46. Integration Testing

Example:

```text
GitHub response
      ↓
adapter
      ↓
normalizer
      ↓
repository service
      ↓
Svelte page
      ↓
repository card
```

All boundaries should be tested where failure could affect the visitor.

---

# 47. End-to-End Testing

Use Playwright for browser-level testing.

Critical paths include:

```text
Home
→ Work
→ Project
→ GitHub

Home
→ About
→ Experience

Home
→ CV

Mobile
→ Menu
→ Page
```

---

# 48. Example GitHub Tests

### Branch coverage

Test:

```text
description exists
description missing

language exists
language missing

topics exist
topics empty

homepage exists
homepage missing

GitHub success
GitHub failure
```

### Boundary cases

```text
0 repositories
1 repository
many repositories

0 stars
1 star
large values

0 topics
1 topic
many topics
```

---

# 49. CI/CD

GitHub Actions should execute:

```text
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
Build
      ↓
Playwright
      ↓
Accessibility checks
      ↓
Deployment
```

Critical test failures must prevent production deployment.

---

# 50. Preview Environment

The system should support preview deployments for meaningful changes before production.

This allows the developer to inspect:

* layout
* behavior
* responsive design
* GitHub integration
* browser behavior

before a production deployment.

---

# 51. Production Deployment

Initial public deployment:

```text
*.workers.dev
```

Future:

```text
yourname.dev
```

Both should point to the same application architecture.

---

# 52. Repository Structure

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
│   │   │   ├── experience/
│   │   │   └── shared/
│   │   │
│   │   ├── data/
│   │   │   ├── profile.ts
│   │   │   ├── experience.ts
│   │   │   ├── education.ts
│   │   │   ├── skills.ts
│   │   │   ├── certifications.ts
│   │   │   └── projects.ts
│   │   │
│   │   ├── github/
│   │   ├── utils/
│   │   └── types/
│   │
│   ├── routes/
│   │   ├── +page.svelte
│   │   ├── about/
│   │   ├── work/
│   │   ├── work/[slug]/
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

---

# 53. Requirement IDs

All significant requirements should receive stable IDs.

Examples:

```text
PROFILE-001
PROFILE-002

EXP-001
EXP-002

EDU-001

SKILL-001

PROJECT-001

GITHUB-001
GITHUB-002
GITHUB-003

UI-001
UI-002

A11Y-001

SEO-001

PERF-001

SEC-001

DEPLOY-001

TEST-001
```

---

# 54. Traceability

Every significant requirement must map to verification.

```text
Requirement
    ↓
Acceptance Criterion
    ↓
System Test
    ↓
Integration Test
    ↓
Unit / White-Box Test
    ↓
Implementation
```

---

# 55. Example Traceability

| Requirement             | Unit | Integration | E2E | Acceptance |
| ----------------------- | ---- | ----------- | --- | ---------- |
| Profile information     | ✓    | ✓           | ✓   | ✓          |
| Experience timeline     | ✓    | ✓           | ✓   | ✓          |
| Project pages           | ✓    | ✓           | ✓   | ✓          |
| GitHub metadata         | ✓    | ✓           | ✓   | ✓          |
| GitHub failure handling | ✓    | ✓           | ✓   | ✓          |
| Responsive navigation   | —    | ✓           | ✓   | ✓          |
| Accessibility           | —    | —           | ✓   | ✓          |
| SEO                     | —    | ✓           | ✓   | ✓          |
| CV download             | —    | ✓           | ✓   | ✓          |
| Deployment              | —    | —           | ✓   | ✓          |

---

# 56. Acceptance Tests

## AT-001 — Homepage

Given a visitor opens the portfolio:

Then:

* identity is immediately understandable
* primary positioning is visible
* major navigation is accessible
* selected work is discoverable

---

## AT-002 — About

Given a visitor opens About:

Then they can understand:

* professional background
* development journey
* technical direction
* education
* current interests

without reading the entire CV.

---

## AT-003 — Experience

Given a visitor opens Experience:

Then professional and training experiences are distinguishable.

---

## AT-004 — Projects

Given a featured project exists:

Then its project page provides meaningful contextual information rather than simply linking to GitHub.

---

## AT-005 — GitHub

Given public repositories are available:

Then the portfolio can retrieve and display supported repository metadata.

---

## AT-006 — GitHub Automatic Updates

Given repository metadata changes:

Then the portfolio eventually reflects the updated metadata without source-code modification.

---

## AT-007 — GitHub Failure

Given GitHub becomes unavailable:

Then the portfolio remains usable and does not expose raw server errors.

---

## AT-008 — CV

Given the user selects CV:

Then the correct CV document opens/downloads successfully.

---

## AT-009 — Mobile

Given a mobile viewport:

Then:

* navigation works
* content fits
* cards are usable
* buttons remain accessible
* no unintended horizontal scrolling occurs

---

## AT-010 — Accessibility

Given keyboard-only navigation:

Then critical application functionality remains usable.

---

## AT-011 — Production

Given all critical CI checks pass:

Then production deployment succeeds and the public URL responds successfully.

---

# 57. Definition of Done

A feature is complete only when:

```text
Requirement identified
        AND
Acceptance criteria written
        AND
Tests defined
        AND
TDD implementation completed
        AND
Unit tests pass
        AND
Integration tests pass
        AND
E2E tests pass where relevant
        AND
Accessibility checked
        AND
Responsive behavior checked
        AND
Failure states checked
        AND
Production build passes
        AND
No critical regression exists
```

---

# 58. Engineering Agent Instructions

Any AI coding agent working on this repository must:

1. inspect the repository before changing it
2. read the relevant requirements
3. identify acceptance criteria
4. write/define tests
5. implement the smallest correct solution
6. run tests
7. review the implementation critically
8. inspect actual UI in a browser
9. run regression tests
10. avoid unnecessary dependencies
11. avoid unnecessary architecture
12. never weaken tests simply to make CI green
13. never introduce paid services without approval

---

# 59. Agent Self-Review

Before declaring a feature complete, the agent must ask:

### Product

Does this actually improve the portfolio?

### UX

Is the flow intuitive?

### UI

Does it look intentional rather than generated/template-like?

### Mobile

Does it work on narrow screens?

### Accessibility

Can it be used without a mouse?

### Engineering

Is the architecture clean?

### Testing

Are success and failure paths covered?

### Performance

Did this introduce unnecessary JavaScript or network requests?

### Security

Are external inputs and secrets handled safely?

### Maintenance

Would another developer understand this code?

---

# 60. Phase Plan

## Phase 0 — Foundation

Set up:

* SvelteKit
* Svelte 5
* TypeScript
* Tailwind
* Bits UI
* Vitest
* Playwright
* linting
* formatting
* Cloudflare
* CI

---

## Phase 1 — Requirements & Architecture

Create:

* information architecture
* data models
* project model
* GitHub model
* testing matrix
* deployment model
* design system foundations

---

## Phase 2 — Core UI

Implement:

* root layout
* navigation
* footer
* design tokens
* responsive behavior
* typography
* motion foundations

---

## Phase 3 — Professional Content

Implement:

* Home
* About
* Experience
* Education
* Skills
* Certification
* CV integration

---

## Phase 4 — Work

Implement:

* selected projects
* project cards
* project detail pages
* case studies
* technology relationships

---

## Phase 5 — GitHub

Implement:

```text
GitHub API
   ↓
adapter
   ↓
normalizer
   ↓
cache
   ↓
repository UI
```

---

## Phase 6 — Quality Engineering

Perform:

* white-box testing
* branch/condition analysis
* integration testing
* E2E testing
* accessibility testing
* responsive testing
* visual testing
* performance testing
* security review

---

## Phase 7 — Production

Deploy:

```text
Cloudflare Workers
        ↓
*.workers.dev
```

Then optionally connect:

```text
yourname.dev
```

---

# 61. Future Extensibility

The architecture may later support:

* Cloudflare D1
* Cloudflare KV
* R2
* richer project CMS functionality
* authenticated administration
* blog/articles
* technical notes
* project statistics
* GitHub activity visualizations
* AI/data-science demos
* cybersecurity labs
* interactive experiments

None of these should be implemented until justified by an actual requirement.

---

# 62. Final Product Structure

The intended experience is approximately:

```text
HOME
 │
 ├── Introduction
 ├── Selected Work
 ├── Technical Areas
 ├── Experience Snapshot
 └── GitHub
        │
        ▼
WORK
 │
 ├── Featured Project
 ├── Featured Project
 ├── Featured Project
 └── All / GitHub Work
        │
        ▼
PROJECT
 │
 ├── Problem
 ├── Solution
 ├── Architecture
 ├── Technology
 ├── Testing
 ├── Screenshots
 └── Links
        │
        ▼
ABOUT
 │
 ├── Story
 ├── Skills
 ├── Education
 ├── Certification
 └── Current Direction
        │
        ▼
EXPERIENCE
 │
 ├── CustomConnect
 ├── ExploreAI
 ├── WeThinkCode_
 └── Nova Smart Technologies
        │
        ▼
GITHUB
 │
 └── Automatically updated repositories
        │
        ▼
CV
 │
 └── Downloadable document
```

---

# 63. Final Professional Positioning

The portfolio should ultimately make the following distinction clear:

```text
                SOFTWARE DEVELOPMENT
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
        WEB          APPLICATION      MOBILE
         │              │              │
         └──────────────┼──────────────┘
                        │
                        ▼
                  DATA / AI
                        │
                        ▼
              CYBERSECURITY / CLOUD
```

Software development is the foundation.

Web/full-stack development is the strongest professional experience.

Data science represents hands-on technical training and applied work.

Cybersecurity and cloud represent important technical interests and ongoing development.

The portfolio should present these as interconnected parts of one developer rather than four separate identities.

---

# 64. Final Product Principle

The website should answer three questions quickly:

### Who is this developer?

A software developer with professional full-stack web experience and broader application, data and technical experience.

### What has this developer actually built?

Real projects, supported by GitHub repositories, case studies and demonstrable technical work.

### How does this developer build software?

Through structured engineering, testing, iteration, responsive design, maintainable architecture and production deployment.

The portfolio itself must provide evidence for the third answer.

---

# 65. Final Architecture

```text
                         GITHUB
                            │
                     Public repositories
                            │
                            ▼
                    GitHub API Adapter
                            │
                            ▼
                      Normalization
                            │
                            ▼
                     Cache / Revalidation
                            │
                            ▼
┌─────────────────────────────────────────────────┐
│                    SVELTEKIT                    │
│                                                 │
│ Home │ Work │ About │ Experience │ GitHub │ CV│
│                                                 │
│              Bits UI + Custom UI               │
│                                                 │
│          TypeScript + Tailwind CSS              │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
                  CLOUDFLARE WORKERS
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
       Static Assets           Dynamic Logic
              │                     │
              └──────────┬──────────┘
                         ▼
                     INTERNET
                         │
                         ▼
                 *.workers.dev
                         │
                     optional
                         ▼
                    yourname.dev
```

---

# 66. Release Standard

The portfolio is successful only when all three dimensions are satisfied:

```text
                 ENGINEERING
                     │
           ┌─────────┴─────────┐
           │                   │
           ▼                   ▼
        DESIGN             EXPERIENCE
           │                   │
           └─────────┬─────────┘
                     │
                     ▼
             PROFESSIONAL VALUE
```

It must simultaneously be:

* technically sound
* visually intentional
* fast
* accessible
* responsive
* professionally credible
* automatically maintainable
* thoroughly tested

A polished interface without engineering quality is insufficient.

A technically impressive implementation that feels unfinished is also insufficient.

The portfolio itself is one of the developer's projects and must therefore meet the same engineering standards expected of the work it presents.
