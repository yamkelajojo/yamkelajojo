import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getFeaturedProjectBySlug, getFeaturedProjects } from '$lib/data/projects';

export const load: PageServerLoad = async ({ params }) => {
	const project = getFeaturedProjectBySlug(params.slug);

	if (!project) {
		throw error(404, `Project case study "${params.slug}" was not found.`);
	}

	const relatedProjects = getFeaturedProjects().filter((item) => item.slug !== project.slug).slice(0, 2);

	return {
		project,
		relatedProjects
	};
};
