import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { getSiteOrigin } from '$lib/utils/seo';

export const load: LayoutServerLoad = () => ({
	siteOrigin: getSiteOrigin(env.SITE_ORIGIN)
});
