import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { load as homeLoad } from '../../src/routes/+page.server';
import { load as workLoad } from '../../src/routes/work/+page.server';
import { load as caseStudyLoad } from '../../src/routes/work/[slug]/+page.server';
import { load as githubLoad } from '../../src/routes/github/+page.server';
import { actions as contactActions, load as contactLoad } from '../../src/routes/contact/+page.server';
import { defaultGitHubCache } from '$lib/github/cache';

describe('Integration — Server Load Functions, Contact Form Action & Static/Build Artifacts', () => {
	const mockFetch = vi.fn().mockResolvedValue({
		ok: true,
		status: 200,
		json: async () => [
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
				fork: false,
				archived: false,
				private: false
			}
		]
	});

	it('loads Homepage (+page.server.ts) with profile, experiences, enriched projects, and technical areas', async () => {
		defaultGitHubCache.clear();
		const data = (await homeLoad({
			fetch: mockFetch as unknown as typeof fetch
		} as never))!;

		expect(data.profile.name).toBe('Yamkela Jojo');
		expect(data.experiences.length).toBe(4);
		expect(data.featuredProjects.length).toBe(4);
		expect(data.technicalAreas.length).toBe(8);
		expect(data.githubMeta.totalRepos).toBe(1);
	});

	it('loads Work index (work/+page.server.ts) and Case Study detail (work/[slug]/+page.server.ts)', async () => {
		const workData = (await workLoad({
			fetch: mockFetch as unknown as typeof fetch
		} as never))!;

		expect(workData.categories).toContain('All');
		expect(workData.featuredProjects.length).toBeGreaterThanOrEqual(6);

		const detailData = (await caseStudyLoad({
			params: { slug: 'greenbidder-marketplace' },
			fetch: mockFetch as unknown as typeof fetch
		} as never))!;

		expect(detailData.project.slug).toBe('greenbidder-marketplace');
		expect(detailData.githubRepo?.name).toBe('greenbidder');
		expect(detailData.relatedProjects.length).toBe(2);

		await expect(
			caseStudyLoad({
				params: { slug: 'non-existent-case-study' },
				fetch: mockFetch as unknown as typeof fetch
			} as never)
		).rejects.toMatchObject({ status: 404 });
	});

	it('loads GitHub explorer (github/+page.server.ts) with extracted language filters', async () => {
		const githubData = (await githubLoad({
			fetch: mockFetch as unknown as typeof fetch,
			url: new URL('https://yamkelajojo.workers.dev/github?refresh=1')
		} as never))!;

		expect(githubData.profile.githubUsername).toBe('yamkelajojo');
		expect(githubData.languages).toContain('JavaScript');
	});

	it('validates Contact page load and POST action (contact/+page.server.ts) for invalid and valid submissions', async () => {
		const loaded = (await contactLoad({} as never))!;
		expect(loaded.profile.name).toBe('Yamkela Jojo');

		const invalidForm = new FormData();
		invalidForm.set('name', 'X');
		invalidForm.set('email', 'bad-email');
		invalidForm.set('subject', 'Hi');
		invalidForm.set('message', 'Short');

		const invalidRes = (await contactActions.default({
			request: new Request('https://yamkelajojo.workers.dev/contact', {
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
			request: new Request('https://yamkelajojo.workers.dev/contact', {
				method: 'POST',
				body: validForm
			})
		} as never)) as { success: boolean; recipientName: string };

		expect(validRes.success).toBe(true);
		expect(validRes.recipientName).toBe('Nomsa Dlamini');
	});

	it('verifies static CV PDF, icons, and architectural SVG diagrams exist on disk (AT-008 & DEPLOY-001)', () => {
		const root = process.cwd();
		const pdfPath = path.join(root, 'static/resume/yamkela-jojo-cv.pdf');
		expect(fs.existsSync(pdfPath)).toBe(true);
		const pdfHeader = fs.readFileSync(pdfPath, 'latin1').slice(0, 8);
		expect(pdfHeader).toContain('%PDF-1.4');

		expect(fs.existsSync(path.join(root, 'static/icons/favicon.svg'))).toBe(true);
		expect(fs.existsSync(path.join(root, 'static/images/og-cover.svg'))).toBe(true);
		expect(
			fs.existsSync(path.join(root, 'static/images/projects/portfolio-architecture.svg'))
		).toBe(true);
		expect(
			fs.existsSync(path.join(root, 'static/images/projects/greenbidder-architecture.svg'))
		).toBe(true);
		expect(
			fs.existsSync(path.join(root, 'static/images/projects/odin-recipes-schema.svg'))
		).toBe(true);
	});
});
