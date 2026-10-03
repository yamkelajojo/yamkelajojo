import type {
	GitHubRepositoriesResult,
	GitHubRepository,
	GitHubSyncFailureCode
} from '$lib/types';
import { getFallbackRepositories } from './fallback';
import { normalizeGitHubRepo, sortGitHubRepositories } from './normalizer';

export const MAX_GITHUB_REPOSITORY_PAGES = 20;
export const DEFAULT_GITHUB_TIMEOUT_MS = 4500;
const DEFAULT_USERNAME = 'yamkelajojo';
const OFFICIAL_GITHUB_API_ORIGIN = 'https://api.github.com';

export type FetchUserRepositoriesOptions = {
	username?: string;
	token?: string;
	apiBaseUrl?: string;
	fetchImpl?: typeof fetch;
	timeoutMs?: number;
	now?: number;
};

class GitHubRequestError extends Error {
	constructor(readonly code: GitHubSyncFailureCode) {
		super(code);
		this.name = 'GitHubRequestError';
	}
}

const FAILURE_MESSAGES: Record<GitHubSyncFailureCode, string> = {
	unavailable: 'GitHub is temporarily unavailable.',
	'rate-limited': 'GitHub temporarily rate-limited the server.',
	timeout: 'GitHub did not respond before the synchronization timeout.',
	'invalid-response': 'GitHub returned repository data that could not be safely read.',
	'too-many-pages': 'The public repository list exceeded the safe pagination limit.',
	'invalid-configuration': 'GitHub synchronization is temporarily misconfigured.'
};

function safeError(code: GitHubSyncFailureCode): string {
	return `${FAILURE_MESSAGES[code]} Showing the maintained repository snapshot; the next cache miss or revalidation after its short response-cache window will try GitHub again.`;
}

function isAbortError(error: unknown): boolean {
	return error instanceof Error && error.name === 'AbortError';
}

function validateUsername(username: string): boolean {
	return /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(username);
}

function resolveApiBase(apiBaseUrl: string): URL {
	let baseUrl: URL;
	try {
		baseUrl = new URL(apiBaseUrl);
	} catch {
		throw new GitHubRequestError('invalid-configuration');
	}

	const isLoopbackHttp =
		baseUrl.protocol === 'http:' &&
		['localhost', '127.0.0.1', '[::1]'].includes(baseUrl.hostname);
	const isOfficialApi = baseUrl.origin === OFFICIAL_GITHUB_API_ORIGIN;

	if ((!isOfficialApi && !isLoopbackHttp) || baseUrl.username || baseUrl.password) {
		throw new GitHubRequestError('invalid-configuration');
	}

	return baseUrl;
}

function nextPageUrl(linkHeader: string | null): string | null {
	if (!linkHeader) return null;

	for (const link of linkHeader.split(/,(?=\s*<)/)) {
		const urlMatch = link.match(/<([^>]+)>/);
		const relationMatch = link.match(/;\s*rel="?([^";]+)"?/);
		if (!urlMatch || !relationMatch) continue;
		if (relationMatch[1]?.split(/\s+/).includes('next')) return urlMatch[1] ?? null;
	}

	return null;
}

function validateNextPageUrl(
	value: string,
	currentUrl: URL,
	username: string,
	currentPage: number
): URL {
	let parsed: URL;
	try {
		parsed = new URL(value, currentUrl);
	} catch {
		throw new GitHubRequestError('invalid-response');
	}

	const expectedPath = `/users/${encodeURIComponent(username)}/repos`;
	const page = Number(parsed.searchParams.get('page'));

	if (
		parsed.origin !== currentUrl.origin ||
		parsed.pathname !== expectedPath ||
		!Number.isInteger(page) ||
		page !== currentPage + 1
	) {
		throw new GitHubRequestError('invalid-response');
	}

	return parsed;
}

function classifyHttpFailure(response: Response): GitHubSyncFailureCode {
	if (response.status === 403 || response.status === 429) return 'rate-limited';
	if (response.status >= 500) return 'unavailable';
	return 'unavailable';
}

function fallbackResult(code: GitHubSyncFailureCode): GitHubRepositoriesResult {
	return {
		repositories: getFallbackRepositories(),
		source: 'fallback-snapshot',
		fetchedAt: null,
		failureCode: code,
		errorMessage: safeError(code)
	};
}

export async function fetchUserRepositories(
	options: FetchUserRepositoriesOptions = {}
): Promise<GitHubRepositoriesResult> {
	const username = (options.username ?? DEFAULT_USERNAME).trim();
	const fetchImpl = options.fetchImpl ?? fetch;
	const timeoutMs = options.timeoutMs ?? DEFAULT_GITHUB_TIMEOUT_MS;
	const requestTime = options.now ?? Date.now();
	let apiBase: URL;

	try {
		if (!validateUsername(username) || !Number.isFinite(timeoutMs) || timeoutMs <= 0) {
			throw new GitHubRequestError('invalid-configuration');
		}
		apiBase = resolveApiBase(options.apiBaseUrl ?? OFFICIAL_GITHUB_API_ORIGIN);
	} catch (error) {
		return fallbackResult(
			error instanceof GitHubRequestError ? error.code : 'invalid-configuration'
		);
	}

	const controller = new AbortController();
	let timedOut = false;
	const timer = setTimeout(() => {
		timedOut = true;
		controller.abort();
	}, timeoutMs);

	try {
		const headers = new Headers({
			Accept: 'application/vnd.github+json',
			'User-Agent': 'yamkelajojo-portfolio/1.0',
			'X-GitHub-Api-Version': '2022-11-28'
		});
		const token = options.token?.trim();
		if (token && apiBase.origin === OFFICIAL_GITHUB_API_ORIGIN) {
			headers.set('Authorization', `Bearer ${token}`);
		}

		const firstPage = new URL(`/users/${encodeURIComponent(username)}/repos`, apiBase);
		firstPage.searchParams.set('per_page', '100');
		firstPage.searchParams.set('sort', 'pushed');
		firstPage.searchParams.set('page', '1');

		const repositories: GitHubRepository[] = [];
		let pageUrl: URL | null = firstPage;
		let pageNumber = 1;

		while (pageUrl) {
			const response = await fetchImpl(pageUrl, {
				headers,
				signal: controller.signal,
				redirect: 'manual'
			});

			if (!response.ok) {
				throw new GitHubRequestError(classifyHttpFailure(response));
			}

			let payload: unknown;
			try {
				payload = await response.json();
			} catch {
				throw new GitHubRequestError('invalid-response');
			}

			if (!Array.isArray(payload)) {
				throw new GitHubRequestError('invalid-response');
			}

			for (const item of payload) {
				if (item && typeof item === 'object' && !Array.isArray(item)) {
					const record = item as Record<string, unknown>;
					const visibility =
						typeof record.visibility === 'string' ? record.visibility.trim().toLowerCase() : null;
					if (
						record.private === true ||
						(visibility !== null && visibility !== 'public')
					) {
						continue;
					}
				}

				const repository = normalizeGitHubRepo(item);
				if (!repository) throw new GitHubRequestError('invalid-response');
				repositories.push(repository);
			}

			const next = nextPageUrl(response.headers.get('Link'));
			if (!next) {
				pageUrl = null;
				continue;
			}

			if (pageNumber >= MAX_GITHUB_REPOSITORY_PAGES) {
				throw new GitHubRequestError('too-many-pages');
			}

			pageUrl = validateNextPageUrl(next, pageUrl, username, pageNumber);
			pageNumber += 1;
		}

		const sortedRepositories = sortGitHubRepositories(repositories);

		return {
			repositories: sortedRepositories,
			source: 'github-api',
			fetchedAt: new Date(requestTime).toISOString(),
			failureCode: null,
			errorMessage: null
		};
	} catch (error) {
		const code = timedOut || isAbortError(error)
			? 'timeout'
			: error instanceof GitHubRequestError
				? error.code
				: 'unavailable';
		return fallbackResult(code);
	} finally {
		clearTimeout(timer);
	}
}
