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
	createdAt: string;
	updatedAt: string;
	pushedAt: string | null;
	defaultBranch?: string;
	visibility?: string;
	isFork?: boolean;
	isArchived?: boolean;
};

export type GitHubDataSource = 'live' | 'cache' | 'stale-cache' | 'fallback';

export type GitHubRepositoriesResult = {
	repositories: GitHubRepository[];
	source: GitHubDataSource;
	fetchedAt: string;
	isStale: boolean;
	errorMessage: string | null;
};
