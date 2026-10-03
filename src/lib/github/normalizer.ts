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
		return parsed.protocol === 'https:' || parsed.protocol === 'http:';
	} catch {
		return false;
	}
}

export function normalizeGitHubRepo(raw: unknown): GitHubRepository | null {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
		return null;
	}

	const record = raw as Record<string, unknown>;

	if (record.private === true) {
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
	const topics = rawTopics
		.filter((item): item is string => typeof item === 'string')
		.map((item) => item.trim())
		.filter((item) => item.length > 0);

	const createdAt =
		toCleanNullableString(record.created_at ?? record.createdAt) ?? new Date(0).toISOString();
	const updatedAt =
		toCleanNullableString(record.updated_at ?? record.updatedAt) ?? createdAt;
	const pushedAt = toCleanNullableString(record.pushed_at ?? record.pushedAt);
	const defaultBranch =
		toCleanNullableString(record.default_branch ?? record.defaultBranch) ?? 'main';
	const visibility =
		toCleanNullableString(record.visibility) ?? 'public';

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
		createdAt,
		updatedAt,
		pushedAt,
		defaultBranch,
		visibility,
		isFork: Boolean(record.fork ?? record.isFork),
		isArchived: Boolean(record.archived ?? record.isArchived)
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

	return normalized.sort((a, b) => {
		const dateA = Date.parse(a.pushedAt ?? a.updatedAt) || 0;
		const dateB = Date.parse(b.pushedAt ?? b.updatedAt) || 0;
		return dateB - dateA;
	});
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
			const inName = repo.name.toLowerCase().includes(query);
			const inDesc = repo.description?.toLowerCase().includes(query) ?? false;
			const inLang = repo.language?.toLowerCase().includes(query) ?? false;
			const inTopics = repo.topics.some((topic) => topic.toLowerCase().includes(query));
			return inName || inDesc || inLang || inTopics;
		}
		return true;
	});

	return filtered.sort((a, b) => {
		if (sortBy === 'stars') {
			if (b.stars !== a.stars) return b.stars - a.stars;
		} else if (sortBy === 'name') {
			return a.name.localeCompare(b.name);
		}
		const dateA = Date.parse(a.pushedAt ?? a.updatedAt) || 0;
		const dateB = Date.parse(b.pushedAt ?? b.updatedAt) || 0;
		return dateB - dateA;
	});
}
