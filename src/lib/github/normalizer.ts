import type { GitHubRepository } from '$lib/types';

function toCleanNullableString(value: unknown): string | null {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}

function toNonNegativeInt(value: unknown): number {
	const num = typeof value === 'number' ? value : Number(value);
	if (!Number.isFinite(num) || num < 0) return 0;
	return Math.floor(num);
}

function isSafeHttpUrl(value: string): boolean {
	try {
		const parsed = new URL(value);
		return (
			(parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
			parsed.username.length === 0 &&
			parsed.password.length === 0
		);
	} catch {
		return false;
	}
}

function activityTimestamp(repo: GitHubRepository): number {
	for (const value of [repo.pushedAt, repo.updatedAt, repo.createdAt]) {
		if (!value) continue;
		const timestamp = Date.parse(value);
		if (Number.isFinite(timestamp)) return timestamp;
	}
	return 0;
}

export function sortGitHubRepositories(repositories: GitHubRepository[]): GitHubRepository[] {
	return [...repositories].sort((a, b) => {
		const activityDifference = activityTimestamp(b) - activityTimestamp(a);
		return activityDifference || a.name.localeCompare(b.name);
	});
}

export function normalizeGitHubRepo(raw: unknown): GitHubRepository | null {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
		return null;
	}

	const record = raw as Record<string, unknown>;
	const visibility = toCleanNullableString(record.visibility);
	const normalizedVisibility = visibility?.toLowerCase() ?? null;
	const privateFlag = record.private;
	const hasMalformedPrivateFlag = privateFlag !== undefined && typeof privateFlag !== 'boolean';
	const isKnownNonPublic =
		privateFlag === true || (normalizedVisibility !== null && normalizedVisibility !== 'public');
	const isKnownPublic = privateFlag === false || normalizedVisibility === 'public';

	if (hasMalformedPrivateFlag || isKnownNonPublic || !isKnownPublic) {
		return null;
	}

	const name = toCleanNullableString(record.name);
	const htmlUrl = toCleanNullableString(record.html_url ?? record.htmlUrl);

	if (!name || !htmlUrl || !isSafeHttpUrl(htmlUrl)) {
		return null;
	}

	const fullName =
		toCleanNullableString(record.full_name ?? record.fullName) ?? `yamkelajojo/${name}`;
	const description = toCleanNullableString(record.description);
	const rawHomepage = toCleanNullableString(record.homepage);
	const homepage = rawHomepage && isSafeHttpUrl(rawHomepage) ? rawHomepage : null;
	const language = toCleanNullableString(record.language);

	const stars = toNonNegativeInt(record.stargazers_count ?? record.stars);
	const forks = toNonNegativeInt(record.forks_count ?? record.forks);

	const rawTopics = Array.isArray(record.topics) ? record.topics : [];
	const topics = Array.from(
		new Set(
			rawTopics
				.filter((item): item is string => typeof item === 'string')
				.map((item) => item.trim())
				.filter((item) => item.length > 0)
		)
	);

	return {
		name,
		fullName,
		description,
		htmlUrl,
		homepage,
		language,
		stars,
		forks,
		topics,
		createdAt: toCleanNullableString(record.created_at ?? record.createdAt),
		updatedAt: toCleanNullableString(record.updated_at ?? record.updatedAt),
		pushedAt: toCleanNullableString(record.pushed_at ?? record.pushedAt),
		defaultBranch: toCleanNullableString(record.default_branch ?? record.defaultBranch),
		visibility: toCleanNullableString(record.visibility),
		isFork: record.fork === true || record.isFork === true,
		isArchived: record.archived === true || record.isArchived === true
	};
}

export function normalizeGitHubRepos(rawList: unknown): GitHubRepository[] {
	if (!Array.isArray(rawList)) {
		return [];
	}

	const normalized: GitHubRepository[] = [];
	for (const item of rawList) {
		const repo = normalizeGitHubRepo(item);
		if (repo) {
			normalized.push(repo);
		}
	}

	return sortGitHubRepositories(normalized);
}

export type RepositoryFilterOptions = {
	query?: string;
	language?: string;
	includeForks?: boolean;
	sortBy?: 'updated' | 'stars' | 'name';
};

export function extractAvailableLanguages(repos: GitHubRepository[]): string[] {
	const set = new Set<string>();
	for (const repo of repos) {
		if (repo.language) {
			set.add(repo.language);
		}
	}
	return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function filterAndSortRepositories(
	repos: GitHubRepository[],
	options: RepositoryFilterOptions = {}
): GitHubRepository[] {
	const query = options.query?.trim().toLowerCase() ?? '';
	const language = options.language?.trim() ?? 'All';
	const includeForks = options.includeForks ?? true;
	const sortBy = options.sortBy ?? 'updated';

	const filtered = repos.filter((repo) => {
		if (!includeForks && repo.isFork) {
			return false;
		}
		if (language && language !== 'All' && repo.language !== language) {
			return false;
		}
		if (query.length > 0) {
			const searchableText = [repo.name, repo.fullName, repo.description, repo.language, ...repo.topics]
				.filter((value): value is string => typeof value === 'string')
				.join(' ')
				.toLowerCase();
			return searchableText.includes(query);
		}
		return true;
	});

	if (sortBy === 'name') return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
	const byActivity = sortGitHubRepositories(filtered);
	return sortBy === 'stars' ? byActivity.sort((a, b) => b.stars - a.stars) : byActivity;
}
