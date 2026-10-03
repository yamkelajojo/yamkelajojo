import { describe, expect, it, vi } from 'vitest';
import { GET as githubApiGet } from '../../src/routes/api/github/+server';
import { load as homeLoad } from '../../src/routes/+page.server';
import { load as workLoad } from '../../src/routes/work/+page.server';
import { load as caseStudyLoad } from '../../src/routes/work/[slug]/+page.server';
import { load as githubPageLoad } from '../../src/routes/github/+page.server';
import { defaultGitHubCache } from '$lib/github/cache';

const sampleGitHubApiPayload = [
	{
		name: 'yamkelajojo',
		full_name: 'yamkelajojo/yamkelajojo',
		description: 'My Portfolio.',
		html_url: 'https://github.com/yamkelajojo/yamkelajojo',
		homepage: 'https://yamkelajojo.workers.dev',
		language: 'TypeScript',
		stargazers_count: 5,
		forks_count: 1,
		topics: ['sveltekit', 'cloudflare-workers'],
		created_at: '2026-10-03T03:36:18Z',
		updated_at: '2026-10-03T07:13:14Z',
		pushed_at: '2026-10-03T07:13:11Z',
		fork: false,
		archived: false,
		private: false
	},
	{
		name: 'greenbidder',
		full_name: 'yamkelajojo/greenbidder',
		description: 'Geospatial agricultural marketplace',
		html_url: 'https://github.com/yamkelajojo/greenbidder',
		homepage: null,
		language: 'JavaScript',
		stargazers_count: 3,
		forks_count: 0,
		topics: ['react-native', 'postgis'],
		created_at: '2026-04-10T09:39:24Z',
		updated_at: '2026-05-05T18:28:58Z',
		pushed_at: '2026-09-21T04:34:48Z',
		fork: false,
		archived: false,
		private: false
	}
];

describe('Integration — GitHub API -> Adapter -> Normalizer -> Server Load -> UI Data', () => {
	it('serves normalized repositories and edge cache headers from /api/github', async () => {
		defaultGitHubCache.clear();
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => sampleGitHubApiPayload
		});

		const response = await githubApiGet({
			url: new URL('https://yamkelajojo.workers.dev/api/github'),
			fetch: mockFetch as unknown as typeof fetch
		} as never);

		expect(response.status).toBe(200);
		expect(response.headers.get('Cache-Control')).toContain('s-maxage=900');

		const body = await response.json();
		expect(body.source).toBe('live');
		expect(body.repositories.length).toBe(2);
		expect(body.repositories[0].name).toBe('yamkelajojo');
		expect(body.repositories[0].stars).toBe(5);
	});

	it('enriches homepage, work page, and project case study server loads with GitHub telemetry', async () => {
		defaultGitHubCache.clear();
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => sampleGitHubApiPayload
		});

		const homeData = (await homeLoad({
			fetch: mockFetch as unknown as typeof fetch
		} as never))!;

		expect(homeData.profile.name).toBe('Yamkela Jojo');
		expect(homeData.featuredProjects.length).toBe(4);
		expect(homeData.featuredProjects[0]?.githubRepo?.stars).toBe(5);

		// Subsequent workLoad should hit the fresh in-memory cache without another fetch call
		const workData = (await workLoad({
			fetch: mockFetch as unknown as typeof fetch
		} as never))!;
		expect(workData.githubMeta.source).toBe('cache');
		expect(mockFetch).toHaveBeenCalledTimes(1);

		const caseStudyData = (await caseStudyLoad({
			params: { slug: 'greenbidder-marketplace' },
			fetch: mockFetch as unknown as typeof fetch
		} as never))!;
		expect(caseStudyData.project.title).toContain('GreenBidder');
		expect(caseStudyData.githubRepo?.name).toBe('greenbidder');
		expect(caseStudyData.githubRepo?.language).toBe('JavaScript');

		const githubPageData = (await githubPageLoad({
			url: new URL('https://yamkelajojo.workers.dev/github'),
			fetch: mockFetch as unknown as typeof fetch
		} as never))!;
		expect(githubPageData.languages).toEqual(['JavaScript', 'TypeScript']);
	});

	it('throws 404 when loading an unknown case study slug', async () => {
		await expect(
			caseStudyLoad({
				params: { slug: 'does-not-exist' },
				fetch: vi.fn() as unknown as typeof fetch
			} as never)
		).rejects.toMatchObject({ status: 404 });
	});
});
