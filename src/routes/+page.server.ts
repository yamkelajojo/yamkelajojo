import type { PageServerLoad } from './$types';
import { getProfile } from '$lib/data/profile';
import { getAllExperiences } from '$lib/data/experience';
import { enrichProjectsWithGitHub, getFeaturedProjects } from '$lib/data/projects';
import { SKILL_CATEGORIES, getSkillsByCategory } from '$lib/data/skills';
import { loadGitHubRepositories } from '$lib/github/server';

export const load: PageServerLoad = async ({ fetch, locals, setHeaders }) => {
	const profile = getProfile();
	const experiences = getAllExperiences();
	const githubResult = await loadGitHubRepositories(fetch, {
		username: profile.githubUsername,
		locals,
		setHeaders
	});

	const featuredProjects = enrichProjectsWithGitHub(
		getFeaturedProjects(),
		githubResult.repositories
	);

	const technicalAreas = SKILL_CATEGORIES.map((category) => ({
		category,
		skills: getSkillsByCategory(category).slice(0, 5)
	}));

	return {
		profile,
		experiences,
		featuredProjects: featuredProjects.slice(0, 4),
		recentRepos: githubResult.repositories.slice(0, 4),
		githubMeta: {
			source: githubResult.source,
			fetchedAt: githubResult.fetchedAt,
			failureCode: githubResult.failureCode,
			errorMessage: githubResult.errorMessage,
			totalRepos: githubResult.repositories.length
		},
		technicalAreas
	};
};
