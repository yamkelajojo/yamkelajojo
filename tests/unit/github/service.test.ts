import { describe, expect, it, vi } from 'vitest';
import { createGitHubCache } from '$lib/github/cache';
import { fetchUserRepositories } from '$lib/github/service';

const mockRawRepos = [
	{
		name: 'yamkelajojo',
		full_name: 'yamkelajojo/yamkelajojo',
		description: 'Personal developer portfolio built with SvelteKit 5 and Cloudflare Workers.',
		html_url: 'https://github.com/yamkelajojo/yamkelajojo',
		homepage: 'https://yamkelajojo.workers.dev',
		language: 'TypeScript',
		stargazers_count: 2,
		forks_count: 0,
		topics: ['sveltekit', 'cloudflare-workers', 'tdd'],
		created_at: '2026-10-03T03:36:18Z',
		updated_at: '2026-10-03T07:13:14Z',
		pushed_at: '2026-10-03T07:13:11Z',
		fork: false,
		archived: false,
		private: false
	}
];

describe('GITHUB-001, GITHUB-002 & GITHUB-003 — GitHub repository service and failure recovery', () => {
	it('fetches live GitHub data on cache miss and serves subsequent calls from cache without extra API hits', async () => {
		const cache = createGitHubCache({ freshTtlMs: 60_000, maxStaleMs: 300_000 });
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => mockRawRepos
		});

		const first = await fetchUserRepositories({
			username: 'yamkelajojo',
			fetchImpl: mockFetch as unknown as typeof fetch,
			cache,
			now: 1000
		});

		expect(first.source).toBe('live');
		expect(first.isStale).toBe(false);
		expect(first.errorMessage).toBeNull();
		expect(first.repositories.length).toBe(1);
		expect(first.repositories[0]?.name).toBe('yamkelajojo');
		expect(mockFetch).toHaveBeenCalledTimes(1);

		const second = await fetchUserRepositories({
			username: 'yamkelajojo',
			fetchImpl: mockFetch as unknown as typeof fetch,
			cache,
			now: 5000
		});

		expect(second.source).toBe('cache');
		expect(second.isStale).toBe(false);
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});

	it('falls back to stale cache when GitHub API returns 403 rate limit or 500 error after TTL', async () => {
		const cache = createGitHubCache({ freshTtlMs: 1000, maxStaleMs: 60_000 });
		const successFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => mockRawRepos
		});

		await fetchUserRepositories({
			username: 'yamkelajojo',
			fetchImpl: successFetch as unknown as typeof fetch,
			cache,
			now: 1000
		});

		const rateLimitedFetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 403,
			json: async () => ({ message: 'API rate limit exceeded' })
		});

		const result = await fetchUserRepositories({
			username: 'yamkelajojo',
			fetchImpl: rateLimitedFetch as unknown as typeof fetch,
			cache,
			now: 5000
		});

		expect(result.source).toBe('stale-cache');
		expect(result.isStale).toBe(true);
		expect(result.repositories[0]?.name).toBe('yamkelajojo');
		expect(result.errorMessage).toContain('cached');
	});

	it('falls back to curated repository snapshot when GitHub fails or times out on a cold cache without exposing raw errors', async () => {
		const cache = createGitHubCache({ freshTtlMs: 1000, maxStaleMs: 60_000 });
		const hangingFetch = vi.fn().mockImplementation(
			(_url: string, init?: RequestInit) =>
				new Promise((_resolve, reject) => {
					init?.signal?.addEventListener('abort', () => {
						reject(new Error('AbortError: request timed out'));
					});
				})
		);

		const result = await fetchUserRepositories({
			username: 'yamkelajojo',
			fetchImpl: hangingFetch as unknown as typeof fetch,
			cache,
			timeoutMs: 15,
			now: 1000
		});

		expect(result.source).toBe('fallback');
		expect(result.isStale).toBe(true);
		expect(result.repositories.length).toBeGreaterThanOrEqual(6);
		expect(result.errorMessage).not.toContain('AbortError');
	});

	it('sends Authorization Bearer token header when token is provided and handles non-array JSON payload safely', async () => {
		const cache = createGitHubCache({ freshTtlMs: 1000, maxStaleMs: 60_000 });
		const nonArrayFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ unexpected: true })
		});

		const result = await fetchUserRepositories({
			username: 'yamkelajojo',
			token: 'ghp_test_token_123',
			fetchImpl: nonArrayFetch as unknown as typeof fetch,
			cache,
			now: 1000
		});

		expect(nonArrayFetch).toHaveBeenCalledWith(
			expect.stringContaining('users/yamkelajojo/repos'),
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: 'Bearer ghp_test_token_123'
				})
			})
		);
		expect(result.source).toBe('fallback');
	});
});
