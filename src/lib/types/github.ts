export type GitHubRepository = {
	name: string;
	fullName: string;
	description: string | null;
	htmlUrl: string;
	homepage: string | null;
	language: string | null;
	stars: number;
	forks: number;
	topics: string[];
	createdAt: string | null;
	updatedAt: string | null;
	pushedAt: string | null;
	defaultBranch: string | null;
	visibility: string | null;
	isFork: boolean;
	isArchived: boolean;
};

export type GitHubDataSource = 'github-api' | 'fallback-snapshot';

export type GitHubSyncFailureCode =
	| 'unavailable'
	| 'rate-limited'
	| 'timeout'
	| 'invalid-response'
	| 'too-many-pages'
	| 'invalid-configuration';

export type GitHubRepositoriesResult = {
	repositories: GitHubRepository[];
	source: GitHubDataSource;
	fetchedAt: string | null;
	failureCode: GitHubSyncFailureCode | null;
	errorMessage: string | null;
};
