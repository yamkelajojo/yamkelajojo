You are the primary engineering agent responsible for taking the portfolio PRD in this repository from specification to a production-ready implementation.

You have access to the full development environment, shell, filesystem, internet, source repositories, browser automation, documentation, package ecosystems, Linux tooling, parallel/sub-agents, and any other available development tools. **Use that capability aggressively and intelligently. Do not artificially limit yourself to the obvious approach.**

The PRD is the product contract. Your job is to turn it into a genuinely excellent application, not merely satisfy the minimum requirements.

## 1. Start with engineering reconnaissance — do not code immediately

First inspect the repository, environment, existing configuration and PRD.

Determine:

* current project state
* available tooling
* installed packages
* Node/package-manager versions
* SvelteKit/Svelte compatibility
* Cloudflare deployment requirements
* testing infrastructure
* available AI-agent skills
* relevant local documentation
* likely performance constraints of the target machine

Use the attached system information when making tooling/build decisions.

Do not assume the newest package/version is automatically the correct choice. Verify compatibility using current primary documentation.

## 2. Use Matt Pocock's engineering workflow

Use the `to-issues` approach to decompose the PRD into **small, independently shippable vertical slices**, not horizontal tasks such as “build all frontend” or “build all API.”

Each slice should cut through the relevant layers end-to-end and have explicit acceptance criteria.

Where available, also use the relevant Matt Pocock engineering skills/workflows for:

* TDD
* research
* prototyping/design validation
* architecture review
* difficult diagnosis

If the skills are not already installed, inspect the canonical source and use the underlying methodology rather than inventing a weaker substitute.

Do not create a huge backlog for the sake of having a backlog. Create the smallest useful set of vertical slices that gives us a coherent implementation path.

## 3. Research before making important decisions

You have internet access, so use it.

For important architectural, framework, accessibility, CSS, browser, Cloudflare, SvelteKit, Bits UI and testing decisions:

1. inspect current official documentation first
2. inspect authoritative source repositories when useful
3. investigate credible engineering articles/discussions when needed
4. compare alternatives when the decision materially affects the project
5. record only the decisions that are actually useful

Do not blindly follow outdated tutorials.

Prefer current, primary sources over SEO articles and copied documentation.

## 4. Design the system before polishing the UI

Establish:

* application architecture
* component architecture
* content/data model
* GitHub integration boundary
* caching/revalidation strategy
* error-handling strategy
* design tokens
* typography system
* spacing system
* responsive behavior
* motion principles
* testing architecture

Keep the architecture simple.

Do not introduce Python, a separate backend server, a VPS, unnecessary databases, unnecessary services, or unnecessary dependencies.

The intended architecture remains:

SvelteKit + Svelte 5 + TypeScript + Bits UI + Tailwind + Cloudflare Workers.

## 5. Use the portfolio itself as an engineering demonstration

The result must not feel like a generic developer-template portfolio.

The design should communicate:

* professional maturity
* strong visual hierarchy
* technical confidence
* restraint
* personality
* craftsmanship

Do not blindly copy an existing website.

Research excellent modern portfolio/product interfaces and derive principles rather than cloning aesthetics.

Explore typography, spacing, color and interaction systems before committing.

Create a small number of design directions/prototypes only when doing so materially improves the decision. Evaluate them critically and choose the direction that best serves the actual portfolio.

Avoid:

* generic AI gradients
* excessive glassmorphism
* overuse of cards
* gratuitous animation
* giant meaningless typography
* template-looking dashboards
* visual noise

The work and the developer's story should remain the focus.

## 6. Treat the CV as structured product data

Use the supplied CV to build the portfolio's content model.

Represent the developer accurately across:

* professional experience
* software development training
* data science training
* education
* skills
* certification status
* GitHub
* LinkedIn
* projects

Do not simply paste the CV into pages.

Create a stronger professional narrative around:

software development → full-stack web development → application development → data science → cybersecurity/cloud interests.

Clearly distinguish professional experience from training, experimentation and current learning.

Do not invent metrics, responsibilities, achievements, certification status or professional security experience.

## 7. GitHub integration must be genuinely dynamic

The portfolio should automatically retrieve and normalize public GitHub repository metadata, including where available:

* repository
* stars
* forks
* primary language
* last updated
* description
* topics
* repository URL
* homepage/live URL

Architect this as:

GitHub API
→ adapter
→ normalized domain model
→ cache/revalidation
→ UI

Do not couple UI components directly to GitHub's raw API response.

Handle:

* missing fields
* empty topics
* zero stars/forks
* API failures
* malformed responses
* cached data
* stale data
* rate limits

Do not make an unnecessary GitHub API request for every visitor.

The implementation must remain compatible with the project's R0 hosting objective.

## 8. TDD is mandatory

Implement significant functionality using:

RED
→ GREEN
→ REFACTOR
→ REGRESSION

Before implementation, define the behavior being tested.

Tests must be meaningful rather than written solely to increase coverage percentages.

Use white-box reasoning for:

* statements
* branches
* conditions
* paths
* boundaries
* loops
* transformation logic
* error handling

Combine this with black-box testing based on the PRD.

## 9. V-Model / STLC is part of implementation

For each significant requirement, maintain the relationship:

Requirement
→ acceptance criteria
→ system-level verification
→ integration verification
→ unit/white-box verification
→ implementation
→ regression verification

Do not wait until the end to “add testing.”

Testing should shape the implementation.

## 10. Test the actual product, not just functions

Use the appropriate tools for:

* unit testing
* integration testing
* browser/E2E testing
* accessibility
* responsive behavior
* visual regression where valuable
* production build verification

Use browser automation to inspect the real rendered application.

A passing unit-test suite is not sufficient.

Verify:

* desktop
* tablet
* mobile
* keyboard navigation
* focus states
* reduced motion
* error states
* loading states
* empty states
* navigation
* project flows
* GitHub flows
* CV access

## 11. Use parallel agents selectively

You may launch parallel/child agents when the work genuinely benefits from parallelism.

Good candidates include independent:

* research
* architecture review
* visual exploration
* testing analysis
* implementation slices
* browser verification

Do not create parallel agents merely to look sophisticated.

Keep coordination manageable and integrate their findings critically.

You remain responsible for the final architecture and quality.

## 12. CSS foundation

Before building the visual system, inspect and apply the current version of Josh W. Comeau's custom CSS reset:

https://www.joshwcomeau.com/css/custom-css-reset/

Do not blindly copy an old version from memory or a third-party snippet.

Use the current article as the reference, adapt it appropriately for SvelteKit, and test that it does not interfere with:

* dialogs
* popovers
* Bits UI primitives
* form controls
* typography
* layout
* responsive behavior
* browser defaults we intentionally want to preserve

The current article has evolved over time, so use the current source rather than an older cached implementation.

## 13. Accessibility is a design requirement

Build accessibility into the components.

Pay particular attention to:

* semantic HTML
* keyboard navigation
* visible focus
* accessible names
* dialogs/popovers
* navigation
* forms
* contrast
* reduced motion
* heading hierarchy
* links/buttons
* screen-reader behavior

Do not bolt accessibility onto the application after the UI is finished.

## 14. Performance matters

Treat performance as part of the architecture.

Continuously inspect:

* JavaScript shipped to the browser
* unnecessary hydration
* unnecessary dependencies
* image payloads
* fonts
* network requests
* GitHub API usage
* animation cost
* client-side state
* static asset handling

Prefer server/static work when it reduces client complexity.

Keep the application appropriate for real-world mobile connections and modest hardware.

## 15. Cloudflare discipline

The application must be designed around Cloudflare's free hosting capabilities.

Do not introduce anything that silently creates paid usage.

Keep:

* static content on static delivery
* dynamic logic minimal
* caching deliberate
* external requests controlled
* infrastructure simple

Before adding any Cloudflare feature, verify its current pricing/limits and whether it is actually necessary.

## 16. Do not stop at "it works"

After implementation, perform a deliberate critical review.

Look for:

* unnecessary abstractions
* duplicated logic
* poor component boundaries
* inconsistent UI
* awkward spacing
* weak typography
* excessive animation
* accessibility problems
* mobile problems
* loading/error-state gaps
* stale GitHub data handling
* security issues
* unnecessary dependencies
* poor performance
* tests that test implementation details instead of behavior
* requirements that were technically satisfied but poorly realized

Fix the problems you find.

## 17. Use the browser as part of development

Once the application runs:

* inspect it visually
* exercise the primary user journeys
* test mobile and desktop layouts
* inspect browser console errors
* inspect network behavior
* test interactions
* verify animations/transitions
* verify GitHub data
* verify failure states

Do not rely exclusively on source-code reasoning.

## 18. Keep documentation useful

Create concise engineering documentation where it materially helps future maintenance:

* architecture decisions
* testing strategy
* requirements traceability
* important design decisions
* GitHub integration behavior
* deployment instructions

Do not create documentation for the sake of documentation.

## 19. Final quality gate

Before declaring the project complete, verify:

* PRD requirements satisfied
* requirements mapped to tests
* TDD followed for significant behavior
* unit tests pass
* integration tests pass
* E2E tests pass
* accessibility verified
* responsive behavior verified
* production build passes
* Cloudflare deployment works
* GitHub integration works
* GitHub failure handling works
* no secrets exposed
* no unnecessary paid infrastructure introduced
* UI has been manually/browser verified
* no known critical defects remain

Then perform one final adversarial review:

> "If I were a very critical senior engineer, recruiter, designer and end user looking at this portfolio for the first time, what would I criticize?"

Find those problems yourself and fix the worthwhile ones before stopping.

### Operating principle

Do not rush.

Do not endlessly deliberate either.

Research when research matters, prototype when uncertainty matters, test before implementation where TDD applies, and execute decisively once the evidence is sufficient.

Build it with the patience and care of a craftsperson: precise, durable, restrained, intentional and willing to leave things imperfect only when that imperfection is deliberate rather than accidental.

**Use the PRD as the contract. Use tests as the guardrails. Use research and your full toolset to raise the quality. Use your judgment to keep the result simple, fast and genuinely excellent.**
