import { describe, expect, it } from 'vitest';
import {
	PROJECT_CATEGORIES,
	enrichProjectsWithGitHub,
	getFeaturedProjectBySlug,
	getFeaturedProjects,
	getFeaturedProjectsByCategory,
	getLabExperiments
} from '$lib/data/projects';
import { getFallbackRepositories } from '$lib/github/fallback';

describe('PROJECT-001..004 — Featured projects, case studies, and GitHub enrichment', () => {
	it('includes the portfolio itself alongside Yamkela Jojo real GitHub projects', () => {
		const projects = getFeaturedProjects();
		expect(projects.length).toBeGreaterThanOrEqual(6);

		const slugs = projects.map((p) => p.slug);
		expect(slugs).toEqual(
			expect.arrayContaining([
				'engineering-portfolio',
				'greenbidder-marketplace',
				'odin-recipes-laravel-vue',
				'climate-sentiment-nlp',
				'movie-recommender-engine',
				'dojo-drumkit-nuxt'
			])
		);
	});

	it('verifies that the portfolio project demonstrates the required PRD stack and architectural visual blueprints', () => {
		const portfolio = getFeaturedProjectBySlug('engineering-portfolio');
		expect(portfolio).not.toBeNull();
		expect(portfolio?.technologies).toEqual(
			expect.arrayContaining([
				'SvelteKit',
				'Svelte 5',
				'TypeScript',
				'Bits UI',
				'Tailwind CSS',
				'Cloudflare Workers',
				'GitHub REST API',
				'Vitest',
				'Playwright'
			])
		);
		expect(portfolio?.screenshots?.[0]?.imageUrl).toBe(
			'/images/projects/portfolio-architecture.svg'
		);
	});

	it('returns null for unknown project slug and filters projects by domain category', () => {
		expect(getFeaturedProjectBySlug('non-existent-project')).toBeNull();
		expect(PROJECT_CATEGORIES.length).toBeGreaterThanOrEqual(7);
		expect(getFeaturedProjectsByCategory('All').length).toBe(getFeaturedProjects().length);

		const fullStack = getFeaturedProjectsByCategory('Full Stack');
		expect(fullStack.length).toBeGreaterThanOrEqual(2);

		const dataScience = getFeaturedProjectsByCategory('Data Science');
		expect(dataScience.length).toBeGreaterThanOrEqual(2);
	});

	it('enriches featured projects with live normalized GitHub repository metadata where linked and handles unlinked projects', () => {
		const repos = getFallbackRepositories();
		const sampleProjects = [
			...getFeaturedProjects(),
			{
				...getFeaturedProjects()[0]!,
				slug: 'internal-only',
				repoName: undefined
			},
			{
				...getFeaturedProjects()[0]!,
				slug: 'unmatched-repo',
				repoName: 'does-not-exist-on-github'
			}
		];

		const enriched = enrichProjectsWithGitHub(sampleProjects, repos);

		const greenbidder = enriched.find((p) => p.slug === 'greenbidder-marketplace');
		expect(greenbidder?.githubRepo).not.toBeNull();
		expect(greenbidder?.githubRepo?.name).toBe('greenbidder');

		const internalOnly = enriched.find((p) => p.slug === 'internal-only');
		expect(internalOnly?.githubRepo).toBeNull();

		const unmatched = enriched.find((p) => p.slug === 'unmatched-repo');
		expect(unmatched?.githubRepo).toBeNull();
	});

	it('provides structured Lab experiments for technical, data science, and security exploration', () => {
		const labs = getLabExperiments();
		expect(labs.length).toBeGreaterThanOrEqual(3);
	});
});
