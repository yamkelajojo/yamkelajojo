import { describe, expect, it, vi } from 'vitest';
import { getFallbackRepositories } from '$lib/github/fallback';
import { fetchUserRepositories } from '$lib/github/service';
import type { GitHubRepository } from '$lib/types';

function rawRepo(
	name: string,
	options: Partial<{
		stars: number;
		language: string | null;
		fork: boolean;
		archived: boolean;
		pushedAt: string | null;
	}> = {}
) {
	return {
		name,
		full_name: `yamkelajojo/${name}`,
		description: `${name} repository`,
		html_url: `https://github.com/yamkelajojo/${name}`,
		homepage: null,
		language: options.language ?? 'TypeScript',
		stargazers_count: options.stars ?? 0,
		forks_count: 0,
		topics: ['portfolio'],
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2026-10-01T00:00:00Z',
		pushed_at: options.pushedAt === undefined ? '2026-10-02T00:00:00Z' : options.pushedAt,
		fork: options.fork ?? false,
		archived: options.archived ?? false,
		private: false
	};
}

function jsonResponse(
	payload: unknown,
	status = 200,
	headers: Record<string, string> = {}
): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers }
	});
}

function mockFetch(...responses: Response[]) {
	const fetchImpl = vi.fn();
	for (const response of responses) fetchImpl.mockResolvedValueOnce(response);
	return fetchImpl as unknown as typeof fetch;
}

describe('GitHub synchronization service — direct fetch, pagination and bounded fallback', () => {
	it('fetches public repositories on every Worker invocation without process-local cached state', async () => {
		const fetchImpl = mockFetch(
			jsonResponse([rawRepo('portfolio', { stars: 2 })]),
			jsonResponse([rawRepo('portfolio', { stars: 3 })])
		);

		const first = await fetchUserRepositories({
			username: 'yamkelajojo',
			fetchImpl,
			now: Date.parse('2026-10-03T12:00:00Z')
		});
		const second = await fetchUserRepositories({
			username: 'yamkelajojo',
			fetchImpl,
			now: Date.parse('2026-10-03T12:01:00Z')
		});

		expect(first.source).toBe('github-api');
		expect(first.failureCode).toBeNull();
		expect(first.fetchedAt).toBe('2026-10-03T12:00:00.000Z');
		expect(first.repositories[0]?.stars).toBe(2);
		expect(second.repositories[0]?.stars).toBe(3);
		expect(fetchImpl).toHaveBeenCalledTimes(2);

		const [requestedUrl, init] = vi.mocked(fetchImpl).mock.calls[0] as [string, RequestInit];
		const parsedUrl = new URL(requestedUrl);
		expect(parsedUrl.origin).toBe('https://api.github.com');
		expect(parsedUrl.pathname).toBe('/users/yamkelajojo/repos');
		expect(parsedUrl.searchParams.get('per_page')).toBe('100');
		expect(parsedUrl.searchParams.get('sort')).toBe('pushed');
		expect(parsedUrl.searchParams.get('page')).toBe('1');
		expect(init.redirect).toBe('manual');
		const requestHeaders = new Headers(init.headers);
		expect(requestHeaders.get('Accept')).toBe('application/vnd.github+json');
		expect(requestHeaders.get('X-GitHub-Api-Version')).toBe('2022-11-28');
	});

	it('treats an empty GitHub repository list as a valid successful synchronization', async () => {
		const result = await fetchUserRepositories({ fetchImpl: mockFetch(jsonResponse([])) });

		expect(result).toMatchObject({
			source: 'github-api',
			repositories: [],
			failureCode: null,
			errorMessage: null
		});
	});

	it('never exposes private or internal repositories returned to an authenticated API client', async () => {
		const result = await fetchUserRepositories({
			fetchImpl: mockFetch(
				jsonResponse([
					{ ...rawRepo('private-flag'), private: true },
					{ ...rawRepo('private-visibility'), private: false, visibility: 'PRIVATE' },
					{ ...rawRepo('internal-visibility'), private: false, visibility: 'INTERNAL' }
				])
			)
		});

		expect(result.source).toBe('github-api');
		expect(result.repositories).toEqual([]);
	});

	it('follows GitHub pagination and includes repositories beyond the first 100', async () => {
		const firstPage = Array.from({ length: 100 }, (_, index) => rawRepo(`repo-${index}`));
		const secondPage = [rawRepo('repo-100')];
		const nextPage =
			'https://api.github.com/users/yamkelajojo/repos?sort=pushed&per_page=100&page=2';
		const fetchImpl = mockFetch(
			jsonResponse(firstPage, 200, {
				Link: `<${nextPage}>; rel="next", <${nextPage}>; rel="last"`
			}),
			jsonResponse(secondPage)
		);

		const result = await fetchUserRepositories({ fetchImpl });

		expect(fetchImpl).toHaveBeenCalledTimes(2);
		expect(result.source).toBe('github-api');
		expect(result.repositories).toHaveLength(101);
		expect(result.repositories.some((repo) => repo.name === 'repo-100')).toBe(true);
	});

	it('stops safely when GitHub pagination exceeds the service page limit', async () => {
		const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
			const url = new URL(String(input));
			const nextPage = new URL(url);
			nextPage.searchParams.set('page', String(Number(url.searchParams.get('page')) + 1));
			return jsonResponse([rawRepo(`repo-${url.searchParams.get('page')}`)], 200, {
				Link: `<${nextPage}>; rel="next"`
			});
		}) as unknown as typeof fetch;

		const result = await fetchUserRepositories({ fetchImpl });

		expect(result.source).toBe('fallback-snapshot');
		expect(result.failureCode).toBe('too-many-pages');
		expect(result.repositories.length).toBeGreaterThan(0);
		expect(fetchImpl).toHaveBeenCalledTimes(20);
	});
});

describe('GitHub synchronization failure handling', () => {
	it('does not follow an upstream redirect and reports it as an unavailable response', async () => {
		const fetchImpl = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
			expect(init?.redirect).toBe('manual');
			return new Response(null, {
				status: 302,
				headers: { Location: 'https://attacker.example/collect' }
			});
		}) as unknown as typeof fetch;

		const result = await fetchUserRepositories({ fetchImpl });

		expect(fetchImpl).toHaveBeenCalledOnce();
		expect(result.source).toBe('fallback-snapshot');
		expect(result.failureCode).toBe('unavailable');
	});

	const httpFailures: Array<{
		status: number;
		headers: Record<string, string>;
		failureCode: 'rate-limited' | 'unavailable';
	}> = [
		{ status: 403, headers: { 'X-RateLimit-Remaining': '0' }, failureCode: 'rate-limited' },
		{ status: 429, headers: {}, failureCode: 'rate-limited' },
		{ status: 503, headers: {}, failureCode: 'unavailable' }
	];

	it.each(httpFailures)('returns a maintained snapshot for HTTP $status without leaking upstream details', async ({
		status,
		headers,
		failureCode
	}) => {
		const fetchImpl = mockFetch(
			jsonResponse({ message: 'upstream diagnostic that must not be shown' }, status, headers)
		);

		const result = await fetchUserRepositories({ fetchImpl });

		expect(result.source).toBe('fallback-snapshot');
		expect(result.failureCode).toBe(failureCode);
		expect(result.fetchedAt).toBeNull();
		expect(result.repositories).toEqual(getFallbackRepositories());
		expect(result.errorMessage).not.toContain('upstream diagnostic');
		expect(result.errorMessage).not.toContain(String(status));
	});

	it('classifies malformed JSON, a non-array response and an unsafe pagination link as invalid responses', async () => {
		const invalidJsonFetch = vi.fn().mockResolvedValue(
			new Response('{', { status: 200, headers: { 'Content-Type': 'application/json' } })
		);
		const nonArrayFetch = mockFetch(jsonResponse({ items: [] }));
		const malformedItemsFetch = mockFetch(jsonResponse([null, { name: 'missing-url' }]));
		const unsafeNextLinkFetch = mockFetch(
			jsonResponse([rawRepo('first')], 200, {
				Link: '<https://attacker.example/repos?page=2>; rel="next"'
			})
		);

		for (const fetchImpl of [
			invalidJsonFetch as unknown as typeof fetch,
			nonArrayFetch,
			malformedItemsFetch,
			unsafeNextLinkFetch
		]) {
			const result = await fetchUserRepositories({ fetchImpl });
			expect(result.source).toBe('fallback-snapshot');
			expect(result.failureCode).toBe('invalid-response');
		}
	});

	it('aborts a hung GitHub request and reports a timeout while keeping the fallback usable', async () => {
		const hangingFetch = vi.fn(
			(_input: RequestInfo | URL, init?: RequestInit) =>
				new Promise<Response>((_resolve, reject) => {
					init?.signal?.addEventListener('abort', () => {
						reject(new DOMException('request timed out', 'AbortError'));
					});
				})
		);

		const result = await fetchUserRepositories({
			fetchImpl: hangingFetch as unknown as typeof fetch,
			timeoutMs: 10
		});

		expect(hangingFetch).toHaveBeenCalledOnce();
		expect(result.source).toBe('fallback-snapshot');
		expect(result.failureCode).toBe('timeout');
		expect(result.errorMessage).not.toContain('AbortError');
		expect(result.repositories.length).toBeGreaterThan(0);
	});

	it('sends a token only to the official GitHub API origin, never to a configured local test origin', async () => {
		const fetchImpl = mockFetch(jsonResponse([]));
		await fetchUserRepositories({
			token: 'test-secret',
			apiBaseUrl: 'http://127.0.0.1:8788',
			fetchImpl
		});

		const [, init] = vi.mocked(fetchImpl).mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).has('Authorization')).toBe(false);

		const officialFetch = mockFetch(jsonResponse([]));
		await fetchUserRepositories({ token: 'test-secret', fetchImpl: officialFetch });
		const [, officialInit] = vi.mocked(officialFetch).mock.calls[0] as [string, RequestInit];
		expect(new Headers(officialInit.headers).get('Authorization')).toBe('Bearer test-secret');
	});
});

function typedRepo(repo: GitHubRepository) {
	return repo;
}

it('normalizes repository metadata into the public domain model', async () => {
	const result = await fetchUserRepositories({
		fetchImpl: mockFetch(jsonResponse([rawRepo('typed', { fork: true, archived: true })]))
	});

	expect(typedRepo(result.repositories[0]!)).toMatchObject({
		name: 'typed',
		isFork: true,
		isArchived: true
	});
});
