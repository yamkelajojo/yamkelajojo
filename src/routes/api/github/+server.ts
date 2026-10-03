import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchUserRepositories } from '$lib/github/service';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const forceRefresh = url.searchParams.get('refresh') === '1';

	const result = await fetchUserRepositories({
		username: env.GITHUB_USERNAME || 'yamkelajojo',
		token: env.GITHUB_TOKEN,
		fetchImpl: fetch,
		forceRefresh
	});

	return json(result, {
		headers: {
			'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600'
		}
	});
};
