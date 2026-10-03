import { describe, expect, it } from 'vitest';
import { GET as sitemapGet } from '../../src/routes/sitemap.xml/+server';
import { GET as robotsGet } from '../../src/routes/robots.txt/+server';
import { handle, SECURITY_HEADERS } from '../../src/hooks.server';
import { actions as contactActions, load as contactLoad } from '../../src/routes/contact/+page.server';
import fs from 'node:fs';
import path from 'node:path';

describe('Integration — SEO Endpoints, Security Headers, Contact Actions & CV Asset (SEO-001, SEC-001, AT-008)', () => {
	it('serves valid XML sitemap and robots.txt', async () => {
		const sitemapRes = await sitemapGet({
			url: new URL('https://yamkelajojo.workers.dev/sitemap.xml')
		} as never);
		expect(sitemapRes.status).toBe(200);
		expect(sitemapRes.headers.get('Content-Type')).toContain('application/xml');
		const xml = await sitemapRes.text();
		expect(xml).toContain('https://yamkelajojo.workers.dev/work/engineering-portfolio');
		expect(xml).toContain('https://yamkelajojo.workers.dev/work/greenbidder-marketplace');

		const robotsRes = await robotsGet({
			url: new URL('https://yamkelajojo.workers.dev/robots.txt')
		} as never);
		expect(robotsRes.status).toBe(200);
		const robotsTxt = await robotsRes.text();
		expect(robotsTxt).toContain('User-agent: *');
		expect(robotsTxt).toContain('Sitemap: https://yamkelajojo.workers.dev/sitemap.xml');
	});

	it('attaches defensive security headers in hooks.server.ts', async () => {
		const response = await handle({
			event: {} as never,
			resolve: async () => new Response('ok', { status: 200 })
		});

		for (const [header, expectedValue] of Object.entries(SECURITY_HEADERS)) {
			expect(response.headers.get(header)).toBe(expectedValue);
		}
	});

	it('validates and sanitizes contact form submissions via server actions', async () => {
		const loaded = (await contactLoad({} as never))!;
		expect(loaded.profile.githubUsername).toBe('yamkelajojo');

		const invalidForm = new FormData();
		invalidForm.set('name', 'X');
		invalidForm.set('email', 'bad');
		invalidForm.set('subject', 'Hi');
		invalidForm.set('message', 'Short');

		const failResult = await contactActions.default({
			request: new Request('https://yamkelajojo.workers.dev/contact', {
				method: 'POST',
				body: invalidForm
			})
		} as never);

		expect(failResult).toMatchObject({
			status: 400,
			data: {
				success: false
			}
		});

		const validForm = new FormData();
		validForm.set('name', '<b>Thabo Mbeki</b>');
		validForm.set('email', 'thabo@company.co.za');
		validForm.set('subject', 'Full-Stack Developer Role in Durban');
		validForm.set(
			'message',
			'Hello Yamkela, we enjoyed reviewing your SvelteKit portfolio and Laravel experience.'
		);

		const okResult = await contactActions.default({
			request: new Request('https://yamkelajojo.workers.dev/contact', {
				method: 'POST',
				body: validForm
			})
		} as never);

		expect(okResult).toMatchObject({
			success: true,
			recipientName: 'Thabo Mbeki'
		});
	});

	it('verifies that the standalone downloadable CV PDF exists and has a valid %PDF-1.4 header (AT-008)', () => {
		const pdfPath = path.resolve('static/resume/yamkela-jojo-cv.pdf');
		expect(fs.existsSync(pdfPath)).toBe(true);
		const buffer = fs.readFileSync(pdfPath);
		expect(buffer.subarray(0, 8).toString('ascii')).toContain('%PDF-1.4');
		expect(buffer.toString('latin1')).toContain('YAMKELA JOJO');
		expect(buffer.toString('latin1')).toContain('CustomConnect');
	});
});
