import type {
	FeaturedProject,
	GitHubRepository,
	LabExperiment,
	ProjectCategory
} from '$lib/types';

export const PROJECT_CATEGORIES: ProjectCategory[] = [
	'Full Stack',
	'Web',
	'Mobile',
	'Data Science',
	'AI / ML',
	'Cybersecurity',
	'DevOps / Cloud',
	'UI / UX',
	'Experiments'
];

export type EnrichedFeaturedProject = FeaturedProject & {
	githubRepo: GitHubRepository | null;
};

const FEATURED_PROJECTS: FeaturedProject[] = [
	{
		slug: 'engineering-portfolio',
		title: 'Personal Developer Portfolio & Repository Data Platform',
		subtitle:
			'SvelteKit 2 + Svelte 5 + TypeScript + Bits UI application deployed on Cloudflare Workers with resilient GitHub API normalization and test-driven verification.',
		categories: ['Full Stack', 'Web', 'DevOps / Cloud', 'UI / UX'],
		context: 'personal',
		contextLabel: 'Personal Engineering Project',
		period: '2026',
		featuredOrder: 1,
		repoName: 'yamkelajojo',
		overview:
			'Designed and engineered as a practical demonstration of how I build software: a fast, accessible, test-driven web application that combines structured CV domain modelling with traffic-driven public GitHub repository discovery under response caching and Cloudflare Workers delivery.',
		problem:
			'Most developer portfolios either behave like static online CVs that quickly drift out of date as GitHub repositories evolve, or rely on fragile client-side fetches and heavy UI templates that obscure the engineer’s actual craft.',
		approach:
			'Built a typed domain architecture in SvelteKit and Svelte 5 that separates curated engineering case studies from normalized GitHub repository metadata. Cloudflare Workers Caching reuses cacheable route responses, while a bounded server-side API client and maintained snapshot handle GitHub failure states.',
		role: 'Primary Software & Full-Stack Engineer (Architecture, Design System, TDD & Deployment)',
		technologies: [
			'SvelteKit',
			'Svelte 5',
			'TypeScript',
			'Bits UI',
			'Tailwind CSS',
			'Cloudflare Workers',
			'GitHub REST API',
			'Vitest',
			'Playwright',
			'GitHub Actions CI/CD'
		],
		architecture: [
			'Content Domain Seam (src/lib/data/): Typed, normalized records for Profile, Experience, Education, Skills, Certifications, and Featured Case Studies.',
			'GitHub API Client & Normalizer (src/lib/github/): Bounds request time and pagination, filters private repositories, validates optional fields, and maps trusted data into a strict GitHubRepository model.',
			'Cloudflare Workers Caching: Successful GitHub-backed SSR and API responses use a 30-minute freshness window, a 30-minute stale-while-revalidate window, and stale-if-error for up to 24 hours. Cache hits still count as Worker requests but avoid running Worker code; misses and revalidations can call GitHub.',
			'Maintained Snapshot Fallback: When GitHub fails on a cold Worker-cache miss, routes return a clearly identified, manually maintained snapshot with a five-minute freshness window; case-study routes do not fetch GitHub.',
			'Cloudflare Static Assets: Existing static assets are served before Worker code; hashed SvelteKit assets use the adapter’s immutable cache headers.'
		],
		keyDecisions: [
			{
				title: 'Decouple UI from raw GitHub API schema',
				rationale:
					'By normalizing fields (nullable descriptions, empty homepage strings, topic arrays, and non-negative counts) at the API boundary, UI components remain simple and resilient to upstream schema quirks.'
			},
			{
				title: 'Use Cloudflare Workers Caching instead of a second application cache',
				rationale:
					'Wrangler enables Cloudflare Workers Caching before Worker invocation; standard Cache-Control directives define response freshness and stale behavior. This avoids a KV binding, scheduled job, and application-managed Cache API dataset. The generated adapter also contains an internal caches.default wrapper after Worker invocation; it does not skip Worker CPU and is not relied on for workers.dev correctness.'
			},
			{
				title: 'Apply Josh W. Comeau’s 2026 Modern CSS Reset + Bits UI headless primitives',
				rationale:
					'Preserves native <dialog> centering, enables interpolate-size keyword animations under reduced-motion media queries, and pairs accessible keyboard primitives with a bespoke editorial aesthetic.'
			},
			{
				title: 'Honest skill & experience context modelling',
				rationale:
					'Replaces meaningless percentage bars with explicit context tags (Professional, Hands-on, Training, Learning, Exploring) and separates production employment from structured learnerships.'
			}
		],
		challenges: [
			'Balancing GitHub rate limits with update propagation: fresh Workers Caching hits avoid Worker execution, but misses and revalidation can still call GitHub.',
			'Designing a responsive editorial layout that communicates software engineering depth across mobile, tablet, and desktop viewports without visual clutter.'
		],
		testing: [
			'Vitest checks GitHub pagination beyond 100 repositories, malformed and empty payloads, optional fields, private/fork/archived repositories, timeouts, rate limits, and explicit Workers Caching response policy.',
			'Integration tests verify server-load metadata, the 503 cold-miss fallback, no per-case-study GitHub fetch, configured-origin SEO, and query canonicalization.',
			'Playwright runs the built Cloudflare Worker with a controlled GitHub API stub, then checks real browser journeys, accessibility, response headers, fallback behavior, and responsive layouts. A deployed Cf-Cache-Status observation is still required to verify production edge-cache HIT behavior.'
		],
		screenshots: [
			{
				title: 'Workers Caching & GitHub Response Flow',
				caption: 'Fresh cache hits return before Worker execution. Cold misses and revalidations call GitHub; success responses are cacheable, while cold failures return the maintained snapshot. Cf-Cache-Status is needed to observe actual edge behavior.',
				diagramType: 'pipeline',
				imageUrl: '/images/projects/portfolio-architecture.svg',
				nodes: [
					'Visitor Request',
					'Cloudflare Workers Caching',
					'SvelteKit Worker (miss / revalidation)',
					'GitHub REST API',
					'Normalizer + Snapshot Fallback',
					'SSR / JSON Response → Cache'
				]
			}
		],
		results: [
			'Requires no paid infrastructure and is designed to remain within Cloudflare’s Free-plan quotas; request charges still apply, including cached Worker responses.',
			'Full traceability from portfolio requirements to Vitest, Worker-backed integration tests, and browser E2E journeys.'
		],
		links: {
			github: 'https://github.com/yamkelajojo/yamkelajojo',
			caseStudy: '/work/engineering-portfolio'
		}
	},
	{
		slug: 'greenbidder-marketplace',
		title: 'GreenBidder — Geospatial Agricultural Marketplace',
		subtitle:
			'Cross-platform mobile and web marketplace connecting local farmers and produce buyers with React Native, Expo, Tamagui, Zod, and Supabase/PostGIS.',
		categories: ['Mobile', 'Full Stack', 'Web'],
		context: 'personal',
		contextLabel: 'Application Engineering Project',
		period: '2026',
		featuredOrder: 2,
		repoName: 'greenbidder',
		overview:
			'GreenBidder is a multi-role agricultural marketplace application built with React Native (Expo 54) and Supabase PostgreSQL. It enables farmers to publish verified produce listings with geospatial coordinates and allows buyers to discover produce within configurable proximity radii.',
		problem:
			'Small-scale and regional farmers often lack direct digital channels to advertise fresh produce inventory to nearby buyers, while buyers need location-aware discovery and structured listing validation.',
		approach:
			'Architected a 12-table PostgreSQL schema with the PostGIS extension (GEOGRAPHY(POINT, 4326)), role-specific farmer and buyer profiles, Zod form validation schemas, and a modular React Native service layer.',
		role: 'Application & Database Developer',
		technologies: [
			'React Native',
			'Expo',
			'TypeScript',
			'JavaScript',
			'Tamagui',
			'Zod',
			'Supabase',
			'PostgreSQL',
			'PostGIS'
		],
		architecture: [
			'Client Layer: Expo 54 + React 19 + Tamagui UI provider hierarchy (SafeAreaProvider → TamaguiProvider → AuthProvider → RootNavigator) with dedicated auth, buyer, farmer, and shared screen stacks.',
			'Validation Seam (src/validators/schemas.js): Zod schemas enforcing strict input rules for authentication, role selection, and produce listing creation (units: kg, bag, crate, bunch, each).',
			'Service Layer (src/services/): Dedicated authService, listingService, profileService, and imageService abstracting Supabase client interactions.',
			'Geospatial Database (database/migrations/gbdb.sql): PostgreSQL schema with PostGIS GEOGRAPHY(POINT, 4326) columns on farmer_profiles and buyer_profiles, custom ENUM types, Row-Level Security (RLS), and interaction tracking.'
		],
		keyDecisions: [
			{
				title: 'PostGIS GEOGRAPHY(POINT, 4326) for proximity discovery',
				rationale:
					'Storing WGS84 geography points directly on farmer and buyer profiles enables accurate radius-based produce queries (preferred_radius_km) at the database layer.'
			},
			{
				title: 'Schema-first input validation with Zod',
				rationale:
					'Validating listing prices, quantities, UUID categories, and user credentials before hitting Supabase prevents malformed writes and provides structured field-level error maps to the UI.'
			}
		],
		challenges: [
			'Designing a database schema that supports distinct buyer and farmer workflows while tracking listing interactions (feed, search, recommendation, direct) for future recommendation modelling.',
			'Sharing consistent styling and navigation patterns across Android, iOS, and Web targets via Expo and Tamagui.'
		],
		screenshots: [
			{
				title: 'GreenBidder Relational & Geospatial Architecture',
				caption: 'Supabase Auth linked to role-specific profiles, PostGIS coordinates, and validated produce listings.',
				diagramType: 'schema',
				imageUrl: '/images/projects/greenbidder-architecture.svg',
				nodes: [
					'Expo + Tamagui Client',
					'Zod Schema Validator',
					'Supabase Auth + RLS',
					'farmer_profiles (PostGIS POINT)',
					'buyer_profiles (radius_km)',
					'produce_listings + interactions'
				]
			}
		],
		links: {
			github: 'https://github.com/yamkelajojo/greenbidder',
			caseStudy: '/work/greenbidder-marketplace'
		}
	},
	{
		slug: 'odin-recipes-laravel-vue',
		title: 'Odin Recipes — Full-Stack Laravel, Inertia & Vue Culinary Platform',
		subtitle:
			'Relational recipe management web application built with PHP, Laravel, Inertia.js, Vue.js, Tailwind CSS, and SQLite/MySQL.',
		categories: ['Full Stack', 'Web', 'UI / UX'],
		context: 'personal',
		contextLabel: 'Full-Stack Web Project',
		period: '2025',
		featuredOrder: 3,
		repoName: 'Odin-Recipes-2',
		overview:
			'A full-stack web application that models structured culinary recipes, ingredient measurements, food categories, and multi-stage preparation steps using Laravel Eloquent ORM on the backend and Inertia.js + Vue.js + Tailwind CSS on the frontend.',
		problem:
			'Simple recipe websites often store instructions as unstructured blobs of text, making it difficult to filter by food category, normalize measurement units, or break complex recipes into distinct preparation stages.',
		approach:
			'Designed a normalized relational domain model in Laravel (`Recipe`, `FoodCategory`, `Ingredient`, `Unit`, `RecipeIngredient`, `PreparationStage`, `PreparationStageStep`, `RecipeImage`) paired with Inertia.js single-page navigation and Vite/Tailwind asset bundling.',
		role: 'Full-Stack Web Developer',
		technologies: [
			'PHP',
			'Laravel',
			'Inertia.js',
			'Vue.js',
			'Tailwind CSS',
			'SQLite',
			'Vite',
			'PHPUnit'
		],
		architecture: [
			'Domain Models (app/Models/): Eloquent models separating Recipes, FoodCategories, Ingredients, Units, PreparationStages, and PreparationStageSteps.',
			'Controller & Routing Layer: Laravel controllers serving Inertia responses (`Inertia::render`) and JSON endpoints (`/recipes/fetch`) for dynamic filtering.',
			'Frontend Layer: Vue components styled with Tailwind CSS v4 and bundled via `laravel-vite-plugin`.'
		],
		keyDecisions: [
			{
				title: 'Normalize preparation into Stages and Steps',
				rationale:
					'Separating `PreparationStage` from `PreparationStageStep` allows complex recipes (e.g., marinade vs. cooking vs. plating) to be structured and rendered clearly.'
			},
			{
				title: 'Inertia.js bridge between Laravel and Vue',
				rationale:
					'Combines Laravel’s server-side routing and Eloquent ORM directly with reactive Vue components without maintaining a separate REST/GraphQL boilerplate layer.'
			}
		],
		screenshots: [
			{
				title: 'Normalized Recipe Domain Model',
				caption: 'Eloquent entity relationships across recipes, ingredients, units, and multi-stage preparation steps.',
				diagramType: 'schema',
				imageUrl: '/images/projects/odin-recipes-schema.svg',
				nodes: [
					'FoodCategory → Recipe',
					'Recipe → RecipeIngredient ← Ingredient + Unit',
					'Recipe → PreparationStage → PreparationStageStep',
					'Recipe → RecipeImage'
				]
			}
		],
		links: {
			github: 'https://github.com/yamkelajojo/Odin-Recipes-2',
			caseStudy: '/work/odin-recipes-laravel-vue'
		}
	},
	{
		slug: 'climate-sentiment-nlp',
		title: 'Climate Change Tweet Sentiment Classification (NLP)',
		subtitle:
			'Supervised machine learning pipeline and interactive Streamlit application classifying climate-change discourse into four sentiment categories.',
		categories: ['Data Science', 'AI / ML', 'Web'],
		context: 'training',
		contextLabel: 'ExploreAI Academy Data Science Sprint',
		period: '2024',
		featuredOrder: 4,
		repoName: 'FM1_EA_Twitter_Sentiment_Classification_2023-2024',
		overview:
			'Developed during the ExploreAI Academy Full Stack Data Science Learnership, this project processes raw Twitter text using Natural Language Processing (NLTK) and compares multiple supervised scikit-learn classifiers deployed behind an interactive Streamlit web interface.',
		problem:
			'Public social media discourse around climate change contains noisy text, slang, URLs, and imbalanced classes, requiring structured preprocessing and multi-model evaluation to classify tweets into Supportive, Skeptical, Action-oriented, or Informational categories.',
		approach:
			'Built a reproducible text preprocessing pipeline (regex cleaning, stopword removal, Snowball/Porter/Lancaster stemming, WordNet lemmatization, and TF-IDF / Count vectorization) and trained multiple serialized models (Logistic Regression, Linear SVC, Naive Bayes, KNN, Decision Trees) served via Streamlit.',
		role: 'Data Science Learnership Collaborator (NLP Preprocessing, Model Training & Streamlit App)',
		technologies: [
			'Python',
			'scikit-learn',
			'NLTK',
			'Pandas',
			'NumPy',
			'Matplotlib',
			'Seaborn',
			'Streamlit',
			'Jupyter'
		],
		architecture: [
			'Text Cleaning & Tokenization: Regex noise removal, language detection, NLTK stopword filtering, and WordNet lemmatization.',
			'Feature Extraction: TF-IDF (`TfidfVectorizer`) and `CountVectorizer` pipelines persisted via `joblib`/`pickle`.',
			'Model Comparison Suite: Evaluated Logistic Regression, Support Vector Classifier (SVC), K-Nearest Neighbors, Naive Bayes, and Decision Tree models.',
			'Interactive Web Interface (`test_base_app.py`): Streamlit application allowing users to test live text inputs against serialized classification pipelines.'
		],
		links: {
			github: 'https://github.com/yamkelajojo/FM1_EA_Twitter_Sentiment_Classification_2023-2024',
			caseStudy: '/work/climate-sentiment-nlp'
		}
	},
	{
		slug: 'movie-recommender-engine',
		title: 'Unsupervised Movie Recommendation System',
		subtitle:
			'Collaborative and content-based filtering recommendation engine built with Python, scikit-learn, and Streamlit.',
		categories: ['Data Science', 'AI / ML'],
		context: 'training',
		contextLabel: 'ExploreAI Academy Unsupervised Sprint',
		period: '2024',
		featuredOrder: 5,
		repoName: 'fm2_unsupervised_machine_learning',
		overview:
			'An interactive movie recommendation application built during the ExploreAI Academy Unsupervised Learning sprint, comparing collaborative filtering (user-rating similarity) with content-based filtering (movie metadata similarity) under live memory and latency constraints.',
		problem:
			'Deploying recommendation algorithms inside an interactive web environment requires balancing similarity matrix computation cost against response latency when generating top-N movie suggestions for a user’s selected favourites.',
		approach:
			'Implemented modular `collaborative_based.py` and `content_based.py` recommendation pipelines integrated into an interactive Streamlit interface (`edsa_recommender.py`) with exploratory data visualizations.',
		role: 'Data Science Learnership Collaborator',
		technologies: [
			'Python',
			'Pandas',
			'NumPy',
			'scikit-learn',
			'Streamlit',
			'Jupyter'
		],
		architecture: [
			'Content-Based Filtering (`recommenders/content_based.py`): Computes item-to-item similarity across movie metadata attributes.',
			'Collaborative Filtering (`recommenders/collaborative_based.py`): Leverages user rating patterns to surface movies favoured by similar viewers.',
			'Streamlit Presentation Layer (`edsa_recommender.py`): Provides interactive movie selection, algorithmic toggle, and EDA insights.'
		],
		links: {
			github: 'https://github.com/yamkelajojo/fm2_unsupervised_machine_learning',
			caseStudy: '/work/movie-recommender-engine'
		}
	},
	{
		slug: 'dojo-drumkit-nuxt',
		title: 'Dojo Drumkit Studio — Interactive Nuxt 3 Audio App',
		subtitle:
			'Browser-based interactive drumkit studio built with Nuxt 3, Vue 3 Composition API, custom audio composables, and keyboard event mapping.',
		categories: ['Web', 'UI / UX', 'Experiments'],
		context: 'personal',
		contextLabel: 'Frontend & Interactive Audio Project',
		period: '2023',
		featuredOrder: 6,
		repoName: 'dojodonedidit-drumkit-w-nuxt',
		overview:
			'An interactive musical drumkit web application built with Nuxt 3 and Vue 3. Expanding upon Wes Bos’s classic JavaScript drumkit concept, it introduces component-based studio visuals (`Screen`, `Keyz`, `RightSpeaker`), reactive event telemetry, and custom drum samples triggered via keyboard or pointer events.',
		problem:
			'Translating low-latency DOM keyboard and audio playback events into a reactive component framework requires clean coordination between browser `<audio>` elements, keydown listeners, and visual feedback states.',
		approach:
			'Structured instrument definitions in a dedicated Nuxt composable (`composables/soundkeys`), bound `<audio>` elements by `data-key`, and coordinated real-time visual state updates between `Keyz.vue` and `Screen.vue`.',
		role: 'Frontend Developer',
		technologies: ['Nuxt.js', 'Vue.js', 'JavaScript', 'Sass', 'HTML5 Audio', 'JSON Server'],
		links: {
			github: 'https://github.com/yamkelajojo/dojodonedidit-drumkit-w-nuxt',
			caseStudy: '/work/dojo-drumkit-nuxt'
		}
	}
];

const LAB_EXPERIMENTS: LabExperiment[] = [
	{
		id: 'github-normalizer-pipeline',
		title: 'GitHub API Normalization & Workers Caching Explorer',
		domain: 'Software Engineering',
		context: 'hands-on',
		summary:
			'Inspection of how public REST payloads are validated into strict TypeScript domain objects, then served with Cloudflare Workers Caching and a maintained snapshot for cold-miss failures.',
		technicalNotes: [
			'Validates repository URLs, optional dates, nullable fields, and non-negative counts before rendering.',
			'Decouples Svelte 5 components from GitHub REST API snake_case fields.',
			'Distinguishes the GitHub payload source and fetch timestamp from Cloudflare HIT/MISS state; the page does not label a response as an edge hit.'
		],
		technologies: ['TypeScript', 'SvelteKit', 'Vitest', 'Cloudflare Workers'],
		relatedRepo: 'yamkelajojo'
	},
	{
		id: 'postgis-proximity-modelling',
		title: 'PostGIS Geospatial Proximity & RLS Policy Design',
		domain: 'Software Engineering',
		context: 'hands-on',
		summary:
			'Exploration of WGS84 geography point indexing (`GEOGRAPHY(POINT, 4326)`) and Row-Level Security policies for multi-role marketplace applications.',
		technicalNotes: [
			'Separates authentication identity (`users.auth_id`) from role-specific `farmer_profiles` and `buyer_profiles`.',
			'Captures structured interaction telemetry (`feed`, `search`, `recommendation`, `direct`) to feed future recommender pipelines.'
		],
		technologies: ['PostgreSQL', 'PostGIS', 'Supabase', 'Zod'],
		relatedRepo: 'greenbidder'
	},
	{
		id: 'nlp-feature-vectorization',
		title: 'NLP Tokenization, Lemmatization & TF-IDF Classification Notes',
		domain: 'Data Science / ML',
		context: 'training',
		summary:
			'Applied notes from ExploreAI Academy on comparing stemmers (Snowball, Porter, Lancaster), WordNet lemmatization, and TF-IDF vectorization for multi-class sentiment prediction.',
		technicalNotes: [
			'Evaluated trade-offs between linear classifiers (Logistic Regression, Linear SVC) and tree/instance-based models on sparse text matrices.',
			'Packaged scikit-learn vectorizers and estimators for interactive inference in Streamlit.'
		],
		technologies: ['Python', 'NLTK', 'scikit-learn', 'Streamlit'],
		relatedRepo: 'FM1_EA_Twitter_Sentiment_Classification_2023-2024'
	},
	{
		id: 'network-security-cryptography-labs',
		title: 'Network Protocol Inspection & Applied Cryptography Fundamentals',
		domain: 'Security / Systems',
		context: 'exploring',
		summary:
			'Foundational security and systems study covering packet inspection, port enumeration, hashing digests, and asymmetric key exchange in controlled local lab environments.',
		technicalNotes: [
			'Used Wireshark and Nmap in local Kali Linux lab topologies to inspect TCP/HTTP handshakes and service exposure.',
			'Studied cryptographic hashing and asymmetric encryption principles to strengthen web application authentication and transport security.'
		],
		technologies: ['Kali Linux', 'Bash', 'Wireshark', 'Nmap', 'Cryptography Fundamentals']
	}
];

export function getFeaturedProjects(): FeaturedProject[] {
	return [...FEATURED_PROJECTS].sort((a, b) => a.featuredOrder - b.featuredOrder);
}

export function getFeaturedProjectBySlug(slug: string): FeaturedProject | null {
	return FEATURED_PROJECTS.find((project) => project.slug === slug) ?? null;
}

export function getFeaturedProjectsByCategory(
	category: ProjectCategory | 'All'
): FeaturedProject[] {
	const sorted = getFeaturedProjects();
	if (category === 'All') {
		return sorted;
	}
	return sorted.filter((project) => project.categories.includes(category));
}

export function enrichProjectsWithGitHub(
	projects: FeaturedProject[],
	repositories: GitHubRepository[]
): EnrichedFeaturedProject[] {
	const repoByName = new Map<string, GitHubRepository>();
	for (const repo of repositories) {
		repoByName.set(repo.name.toLowerCase(), repo);
	}

	return projects.map((project) => ({
		...project,
		githubRepo: project.repoName
			? (repoByName.get(project.repoName.toLowerCase()) ?? null)
			: null
	}));
}

export function getLabExperiments(): LabExperiment[] {
	return LAB_EXPERIMENTS;
}
