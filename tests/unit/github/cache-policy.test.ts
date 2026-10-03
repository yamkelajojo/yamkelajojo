import { describe, expect, it } from 'vitest';
import {
	getGitHubResponseMetadata,
	PUBLIC_GITHUB_CACHE_CONTROL,
	SNAPSHOT_GITHUB_CACHE_CONTROL
} from '$lib/github/cache-policy';

describe('Cloudflare Workers Caching response policy', () => {
	it('allows successful GitHub responses to stay fresh briefly, revalidate on traffic and survive transient upstream failures', () => {
		const metadata = getGitHubResponseMetadata({
			source: 'github-api',
			failureCode: null
		});

		expect(metadata).toEqual({
			status: 200,
			headers: {
				'Cache-Control': PUBLIC_GITHUB_CACHE_CONTROL,
				'X-GitHub-Data-Source': 'github-api'
			}
		});
		expect(PUBLIC_GITHUB_CACHE_CONTROL).toContain('max-age=1800');
		expect(PUBLIC_GITHUB_CACHE_CONTROL).toContain('stale-while-revalidate=1800');
		expect(PUBLIC_GITHUB_CACHE_CONTROL).toContain('stale-if-error=86400');
		expect(PUBLIC_GITHUB_CACHE_CONTROL).not.toContain('s-maxage');
	});

	it('returns a cacheable, explicitly marked fallback response with a bounded retry window', () => {
		const metadata = getGitHubResponseMetadata({
			source: 'fallback-snapshot',
			failureCode: 'rate-limited'
		});

		expect(metadata).toEqual({
			status: 503,
			headers: {
				'Cache-Control': SNAPSHOT_GITHUB_CACHE_CONTROL,
				'X-GitHub-Data-Source': 'fallback-snapshot',
				'Retry-After': '300'
			}
		});
		expect(SNAPSHOT_GITHUB_CACHE_CONTROL).toContain('max-age=300');
		expect(SNAPSHOT_GITHUB_CACHE_CONTROL).toContain('stale-while-revalidate=300');
	});

	it('does not accidentally make a fallback response indistinguishable from fresh GitHub data', () => {
		const metadata = getGitHubResponseMetadata({
			source: 'fallback-snapshot',
			failureCode: 'unavailable'
		});

		expect(metadata.status).toBe(503);
		expect(metadata.headers['X-GitHub-Data-Source']).toBe('fallback-snapshot');
		expect(metadata.headers['Retry-After']).toBe('300');
	});
});
