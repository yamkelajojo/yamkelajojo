import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getFeaturedProjectBySlug, getFeaturedProjects } from '$lib/data/projects';
import { fetchUserRepositories } from '$lib/github/service';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const project = getFeaturedProjectBySlug(params.slug);

	if (!project) {
		throw error(404, `Project case study "${params.slug}" was not found.`);
	}

	const githubResult = await fetchUserRepositories({
		username: env.GITHUB_USERNAME || 'yamkelajojo',
		token: env.GITHUB_TOKEN,
		fetchImpl: fetch
	});

	const githubRepo = project.repoName
		? (githubResult.repositories.find(
				(repo) => repo.name.toLowerCase() === project.repoName?.toLowerCase()
			) ?? null)
		: null;

	const relatedProjects = getFeaturedProjects().filter((p) => p.slug !== project.slug).slice(0, 2);

	return {
		project,
		githubRepo,
		relatedProjects
	};
};
