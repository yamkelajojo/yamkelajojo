import type { PageServerLoad } from './$types';
import {
	PROJECT_CATEGORIES,
	enrichProjectsWithGitHub,
	getFeaturedProjects
} from '$lib/data/projects';
import { loadGitHubRepositories } from '$lib/github/server';

export const load: PageServerLoad = async ({ fetch, locals, setHeaders }) => {
	const githubResult = await loadGitHubRepositories(fetch, {
		locals,
		setHeaders
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
			fetchedAt: githubResult.fetchedAt,
			failureCode: githubResult.failureCode,
			errorMessage: githubResult.errorMessage,
			totalRepos: githubResult.repositories.length
		}
	};
};
