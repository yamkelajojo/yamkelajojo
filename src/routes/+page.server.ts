import type { PageServerLoad } from './$types';
import { getProfile } from '$lib/data/profile';
import { getAllExperiences } from '$lib/data/experience';
import { enrichProjectsWithGitHub, getFeaturedProjects } from '$lib/data/projects';
import { SKILL_CATEGORIES, getSkillsByCategory } from '$lib/data/skills';
import { fetchUserRepositories } from '$lib/github/service';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ fetch }) => {
	const profile = getProfile();
	const experiences = getAllExperiences();
	const githubResult = await fetchUserRepositories({
		username: env.GITHUB_USERNAME || profile.githubUsername,
		token: env.GITHUB_TOKEN,
		fetchImpl: fetch
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
			isStale: githubResult.isStale,
			totalRepos: githubResult.repositories.length
		},
		technicalAreas
	};
};
