import type { Handle } from '@sveltejs/kit';
import {
	PRIVATE_NO_STORE_CACHE_CONTROL,
	PUBLIC_PAGE_CACHE_CONTROL
} from '$lib/github/cache-policy';

export const SECURITY_HEADERS: Record<string, string> = {
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'SAMEORIGIN',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
	'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
};

const INVALIDATED_PARAM = 'x-sveltekit-invalidated';
const TRAILING_SLASH_PARAM = 'x-sveltekit-trailing-slash';
// This portfolio has one root layout and one page node per route.
const INVALIDATION_MASK_PATTERN = /^[01]{2}$/;

function canonicalQueryTarget(url: URL, isDataRequest: boolean): string | null {
	if (!url.search) return null;

	const canonicalPath = url.pathname.replace(/^\/{2,}/, '/');
	const canonicalUrl = new URL(canonicalPath, url.origin);

	if (isDataRequest) {
		const invalidationValues = url.searchParams.getAll(INVALIDATED_PARAM);
		if (invalidationValues.length === 1 && INVALIDATION_MASK_PATTERN.test(invalidationValues[0])) {
			canonicalUrl.searchParams.set(INVALIDATED_PARAM, invalidationValues[0]);
		}

		const trailingSlashValues = url.searchParams.getAll(TRAILING_SLASH_PARAM);
		if (trailingSlashValues.length === 1 && trailingSlashValues[0] === '1') {
			canonicalUrl.searchParams.set(TRAILING_SLASH_PARAM, '1');
		}
	}

	const canonicalTarget = `${canonicalUrl.pathname}${canonicalUrl.search}`;
	return canonicalTarget === `${url.pathname}${url.search}` ? null : canonicalTarget;
}

function applySecurityHeaders(response: Response): void {
	for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
		if (!response.headers.has(header)) response.headers.set(header, value);
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	const canonicalTarget = canonicalQueryTarget(new URL(event.request.url), event.isDataRequest);
	if (canonicalTarget) {
		const redirectResponse = new Response(null, {
			status: 308,
			headers: {
				Location: canonicalTarget,
				'Cache-Control': PRIVATE_NO_STORE_CACHE_CONTROL
			}
		});
		applySecurityHeaders(redirectResponse);
		return redirectResponse;
	}

	let response = await resolve(event);
	if (event.locals.githubDataStatus === 503 && response.status === 200) {
		response = new Response(response.body, {
			status: 503,
			statusText: 'GitHub data temporarily unavailable',
			headers: response.headers
		});
	}

	if (!response.headers.has('Cache-Control')) {
		const canCachePublicly =
			(event.request.method === 'GET' || event.request.method === 'HEAD') &&
			response.status >= 200 &&
			response.status < 300 &&
			!response.headers.has('Set-Cookie');
		response.headers.set(
			'Cache-Control',
			canCachePublicly ? PUBLIC_PAGE_CACHE_CONTROL : PRIVATE_NO_STORE_CACHE_CONTROL
		);
	}

	applySecurityHeaders(response);
	return response;
};
