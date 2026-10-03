import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGitHubResponseMetadata } from '$lib/github/cache-policy';
import { loadGitHubRepositories } from '$lib/github/server';

export const GET: RequestHandler = async ({ fetch }) => {
	const result = await loadGitHubRepositories(fetch);
	const { status, headers } = getGitHubResponseMetadata(result);

	return json(result, { status, headers });
};
