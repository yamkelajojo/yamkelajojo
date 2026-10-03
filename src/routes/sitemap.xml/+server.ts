import type { RequestHandler } from './$types';
import { getFeaturedProjects } from '$lib/data/projects';
import { buildSitemapXml } from '$lib/utils/seo';

export const GET: RequestHandler = async ({ url }) => {
	const baseUrl = `${url.protocol}//${url.host}`;
	const slugs = getFeaturedProjects().map((p) => p.slug);
	const xml = buildSitemapXml(baseUrl, slugs);

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
