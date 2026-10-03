import type { PageServerLoad } from './$types';
import { extractAvailableLanguages } from '$lib/github/normalizer';
import { fetchUserRepositories } from '$lib/github/service';
import { getProfile } from '$lib/data/profile';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const profile = getProfile();
	const forceRefresh = url.searchParams.get('refresh') === '1';

	const githubResult = await fetchUserRepositories({
		username: env.GITHUB_USERNAME || profile.githubUsername,
		token: env.GITHUB_TOKEN,
		fetchImpl: fetch,
		forceRefresh
	});

	const languages = extractAvailableLanguages(githubResult.repositories);

	return {
		profile,
		githubResult,
		languages
	};
};
