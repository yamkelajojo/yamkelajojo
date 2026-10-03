import type { PageServerLoad } from './$types';
import {
	PROJECT_CATEGORIES,
	enrichProjectsWithGitHub,
	getFeaturedProjects
} from '$lib/data/projects';
import { fetchUserRepositories } from '$lib/github/service';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ fetch }) => {
	const githubResult = await fetchUserRepositories({
		username: env.GITHUB_USERNAME || 'yamkelajojo',
		token: env.GITHUB_TOKEN,
		fetchImpl: fetch
	});

	const featuredProjects = enrichProjectsWithGitHub(
		getFeaturedProjects(),
		githubResult.repositories
	);

	return {
		categories: ['All', ...PROJECT_CATEGORIES] as const,
		featuredProjects,
		repositories: githubResult.repositories,
		githubMeta: {
			source: githubResult.source,
			isStale: githubResult.isStale,
			fetchedAt: githubResult.fetchedAt
		}
	};
};
