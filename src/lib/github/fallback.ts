import type { GitHubRepository } from '$lib/types';

/**
 * Small, maintained snapshot of public repository metadata. It is deliberately
 * not timestamped as a live synchronization and is only returned when the GitHub
 * API cannot be reached or its response cannot be trusted.
 */
const FALLBACK_REPOSITORIES: GitHubRepository[] = [
	{
		name: 'yamkelajojo',
		fullName: 'yamkelajojo/yamkelajojo',
		description:
			'Personal developer portfolio engineered with SvelteKit, Svelte 5, TypeScript, Bits UI, Tailwind CSS, and Cloudflare Workers.',
		htmlUrl: 'https://github.com/yamkelajojo/yamkelajojo',
		homepage: null,
		language: 'TypeScript',
		stars: 0,
		forks: 0,
		topics: ['sveltekit', 'svelte-5', 'typescript', 'bits-ui', 'cloudflare-workers', 'tdd'],
		createdAt: '2026-10-03T03:36:18Z',
		updatedAt: '2026-10-03T07:13:14Z',
		pushedAt: '2026-10-03T07:13:11Z',
		defaultBranch: null,
		visibility: 'public',
		isFork: false,
		isArchived: false
	},
	{
		name: 'greenbidder',
		fullName: 'yamkelajojo/greenbidder',
		description:
			'Cross-platform agricultural marketplace connecting farmers and buyers using React Native, Expo, Tamagui, Zod, and Supabase PostgreSQL with PostGIS geospatial queries.',
		htmlUrl: 'https://github.com/yamkelajojo/greenbidder',
		homepage: null,
		language: 'JavaScript',
		stars: 0,
		forks: 0,
		topics: ['react-native', 'expo', 'supabase', 'postgis', 'tamagui', 'zod'],
		createdAt: '2026-04-10T09:39:24Z',
		updatedAt: '2026-05-05T18:28:58Z',
		pushedAt: '2026-09-21T04:34:48Z',
		defaultBranch: null,
		visibility: 'public',
		isFork: false,
		isArchived: false
	},
	{
		name: 'Odin-Recipes-2',
		fullName: 'yamkelajojo/Odin-Recipes-2',
		description: 'PHP Laravel Inertia Vue project with SQLite',
		htmlUrl: 'https://github.com/yamkelajojo/Odin-Recipes-2',
		homepage: null,
		language: 'Blade',
		stars: 0,
		forks: 0,
		topics: ['laravel', 'php', 'inertiajs', 'vuejs', 'sqlite', 'tailwindcss'],
		createdAt: '2025-08-11T20:31:16Z',
		updatedAt: '2025-08-11T20:53:23Z',
		pushedAt: '2025-08-11T20:53:20Z',
		defaultBranch: null,
		visibility: 'public',
		isFork: false,
		isArchived: false
	},
	{
		name: 'odin_recipes',
		fullName: 'yamkelajojo/odin_recipes',
		description:
			'Full-stack Laravel & Inertia.js recipe management platform with relational models for ingredients, food categories, and multi-step preparation stages.',
		htmlUrl: 'https://github.com/yamkelajojo/odin_recipes',
		homepage: null,
		language: 'PHP',
		stars: 0,
		forks: 0,
		topics: ['php', 'laravel', 'eloquent', 'vuejs', 'tailwindcss'],
		createdAt: '2025-01-11T19:25:51Z',
		updatedAt: '2025-05-10T01:17:34Z',
		pushedAt: '2025-05-10T01:17:31Z',
		defaultBranch: null,
		visibility: 'public',
		isFork: false,
		isArchived: false
	},
	{
		name: 'fm2_unsupervised_machine_learning',
		fullName: 'yamkelajojo/fm2_unsupervised_machine_learning',
		description:
			'Movie recommendation engine implementing collaborative filtering and content-based filtering pipelines deployed with Streamlit.',
		htmlUrl: 'https://github.com/yamkelajojo/fm2_unsupervised_machine_learning',
		homepage: null,
		language: 'Jupyter Notebook',
		stars: 0,
		forks: 0,
		topics: ['machine-learning', 'recommender-system', 'streamlit', 'python'],
		createdAt: '2024-04-02T08:09:59Z',
		updatedAt: '2024-04-11T23:46:40Z',
		pushedAt: '2024-04-12T12:15:10Z',
		defaultBranch: null,
		visibility: 'public',
		isFork: false,
		isArchived: false
	},
	{
		name: 'FM1_EA_Twitter_Sentiment_Classification_2023-2024',
		fullName: 'yamkelajojo/FM1_EA_Twitter_Sentiment_Classification_2023-2024',
		description:
			'Streamlit web application and NLP pipeline classifying climate change tweets into Supportive, Skeptical, Action-oriented, or Informational sentiment classes.',
		htmlUrl: 'https://github.com/yamkelajojo/FM1_EA_Twitter_Sentiment_Classification_2023-2024',
		homepage: null,
		language: 'Jupyter Notebook',
		stars: 0,
		forks: 0,
		topics: ['nlp', 'scikit-learn', 'nltk', 'streamlit', 'sentiment-analysis'],
		createdAt: '2024-02-15T14:14:30Z',
		updatedAt: '2024-03-06T11:34:12Z',
		pushedAt: '2024-03-12T23:28:18Z',
		defaultBranch: null,
		visibility: 'public',
		isFork: false,
		isArchived: false
	},
	{
		name: 'classification-predict-streamlit-template',
		fullName: 'yamkelajojo/classification-predict-streamlit-template',
		description: 'Template repository for the EDSA Classification Predict',
		htmlUrl: 'https://github.com/yamkelajojo/classification-predict-streamlit-template',
		homepage: 'https://explore-datascience.net/',
		language: 'Jupyter Notebook',
		stars: 0,
		forks: 1,
		topics: [],
		createdAt: '2024-02-13T14:10:37Z',
		updatedAt: '2024-02-22T12:11:36Z',
		pushedAt: '2024-03-07T18:51:05Z',
		defaultBranch: null,
		visibility: 'public',
		isFork: true,
		isArchived: false
	},
	{
		name: 'load-shortfall-regression-predict-api',
		fullName: 'yamkelajojo/load-shortfall-regression-predict-api',
		description: 'Regression model API workflow for predicting renewable energy load shortfall.',
		htmlUrl: 'https://github.com/yamkelajojo/load-shortfall-regression-predict-api',
		homepage: null,
		language: 'Python',
		stars: 0,
		forks: 0,
		topics: ['regression', 'python', 'data-science'],
		createdAt: '2024-01-19T14:47:28Z',
		updatedAt: '2024-01-19T14:47:28Z',
		pushedAt: '2023-11-20T16:23:33Z',
		defaultBranch: null,
		visibility: 'public',
		isFork: true,
		isArchived: false
	},
	{
		name: 'dojodonedidit-drumkit-w-nuxt',
		fullName: 'yamkelajojo/dojodonedidit-drumkit-w-nuxt',
		description:
			"A website where you play musical drumkits (utilizes keypresses as well). It's built with the nuxt.js framework based off of Wesbos's tutorial but with my own personal twists and drums.",
		htmlUrl: 'https://github.com/yamkelajojo/dojodonedidit-drumkit-w-nuxt',
		homepage: null,
		language: 'Vue',
		stars: 0,
		forks: 0,
		topics: ['music-composition', 'nuxtjs'],
		createdAt: '2023-06-10T13:19:37Z',
		updatedAt: '2023-06-17T13:53:12Z',
		pushedAt: '2023-08-29T07:11:04Z',
		defaultBranch: null,
		visibility: 'public',
		isFork: false,
		isArchived: false
	},
	{
		name: 'unsupervised-predict-streamlit-template',
		fullName: 'yamkelajojo/unsupervised-predict-streamlit-template',
		description: 'Streamlit-based recommender system for the EDSA Unsupervised Sprint',
		htmlUrl: 'https://github.com/yamkelajojo/unsupervised-predict-streamlit-template',
		homepage: null,
		language: 'Python',
		stars: 0,
		forks: 0,
		topics: [],
		createdAt: '2024-03-21T16:21:28Z',
		updatedAt: '2024-04-02T08:07:23Z',
		pushedAt: '2023-07-28T13:41:23Z',
		defaultBranch: null,
		visibility: 'public',
		isFork: true,
		isArchived: false
	}
];

export function getFallbackRepositories(): GitHubRepository[] {
	return FALLBACK_REPOSITORIES.map((repo) => ({
		...repo,
		topics: [...repo.topics]
	}));
}
