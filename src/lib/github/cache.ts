import type { GitHubRepository } from '$lib/types';

export type CacheLookupResult =
	| { status: 'miss' }
	| { status: 'fresh'; data: GitHubRepository[]; fetchedAt: string }
	| { status: 'stale'; data: GitHubRepository[]; fetchedAt: string };

export type GitHubCache = {
	get(key: string, now?: number): CacheLookupResult;
	set(key: string, data: GitHubRepository[], now?: number): void;
	clear(): void;
};

type CacheEntry = {
	data: GitHubRepository[];
	timestamp: number;
	fetchedAt: string;
};

export function createGitHubCache(options?: {
	freshTtlMs?: number;
	maxStaleMs?: number;
}): GitHubCache {
	const freshTtlMs = options?.freshTtlMs ?? 15 * 60 * 1000; // 15 minutes
	const maxStaleMs = options?.maxStaleMs ?? 24 * 60 * 60 * 1000; // 24 hours
	const store = new Map<string, CacheEntry>();

	return {
		get(key: string, now = Date.now()): CacheLookupResult {
			const entry = store.get(key);
			if (!entry) {
				return { status: 'miss' };
			}
			const age = now - entry.timestamp;
			if (age <= freshTtlMs) {
				return {
					status: 'fresh',
					data: entry.data,
					fetchedAt: entry.fetchedAt
				};
			}
			if (age <= maxStaleMs) {
				return {
					status: 'stale',
					data: entry.data,
					fetchedAt: entry.fetchedAt
				};
			}
			store.delete(key);
			return { status: 'miss' };
		},
		set(key: string, data: GitHubRepository[], now = Date.now()): void {
			store.set(key, {
				data,
				timestamp: now,
				fetchedAt: new Date(now).toISOString()
			});
		},
		clear(): void {
			store.clear();
		}
	};
}

export const defaultGitHubCache = createGitHubCache();
