# Domain & Architecture Glossary

This glossary defines the canonical domain terms and architectural seams for Yamkela Jojo's developer portfolio (`yamkelajojo/yamkelajojo`). All modules, components, and tests use these exact terms.

## 1. Domain Model Vocabulary

- **Profile (`Profile`)**: The structured identity record of the developer (`Yamkela Jojo`), including primary positioning headline, narrative summary, location (`Durban, South Africa`), social/professional URLs (`githubUrl`, `linkedinUrl`), and downloadable CV path (`resumeUrl`).
- **Experience (`Experience`)**: A chronological career or structured training record with an explicit `type` discriminator:
  - `'professional'` — Paid software/web engineering employment (e.g., CustomConnect Junior Web Developer).
  - `'training'` — Structured full-time engineering learnerships/academies (e.g., ExploreAI Academy Full Stack Data Science Learnership, WeThinkCode_ Full Stack Software Development Learnership).
  - `'apprenticeship'` — Early-career practical web development apprenticeship (e.g., Nova Smart Technologies).
- **Education (`Education`)**: Formal academic and NQF qualification records (`Walter Sisulu University`, `WeThinkCode_`, `ExploreAI Academy`, `Kokstad College`), ordered and weighted by professional relevance (`tier: 'tertiary' | 'learnership' | 'secondary'`).
- **Skill (`Skill`)**: A specific technical capability categorized into one of the eight canonical domains (`Software Development`, `Web Development`, `Data Science`, `Databases`, `Mobile / Application Development`, `Testing / Engineering`, `Security / Systems`, `Design / Product`) and tagged with an honest **Skill Context** (`'professional' | 'hands-on' | 'training' | 'learning' | 'exploring'`). Never represented with arbitrary percentage bars.
- **Certification (`Certification`)**: A structured credential record (`name`, `provider`, `status: 'in-progress' | 'completed' | 'planned' | 'expired'`, `date`, `credentialUrl`, `verificationUrl`) so status changes never require prose rewrites.
- **Featured Project (`FeaturedProject`)**: A manually curated project entry with rich engineering case-study sections (`overview`, `problem`, `approach`, `role`, `technologies`, `architecture`, `keyDecisions`, `challenges`, `testing`, `results`, `links`) and an optional `repoName` linking it to live `GitHubRepository` metadata.
- **GitHub Repository (`GitHubRepository`)**: The normalized domain model representing public repository metadata from `github.com/yamkelajojo`, decoupled from GitHub's raw REST API schema.
- **GitHub response source (`GitHubDataSource`)**: `github-api` means the Worker obtained and normalized an upstream GitHub payload; `fallback-snapshot` means the maintained snapshot was returned after a failure. This field does not report whether Cloudflare Workers Caching served a HIT, STALE, or MISS; inspect `Cf-Cache-Status` for that.
- **Workers Caching**: Cloudflare's configured cache in front of Worker invocation. `Cache-Control` sets response freshness and stale directives. A cache hit still counts as a Worker request but skips Worker code; a miss or revalidation can run the Worker and call GitHub. It is distinct from the adapter-generated `caches.default` wrapper, process-local caching, Static Assets, and application-managed use of the Workers Cache API. The adapter wrapper runs inside Worker code and is not assumed to work on `workers.dev`.
- **Maintained fallback snapshot**: Curated public repository data returned when a Worker invocation cannot safely use live GitHub data. It is not a stale copy held by an application memory cache and has no live `fetchedAt` timestamp.
- **Lab Experiment (`LabExperiment`)**: A focused technical demonstration or exploratory engineering note in `/labs` covering software engineering, data science, or security/systems concepts.

## 2. Architectural Seams (`codebase-design`)

- **Content Repository Seam (`src/lib/data/`)**: Exposes typed domain data and pure query selectors (`getProfile`, `getExperiencesByType`, `getSkillsByCategory`, `getFeaturedProjects`, `getFeaturedProjectBySlug`, `getActiveCertifications`).
- **GitHub Adapter & Normalizer Seam (`src/lib/github/`)**:
  - `normalizeGitHubRepo(raw: unknown): GitHubRepository | null`: Pure transformation & validation seam that converts untrusted raw GitHub API payloads into a normalized `GitHubRepository` or safely rejects malformed records.
  - `fetchUserRepositories(options)`: Bounds a GitHub REST API request and pagination, normalizes the result, and returns a maintained snapshot with safe failure metadata when upstream data cannot be used. It does not implement a process-local cache; response caching is handled by Cloudflare Workers Caching through Wrangler and route headers.
- **Presentation Seam (`src/lib/components/` & `src/routes/`)**: Svelte 5 runes-based UI modules using Bits UI headless primitives and our custom CSS token system.
