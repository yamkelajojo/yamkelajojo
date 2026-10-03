import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { getFeaturedProjects } from '$lib/data/projects';
import { PUBLIC_PAGE_CACHE_CONTROL } from '$lib/github/cache-policy';
import { buildSitemapXml, getSiteOrigin } from '$lib/utils/seo';

export const GET: RequestHandler = async () => {
	const slugs = getFeaturedProjects().map((project) => project.slug);
	const xml = buildSitemapXml(getSiteOrigin(env.SITE_ORIGIN), slugs);

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': PUBLIC_PAGE_CACHE_CONTROL
		}
	});
};
