import { describe, expect, it } from 'vitest';
import { createGitHubCache } from '$lib/github/cache';
import type { GitHubRepository } from '$lib/types';

const sampleRepo: GitHubRepository = {
	name: 'yamkelajojo',
	fullName: 'yamkelajojo/yamkelajojo',
	description: 'My Portfolio.',
	htmlUrl: 'https://github.com/yamkelajojo/yamkelajojo',
	homepage: null,
	language: 'TypeScript',
	stars: 1,
	forks: 0,
	topics: ['sveltekit'],
	createdAt: '2026-10-03T03:36:18Z',
	updatedAt: '2026-10-03T07:13:14Z',
	pushedAt: '2026-10-03T07:13:11Z',
	isFork: false,
	isArchived: false
};

describe('GITHUB-002 — GitHub TTL and Stale-While-Revalidate cache', () => {
	it('returns miss when cache is empty', () => {
		const cache = createGitHubCache({ freshTtlMs: 1000, maxStaleMs: 5000 });
		expect(cache.get('yamkelajojo', 100)).toEqual({ status: 'miss' });
	});

	it('returns fresh within freshTtlMs and stale between freshTtlMs and maxStaleMs', () => {
		const cache = createGitHubCache({ freshTtlMs: 1000, maxStaleMs: 5000 });
		cache.set('yamkelajojo', [sampleRepo], 1000);

		const freshHit = cache.get('yamkelajojo', 1500);
		expect(freshHit.status).toBe('fresh');
		if (freshHit.status === 'fresh') {
			expect(freshHit.data).toEqual([sampleRepo]);
		}

		const staleHit = cache.get('yamkelajojo', 2500);
		expect(staleHit.status).toBe('stale');
		if (staleHit.status === 'stale') {
			expect(staleHit.data).toEqual([sampleRepo]);
		}

		const expiredMiss = cache.get('yamkelajojo', 7000);
		expect(expiredMiss.status).toBe('miss');
	});

	it('supports explicit cache clearing', () => {
		const cache = createGitHubCache({ freshTtlMs: 1000, maxStaleMs: 5000 });
		cache.set('yamkelajojo', [sampleRepo], 1000);
		cache.clear();
		expect(cache.get('yamkelajojo', 1100).status).toBe('miss');
	});
});
