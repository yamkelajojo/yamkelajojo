import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { load as homeLoad } from '../../src/routes/+page.server';
import { load as workLoad } from '../../src/routes/work/+page.server';
import { load as caseStudyLoad } from '../../src/routes/work/[slug]/+page.server';
import { load as githubLoad } from '../../src/routes/github/+page.server';
import { GET as githubApiGet } from '../../src/routes/api/github/+server';
import { actions as contactActions, load as contactLoad } from '../../src/routes/contact/+page.server';
import * as GitHubService from '$lib/github/service';

const mockRawRepositories = [
	{
		name: 'greenbidder',
		full_name: 'yamkelajojo/greenbidder',
		description: 'Agricultural marketplace app',
		html_url: 'https://github.com/yamkelajojo/greenbidder',
		homepage: null,
		language: 'JavaScript',
		stargazers_count: 3,
		forks_count: 1,
		topics: ['react-native', 'postgis'],
		created_at: '2026-04-10T09:39:24Z',
		updated_at: '2026-05-05T18:28:58Z',
		pushed_at: '2026-09-21T04:34:48Z',
		default_branch: 'main',
		visibility: 'public',
		fork: false,
		archived: false,
		private: false
	}
];

function createFetch(status = 200) {
	return vi.fn(async () =>
		new Response(
			JSON.stringify(
				status === 200
					? mockRawRepositories
					: { message: 'private GitHub upstream detail' }
			),
			{
				status,
				headers: { 'Content-Type': 'application/json' }
			}
		)
	);
}

describe('Integration — Server Loads, GitHub API and Static/Build Artifacts', () => {
	it('loads Home and Work with normalized GitHub data and explicit response cache policies', async () => {
		const mockFetch = createFetch();
		const homeHeaders = vi.fn();
		const workHeaders = vi.fn();

		const homeData = (await homeLoad({
			fetch: mockFetch as unknown as typeof fetch,
			locals: {},
			setHeaders: homeHeaders
		} as never))!;

		expect(homeData.profile.name).toBe('Yamkela Jojo');
		expect(homeData.experiences.length).toBe(4);
		expect(homeData.featuredProjects.length).toBe(4);
		expect(homeData.technicalAreas.length).toBe(8);
		expect(homeData.githubMeta).toMatchObject({
			source: 'github-api',
			totalRepos: 1,
			failureCode: null,
			errorMessage: null
		});
		expect(homeHeaders).toHaveBeenCalledWith(
			expect.objectContaining({ 'X-GitHub-Data-Source': 'github-api' })
		);
		expect(mockFetch).toHaveBeenCalledTimes(1);

		const workData = (await workLoad({
			fetch: mockFetch as unknown as typeof fetch,
			locals: {},
			setHeaders: workHeaders
		} as never))!;

		expect(workData.categories).toContain('All');
		expect(workData.featuredProjects.length).toBeGreaterThanOrEqual(6);
		expect(workData.repositories[0]?.name).toBe('greenbidder');
		expect(workHeaders).toHaveBeenCalledWith(
			expect.objectContaining({ 'Cache-Control': expect.stringContaining('max-age=1800') })
		);
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	it('loads case studies without spending an extra GitHub API request per project slug', async () => {
		const fetchSpy = vi.spyOn(GitHubService, 'fetchUserRepositories');
		const detailData = (await caseStudyLoad({
			params: { slug: 'greenbidder-marketplace' }
		} as never))!;

		expect(detailData.project.slug).toBe('greenbidder-marketplace');
		expect(detailData.relatedProjects.length).toBe(2);
		expect(fetchSpy).not.toHaveBeenCalled();

		await expect(
			caseStudyLoad({ params: { slug: 'non-existent-case-study' } } as never)
		).rejects.toMatchObject({ status: 404 });
		fetchSpy.mockRestore();
	});

	it('loads the GitHub explorer using normalized API metadata and reports a real rate-limit fallback', async () => {
		const successFetch = createFetch();
		const githubData = (await githubLoad({
			fetch: successFetch as unknown as typeof fetch,
			locals: {},
			setHeaders: vi.fn()
		} as never))!;

		expect(githubData.profile.githubUsername).toBe('yamkelajojo');
		expect(githubData.languages).toContain('JavaScript');
		expect(githubData.githubResult.source).toBe('github-api');

		const rateLimitFetch = createFetch(403);
		const fallbackLocals: App.Locals = {};
		const fallbackData = (await githubLoad({
			fetch: rateLimitFetch as unknown as typeof fetch,
			locals: fallbackLocals,
			setHeaders: vi.fn()
		} as never))!;

		expect(fallbackData.githubResult.source).toBe('fallback-snapshot');
		expect(fallbackData.githubResult.failureCode).toBe('rate-limited');
		expect(fallbackData.githubResult.repositories.length).toBeGreaterThan(0);
		expect(fallbackLocals.githubDataStatus).toBe(503);
	});

	it('serves the JSON endpoint as cacheable success or an explicit 503 fallback', async () => {
		const successResponse = await githubApiGet({ fetch: createFetch() as unknown as typeof fetch } as never);
		expect(successResponse.status).toBe(200);
		expect(successResponse.headers.get('X-GitHub-Data-Source')).toBe('github-api');
		expect(successResponse.headers.get('Cache-Control')).toContain('stale-if-error=86400');
		expect((await successResponse.json()).source).toBe('github-api');

		const failureResponse = await githubApiGet({
			fetch: createFetch(429) as unknown as typeof fetch
		} as never);
		expect(failureResponse.status).toBe(503);
		expect(failureResponse.headers.get('X-GitHub-Data-Source')).toBe('fallback-snapshot');
		expect(failureResponse.headers.get('Retry-After')).toBe('300');
		expect(failureResponse.headers.get('Cache-Control')).toContain('max-age=300');
		expect((await failureResponse.json()).failureCode).toBe('rate-limited');
	});

	it('validates Contact page load and POST action for invalid and valid submissions', async () => {
		const loaded = (await contactLoad({} as never))!;
		expect(loaded.profile.name).toBe('Yamkela Jojo');

		const invalidForm = new FormData();
		invalidForm.set('name', 'X');
		invalidForm.set('email', 'bad-email');
		invalidForm.set('subject', 'Hi');
		invalidForm.set('message', 'Short');

		const invalidRes = (await contactActions.default({
			request: new Request('https://yamkelajojo-portfolio.yamkelajojo.workers.dev/contact', {
				method: 'POST',
				body: invalidForm
			})
		} as never)) as { status: number; data: { success: boolean; errors: Record<string, string> } };

		expect(invalidRes.status).toBe(400);
		expect(invalidRes.data.success).toBe(false);
		expect(invalidRes.data.errors.email).toBeDefined();

		const validForm = new FormData();
		validForm.set('name', 'Nomsa Dlamini');
		validForm.set('email', 'nomsa@company.co.za');
		validForm.set('subject', 'Full-Stack Developer Role in Durban');
		validForm.set(
			'message',
			'Hello Yamkela, we were impressed by your Laravel and SvelteKit engineering portfolio.'
		);

		const validRes = (await contactActions.default({
			request: new Request('https://yamkelajojo-portfolio.yamkelajojo.workers.dev/contact', {
				method: 'POST',
				body: validForm
			})
		} as never)) as {
			success: boolean;
			recipientName: string;
			values: { email: string; message: string };
		};

		expect(validRes.success).toBe(true);
		expect(validRes.recipientName).toBe('Nomsa Dlamini');
		expect(validRes.values.email).toBe('nomsa@company.co.za');
		expect(validRes.values.message).toContain('Hello Yamkela');
	});

	it('verifies the CV PDF, icons, and architecture diagrams exist as deployable static assets', () => {
		const root = process.cwd();
		const pdfPath = path.join(root, 'static/resume/yamkela-jojo-cv.pdf');
		expect(fs.existsSync(pdfPath)).toBe(true);
		const pdfHeader = fs.readFileSync(pdfPath, 'latin1').slice(0, 8);
		expect(pdfHeader).toContain('%PDF-1.4');

		for (const file of [
			'static/icons/favicon.svg',
			'static/images/og-cover.svg',
			'static/images/projects/portfolio-architecture.svg',
			'static/images/projects/greenbidder-architecture.svg',
			'static/images/projects/odin-recipes-schema.svg'
		]) {
			expect(fs.existsSync(path.join(root, file))).toBe(true);
		}
	});
});
