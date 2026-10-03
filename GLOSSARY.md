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
- **Lab Experiment (`LabExperiment`)**: A focused technical demonstration or exploratory engineering note in `/labs` covering software engineering, data science, or security/systems concepts.

## 2. Architectural Seams (`codebase-design`)

- **Content Repository Seam (`src/lib/data/`)**: Exposes validated, immutable domain data and pure query selectors (`getProfile`, `getExperiencesByType`, `getSkillsByCategory`, `getFeaturedProjects`, `getFeaturedProjectBySlug`, `getActiveCertifications`).
- **GitHub Adapter & Normalizer Seam (`src/lib/github/`)**:
  - `normalizeGitHubRepo(raw: unknown): GitHubRepository | null`: Pure transformation & validation seam that converts untrusted raw GitHub API payloads into a normalized `GitHubRepository` or safely rejects malformed records.
  - `fetchUserRepositories(options)`: Deep module coordinating cache lookup, GitHub REST API fetch, normalization, stale-while-revalidate caching, and graceful fallback when GitHub is unavailable or rate-limited.
- **Presentation Seam (`src/lib/components/` & `src/routes/`)**: Svelte 5 runes-based UI modules using Bits UI headless primitives and our custom CSS token system.
