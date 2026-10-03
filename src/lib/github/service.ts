import type { GitHubRepositoriesResult } from '$lib/types';
import { defaultGitHubCache, type GitHubCache } from './cache';
import { getFallbackRepositories } from './fallback';
import { normalizeGitHubRepos } from './normalizer';

export type FetchUserRepositoriesOptions = {
	username?: string;
	token?: string;
	fetchImpl?: typeof fetch;
	cache?: GitHubCache;
	forceRefresh?: boolean;
	timeoutMs?: number;
	now?: number;
};

export async function fetchUserRepositories(
	options: FetchUserRepositoriesOptions = {}
): Promise<GitHubRepositoriesResult> {
	const username = options.username ?? 'yamkelajojo';
	const fetchImpl = options.fetchImpl ?? fetch;
	const cache = options.cache ?? defaultGitHubCache;
	const forceRefresh = options.forceRefresh ?? false;
	const timeoutMs = options.timeoutMs ?? 4500;
	const now = options.now ?? Date.now();

	const cacheLookup = cache.get(username, now);

	if (!forceRefresh && cacheLookup.status === 'fresh') {
		return {
			repositories: cacheLookup.data,
			source: 'cache',
			fetchedAt: cacheLookup.fetchedAt,
			isStale: false,
			errorMessage: null
		};
	}

	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const headers: Record<string, string> = {
			Accept: 'application/vnd.github+json',
			'User-Agent': 'yamkelajojo-portfolio/1.0',
			'X-GitHub-Api-Version': '2022-11-28'
		};

		if (options.token && options.token.trim().length > 0) {
			headers.Authorization = `Bearer ${options.token.trim()}`;
		}

		const response = await fetchImpl(
			`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
			{
				headers,
				signal: controller.signal
			}
		);

		if (!response.ok) {
			throw new Error(`GitHub API HTTP ${response.status}`);
		}

		const payload = await response.json();
		if (!Array.isArray(payload)) {
			throw new Error('Unexpected GitHub API payload shape');
		}

		const normalized = normalizeGitHubRepos(payload);
		cache.set(username, normalized, now);

		return {
			repositories: normalized,
			source: 'live',
			fetchedAt: new Date(now).toISOString(),
			isStale: false,
			errorMessage: null
		};
	} catch {
		if (cacheLookup.status === 'stale' || cacheLookup.status === 'fresh') {
			return {
				repositories: cacheLookup.data,
				source: 'stale-cache',
				fetchedAt: cacheLookup.fetchedAt,
				isStale: true,
				errorMessage:
					'Live GitHub synchronization is temporarily unavailable; displaying cached repository metadata.'
			};
		}

		return {
			repositories: getFallbackRepositories(),
			source: 'fallback',
			fetchedAt: new Date(now).toISOString(),
			isStale: true,
			errorMessage:
				'Live GitHub API could not be reached right now; displaying verified repository snapshot.'
		};
	} finally {
		clearTimeout(timer);
	}
}
