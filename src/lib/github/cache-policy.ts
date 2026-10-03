import type { GitHubDataSource, GitHubSyncFailureCode } from '$lib/types';

/**
 * Cloudflare Workers Caching honours these standard Cache-Control directives.
 * No `s-maxage` is used: browser freshness and edge freshness remain explicit.
 */
export const PUBLIC_GITHUB_CACHE_CONTROL =
	'public, max-age=1800, stale-while-revalidate=1800, stale-if-error=86400';
export const SNAPSHOT_GITHUB_CACHE_CONTROL =
	'public, max-age=300, stale-while-revalidate=300';
export const PUBLIC_PAGE_CACHE_CONTROL =
	'public, max-age=3600, stale-while-revalidate=86400, stale-if-error=604800';
export const PRIVATE_NO_STORE_CACHE_CONTROL = 'private, no-store';

export type GitHubResponseMetadataInput = {
	source: GitHubDataSource;
	failureCode: GitHubSyncFailureCode | null;
};

export type GitHubResponseMetadata = {
	status: 200 | 503;
	headers: Record<string, string>;
};

export function getGitHubResponseMetadata({
	source,
	failureCode
}: GitHubResponseMetadataInput): GitHubResponseMetadata {
	const failed = source === 'fallback-snapshot' || failureCode !== null;

	if (failed) {
		return {
			status: 503,
			headers: {
				'Cache-Control': SNAPSHOT_GITHUB_CACHE_CONTROL,
				'X-GitHub-Data-Source': 'fallback-snapshot',
				'Retry-After': '300'
			}
		};
	}

	return {
		status: 200,
		headers: {
			'Cache-Control': PUBLIC_GITHUB_CACHE_CONTROL,
			'X-GitHub-Data-Source': 'github-api'
		}
	};
}
