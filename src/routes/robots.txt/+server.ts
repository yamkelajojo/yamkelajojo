import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { PUBLIC_PAGE_CACHE_CONTROL } from '$lib/github/cache-policy';
import { getSiteOrigin } from '$lib/utils/seo';

export const GET: RequestHandler = async () => {
	const body = `User-agent: *\nAllow: /\nSitemap: ${getSiteOrigin(env.SITE_ORIGIN)}/sitemap.xml\n`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': PUBLIC_PAGE_CACHE_CONTROL
		}
	});
};
