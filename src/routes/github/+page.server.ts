import type { PageServerLoad } from './$types';
import { extractAvailableLanguages } from '$lib/github/normalizer';
import { loadGitHubRepositories } from '$lib/github/server';
import { getProfile } from '$lib/data/profile';

export const load: PageServerLoad = async ({ fetch, locals, setHeaders }) => {
	const profile = getProfile();
	const githubResult = await loadGitHubRepositories(fetch, {
		username: profile.githubUsername,
		locals,
		setHeaders
	});

	const languages = extractAvailableLanguages(githubResult.repositories);

	return {
		profile,
		githubResult,
		languages
	};
};
