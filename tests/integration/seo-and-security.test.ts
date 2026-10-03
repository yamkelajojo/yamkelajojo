import { describe, expect, it, vi } from 'vitest';
import { GET as sitemapGet } from '../../src/routes/sitemap.xml/+server';
import { GET as robotsGet } from '../../src/routes/robots.txt/+server';
import { handle, SECURITY_HEADERS } from '../../src/hooks.server';
import { actions as contactActions, load as contactLoad } from '../../src/routes/contact/+page.server';
import { DEFAULT_SITE_ORIGIN } from '$lib/utils/seo';
import fs from 'node:fs';
import path from 'node:path';

function mockEvent(url: string, options: { method?: string; isDataRequest?: boolean } = {}) {
	return {
		url: new URL(url),
		request: new Request(url, { method: options.method ?? 'GET' }),
		isDataRequest: options.isDataRequest ?? false,
		locals: {}
	};
}

describe('Integration — SEO, cache and security policies, contact actions and CV asset', () => {
	it('uses the configured canonical origin for sitemap and robots instead of an untrusted request Host', async () => {
		const sitemapResponse = await sitemapGet({
			url: new URL('https://attacker.example/sitemap.xml')
		} as never);
		expect(sitemapResponse.status).toBe(200);
		expect(sitemapResponse.headers.get('Content-Type')).toContain('application/xml');
		expect(sitemapResponse.headers.get('Cache-Control')).toContain('max-age=3600');
		const xml = await sitemapResponse.text();
		expect(xml).toContain(`${DEFAULT_SITE_ORIGIN}/work/engineering-portfolio`);
		expect(xml).toContain(`${DEFAULT_SITE_ORIGIN}/work/greenbidder-marketplace`);
		expect(xml).not.toContain('attacker.example');

		const robotsResponse = await robotsGet({
			url: new URL('https://attacker.example/robots.txt')
		} as never);
		expect(robotsResponse.status).toBe(200);
		expect(await robotsResponse.text()).toContain(`Sitemap: ${DEFAULT_SITE_ORIGIN}/sitemap.xml`);
	});

	it('sets defensive security headers and an explicit public policy on cacheable GET pages', async () => {
		const response = await handle({
			event: mockEvent('https://portfolio.example/about') as never,
			resolve: async () => new Response('ok', { status: 200 })
		});

		for (const [header, expectedValue] of Object.entries(SECURITY_HEADERS)) {
			expect(response.headers.get(header)).toBe(expectedValue);
		}
		expect(response.headers.get('Cache-Control')).toContain('max-age=3600');
	});

	it('keeps route-specific GitHub failure policy and does not cache error pages or POST actions', async () => {
		const githubFailure = await handle({
			event: mockEvent('https://portfolio.example/github') as never,
			resolve: async () =>
				new Response('maintained snapshot', {
					status: 503,
					headers: {
						'Cache-Control': 'public, max-age=300, stale-while-revalidate=300',
						'X-GitHub-Data-Source': 'fallback-snapshot',
						'Retry-After': '300'
					}
				})
		});
		expect(githubFailure.status).toBe(503);
		expect(githubFailure.headers.get('Cache-Control')).toContain('max-age=300');
		expect(githubFailure.headers.get('X-GitHub-Data-Source')).toBe('fallback-snapshot');

		const notFound = await handle({
			event: mockEvent('https://portfolio.example/missing') as never,
			resolve: async () => new Response('missing', { status: 404 })
		});
		expect(notFound.headers.get('Cache-Control')).toBe('private, no-store');

		const post = await handle({
			event: mockEvent('https://portfolio.example/contact', { method: 'POST' }) as never,
			resolve: async () => new Response('submitted', { status: 200 })
		});
		expect(post.headers.get('Cache-Control')).toBe('private, no-store');
	});

	it('removes public refresh and arbitrary query-string cache bypasses with a no-store canonical redirect', async () => {
		const resolve = vi.fn(async () => new Response('should not resolve'));
		const response = await handle({
			event: mockEvent('https://portfolio.example/github?refresh=1&anything=1') as never,
			resolve
		});

		expect(response.status).toBe(308);
		expect(response.headers.get('Location')).toBe('/github');
		expect(response.headers.get('Cache-Control')).toBe('private, no-store');
		expect(resolve).not.toHaveBeenCalled();
	});

	it('does not create an external redirect for a query on a protocol-relative-looking path', async () => {
		const response = await handle({
			event: mockEvent('https://portfolio.example//attacker.example?refresh=1') as never,
			resolve: vi.fn(async () => new Response('should not resolve'))
		});

		expect(response.status).toBe(308);
		expect(response.headers.get('Location')).toBe('/attacker.example');
		expect(
			new URL(response.headers.get('Location') ?? '/', 'https://portfolio.example').origin
		).toBe('https://portfolio.example');
	});

	it('preserves well-formed SvelteKit data parameters and strips public cache-bypass queries', async () => {
		const dataUrl = 'https://portfolio.example/github/__data.json?x-sveltekit-invalidated=11';
		const resolve = vi.fn(async () => new Response('data', { status: 200 }));
		const normalDataResponse = await handle({
			event: mockEvent(dataUrl, { isDataRequest: true }) as never,
			resolve
		});
		expect(normalDataResponse.status).toBe(200);
		expect(resolve).toHaveBeenCalledOnce();

		const bypassResponse = await handle({
			event: mockEvent(`${dataUrl}&refresh=1`, { isDataRequest: true }) as never,
			resolve
		});
		expect(bypassResponse.status).toBe(308);
		expect(bypassResponse.headers.get('Location')).toBe(
			'/github/__data.json?x-sveltekit-invalidated=11'
		);

		const malformedMaskResponse = await handle({
			event: mockEvent(
				'https://portfolio.example/github/__data.json?x-sveltekit-invalidated=111111',
				{ isDataRequest: true }
			) as never,
			resolve
		});
		expect(malformedMaskResponse.status).toBe(308);
		expect(malformedMaskResponse.headers.get('Location')).toBe('/github/__data.json');

		const trailingSlashDataResponse = await handle({
			event: mockEvent(
				'https://portfolio.example/github/__data.json?x-sveltekit-invalidated=10&x-sveltekit-trailing-slash=1',
				{ isDataRequest: true }
			) as never,
			resolve
		});
		expect(trailingSlashDataResponse.status).toBe(200);
		expect(resolve).toHaveBeenCalledTimes(2);
	});

	it('validates and sanitizes contact form submissions via server actions', async () => {
		const loaded = (await contactLoad({} as never))!;
		expect(loaded.profile.githubUsername).toBe('yamkelajojo');

		const invalidForm = new FormData();
		invalidForm.set('name', 'X');
		invalidForm.set('email', 'bad');
		invalidForm.set('subject', 'Hi');
		invalidForm.set('message', 'Short');
		const invalidResult = await contactActions.default({
			request: new Request(`${DEFAULT_SITE_ORIGIN}/contact`, { method: 'POST', body: invalidForm })
		} as never);
		expect(invalidResult).toMatchObject({ status: 400, data: { success: false } });

		const validForm = new FormData();
		validForm.set('name', '<b>Thabo Mbeki</b>');
		validForm.set('email', 'thabo@company.co.za');
		validForm.set('subject', 'Full-Stack Engineering Opportunity');
		validForm.set(
			'message',
			'Hi Yamkela, we reviewed your Laravel and SvelteKit portfolio and would like to connect.'
		);
		const validResult = await contactActions.default({
			request: new Request(`${DEFAULT_SITE_ORIGIN}/contact`, { method: 'POST', body: validForm })
		} as never);
		expect(validResult).toMatchObject({ success: true, recipientName: 'Thabo Mbeki' });
	});

	it('verifies the downloadable CV is a real PDF asset', () => {
		const pdfPath = path.resolve('static/resume/yamkela-jojo-cv.pdf');
		expect(fs.existsSync(pdfPath)).toBe(true);
		const buffer = fs.readFileSync(pdfPath);
		expect(buffer.subarray(0, 8).toString('ascii')).toContain('%PDF-1.4');
		expect(buffer.toString('latin1')).toContain('YAMKELA JOJO');
		expect(buffer.toString('latin1')).toContain('CustomConnect');
	});
});
