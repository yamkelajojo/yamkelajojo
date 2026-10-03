import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const mockStateUrl = 'http://127.0.0.1:8788/__e2e/state';

async function expectNoHorizontalOverflow(page: Page, label: string) {
	const dimensions = await page.evaluate(() => ({
		viewport: document.documentElement.clientWidth,
		document: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
	}));
	expect(dimensions.document, `${label} at ${dimensions.viewport}px`).toBeLessThanOrEqual(
		dimensions.viewport
	);
}

async function readMockState(request: APIRequestContext) {
	const response = await request.get(mockStateUrl);
	expect(response.ok()).toBeTruthy();
	return (await response.json()) as { upstreamRequests: number; requestedUrls: string[] };
}

test.describe('Built Cloudflare Worker — cache policy, routes, and static artifacts', () => {
	test('serves normalized GitHub data and route headers from the built Worker', async ({ request }, testInfo) => {
		test.skip(testInfo.project.name !== 'chromium-desktop', 'Run the Worker API contract once per server.');
		const before = await readMockState(request);
		const response = await request.get('/api/github');
		expect(response.status()).toBe(200);
		expect(response.headers()['content-type']).toContain('application/json');
		expect(response.headers()['x-github-data-source']).toBe('github-api');
		expect(response.headers()['cache-control']).toContain('max-age=1800');
		expect(response.headers()['cache-control']).toContain('stale-while-revalidate=1800');
		expect(response.headers()['cache-control']).toContain('stale-if-error=86400');
		expect(response.headers()['x-content-type-options']).toBe('nosniff');
		expect(response.headers()['x-frame-options']).toBe('SAMEORIGIN');

		const result = await response.json();
		expect(result.source).toBe('github-api');
		expect(result.repositories).toHaveLength(5);
		expect(result.repositories.find((repo: { name: string }) => repo.name === 'greenbidder')).toMatchObject({
			language: 'JavaScript',
			isFork: false,
			isArchived: false
		});
		expect(result.repositories.find((repo: { name: string }) => repo.name === 'archived-experiment')).toMatchObject({
			description: null,
			language: null,
			isArchived: true
		});

		const after = await readMockState(request);
		expect(after.upstreamRequests - before.upstreamRequests).toBe(1);
		expect(after.requestedUrls.at(-1)).toContain('per_page=100');

		// Wrangler's local runtime verifies the generated Worker and response policy.
		// Cf-Cache-Status is a Cloudflare runtime signal; only a deployed Worker can
		// verify edge-cache HIT/STALE behavior.
		const cacheStatus = response.headers()['cf-cache-status'];
		if (cacheStatus) expect(cacheStatus).toMatch(/^(HIT|MISS|EXPIRED|REVALIDATED|UPDATING|STALE|BYPASS|DYNAMIC)$/);
	});

	test('applies GitHub response policy to every server-rendered route', async ({ request }, testInfo) => {
		test.skip(testInfo.project.name !== 'chromium-desktop', 'Run the route-header contract once per server.');

		for (const route of ['/', '/work', '/github']) {
			const response = await request.get(route);
			expect(response.status(), `${route} should render successfully`).toBe(200);
			expect(response.headers()['content-type']).toContain('text/html');
			expect(response.headers()['x-github-data-source']).toBe('github-api');
			expect(response.headers()['cache-control']).toContain('max-age=1800');
			expect(response.headers()['cache-control']).toContain('stale-while-revalidate=1800');
			expect(response.headers()['cache-control']).toContain('stale-if-error=86400');
		}
	});

	test('does not let a public refresh query force GitHub synchronization', async ({ request }) => {
		const before = await readMockState(request);
		const response = await request.get('/api/github?refresh=1', { maxRedirects: 0 });
		expect(response.status()).toBe(308);
		expect(response.headers().location).toBe('/api/github');
		expect(response.headers()['cache-control']).toBe('private, no-store');

		const slashPath = await request.get(
			'http://127.0.0.1:4173//attacker.example?refresh=1',
			{ maxRedirects: 0 }
		);
		expect(slashPath.status()).toBe(308);
		expect(slashPath.headers().location).toBe('/attacker.example');

		const after = await readMockState(request);
		expect(after.upstreamRequests).toBe(before.upstreamRequests);
	});

	test('bounds public SvelteKit data-cache variants to the route invalidation mask', async ({ request }) => {
		const before = await readMockState(request);
		const malformedMask = await request.get(
			'/github/__data.json?x-sveltekit-invalidated=111111',
			{ maxRedirects: 0 }
		);
		expect(malformedMask.status()).toBe(200);
		expect(malformedMask.headers()['content-type']).toContain('application/json');
		expect(malformedMask.headers()['cache-control']).toBe('private, no-store');
		expect(await malformedMask.json()).toMatchObject({
			type: 'redirect',
			location: '/github/__data.json'
		});
		expect((await readMockState(request)).upstreamRequests).toBe(before.upstreamRequests);

		const data = await request.get('/github/__data.json?x-sveltekit-invalidated=11');
		expect(data.status()).toBe(200);
		expect(data.headers()['content-type']).toContain('application/json');
		expect(data.headers()['x-github-data-source']).toBe('github-api');
		expect(await data.text()).toContain('greenbidder');
		expect((await readMockState(request)).upstreamRequests).toBe(before.upstreamRequests + 1);
	});

	test('serves the CV and static image with asset metadata and defensive headers', async ({ request }) => {
		const cv = await request.get('/resume/yamkela-jojo-cv.pdf');
		expect(cv.status()).toBe(200);
		expect(cv.headers()['content-type']).toContain('application/pdf');
		expect(cv.headers()['cache-control']).toContain('max-age=86400');
		expect(cv.headers()['x-content-type-options']).toBe('nosniff');
		expect(cv.headers()['x-frame-options']).toBe('SAMEORIGIN');
		expect(cv.headers()['cross-origin-opener-policy']).toBe('same-origin-allow-popups');
		expect((await cv.body()).subarray(0, 8).toString('latin1')).toContain('%PDF-1.4');

		const image = await request.get('/images/og-cover.svg');
		expect(image.status()).toBe(200);
		expect(image.headers()['content-type']).toContain('image/svg+xml');
		expect(image.headers()['cache-control']).toContain('stale-while-revalidate');

		const home = await request.get('/');
		expect(home.status()).toBe(200);
		const html = await home.text();
		const stylesheetPath = html.match(/href="([^"]+\.css)"/)?.[1];
		expect(stylesheetPath).toBeTruthy();
		const stylesheetUrl = new URL(stylesheetPath ?? '/', 'http://127.0.0.1:4173/').pathname;
		const stylesheet = await request.get(stylesheetUrl);
		expect(stylesheet.status()).toBe(200);
		expect(stylesheet.headers()['content-type']).toContain('text/css');
		expect(stylesheet.headers()['cache-control']).toContain('immutable');
		expect(stylesheet.headers()['x-robots-tag']).toBe('noindex');
	});

	test('keeps unknown routes as secured, non-cacheable 404 responses', async ({ request }) => {
		const response = await request.get('/this-route-does-not-exist');
		expect(response.status()).toBe(404);
		expect(response.headers()['cache-control']).toBe('private, no-store');
		expect(response.headers()['x-content-type-options']).toBe('nosniff');
		expect(await response.text()).toContain('Route not found');
	});

	test('uses configured SITE_ORIGIN for page head, sitemap, and robots rather than request Host', async ({
		request
	}) => {
		const pageResponse = await request.get('/github');
		expect(pageResponse.status()).toBe(200);
		const html = await pageResponse.text();
		expect(html).toMatch(/<title>GitHub Repositories/);
		expect(html).toMatch(/<link[^>]*rel="canonical"[^>]*href="https:\/\/portfolio\.example\/github"/);
		expect(html).toMatch(/<meta[^>]*property="og:url"[^>]*content="https:\/\/portfolio\.example\/github"/);
		expect(html).toMatch(/<meta[^>]*property="og:image"[^>]*content="https:\/\/portfolio\.example\/images\/og-cover\.svg"/);
		const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
		expect(jsonLdMatch?.[1]).toBeTruthy();
		const jsonLd = JSON.parse(jsonLdMatch?.[1] ?? '{}') as { url?: string };
		expect(jsonLd.url).toBe('https://portfolio.example/');

		const sitemapResponse = await request.get('/sitemap.xml', {
			headers: { host: 'untrusted.example' }
		});
		expect(sitemapResponse.status()).toBe(200);
		const sitemap = await sitemapResponse.text();
		expect(sitemap).toContain('https://portfolio.example/work/greenbidder-marketplace');
		expect(sitemap).not.toContain('untrusted.example');

		const robotsResponse = await request.get('/robots.txt');
		expect(robotsResponse.status()).toBe(200);
		expect(await robotsResponse.text()).toContain('Sitemap: https://portfolio.example/sitemap.xml');
	});
});

test.describe('Portfolio journeys — desktop and mobile', () => {
	test('navigates from home to selected work, case study, related project, and GitHub source', async ({
		page
	}) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Yamkela Jojo');
		await expect(page.getByRole('group', { name: 'GitHub repository data status' })).toContainText(
			'GitHub API data'
		);
		await page.getByRole('link', { name: 'Explore Selected Work' }).click();
		await expect(page).toHaveURL(/\/work$/);
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Engineering Case Studies');

		await page.getByRole('link', { name: 'Read Engineering Case Study' }).first().click();
		await expect(page).toHaveURL(/\/work\/engineering-portfolio$/);
		await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Other Engineering Case Studies' })).toBeVisible();
		await expect(page.getByRole('link', { name: /Open GitHub Repository/i })).toHaveAttribute(
			'href',
			/https:\/\/github\.com\//
		);

		await page.getByRole('link', { name: 'Read Case Study' }).first().click();
		await expect(page).toHaveURL(/\/work\/(?!engineering-portfolio)[^/]+$/);
	});

	test('supports skip navigation, mobile menu, keyboard quick-jump, and persistent theme choice', async ({
		page,
		isMobile
	}) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page.locator('#main-content')).toBeFocused();

		if (isMobile) {
			await page.getByRole('button', { name: 'Open navigation menu' }).click();
			const mobileNavigation = page.getByRole('navigation', { name: 'Mobile Primary' });
			await expect(mobileNavigation).toBeVisible();
			await mobileNavigation.getByRole('link', { name: 'GitHub' }).click();
			await expect(page).toHaveURL(/\/github$/);
		} else {
			const desktopNavigation = page.getByRole('navigation', { name: 'Primary' });
			await expect(desktopNavigation).toBeVisible();
			await desktopNavigation.getByRole('link', { name: 'About' }).click();
			await expect(page).toHaveURL(/\/about$/);
		}

		await page.keyboard.press('Control+k');
		const quickJump = page.getByRole('dialog', { name: 'Quick Navigation & Case Study Index' });
		await expect(quickJump).toBeVisible();
		await page.getByRole('searchbox', { name: 'Filter pages or projects' }).fill('GreenBidder');
		const matchingProject = quickJump.getByRole('link', {
			name: /GreenBidder — Geospatial Agricultural Marketplace/
		});
		await expect(matchingProject).toBeVisible();
		await matchingProject.click();
		await expect(page).toHaveURL(/\/work\/greenbidder-marketplace$/);
		await expect(quickJump).toBeHidden();

		const root = page.locator('html');
		const beforeTheme = await root.getAttribute('data-theme');
		await page.getByRole('button', { name: /Switch to (dark|light) theme/ }).click();
		const selectedTheme = await root.getAttribute('data-theme');
		expect(selectedTheme).not.toBe(beforeTheme);
		const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
		const canvasColor = await root.evaluate((element) =>
			getComputedStyle(element).getPropertyValue('--bg-canvas').trim()
		);
		expect(themeColor).toBe(canvasColor);
		await page.reload();
		await expect(root).toHaveAttribute('data-theme', selectedTheme ?? 'light');
	});

	test('filters, searches, sorts, and represents forked, archived, and sparse GitHub repositories', async ({
		page
	}) => {
		await page.goto('/github');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('GitHub — @yamkelajojo');
		await expect(page.getByRole('group', { name: 'GitHub repository data status' })).toContainText(
			'5 public repositories'
		);

		const search = page.getByRole('searchbox', { name: 'Search Repositories' });
		await search.fill('postgis');
		await expect(page.getByRole('article')).toHaveCount(1);
		await expect(page.getByRole('link', { name: 'greenbidder', exact: true })).toBeVisible();
		await search.fill('');

		await page.getByLabel('Primary Language').selectOption('JavaScript');
		await expect(page.getByRole('article')).toHaveCount(1);
		await expect(page.getByRole('link', { name: 'greenbidder', exact: true })).toBeVisible();
		await page.getByLabel('Primary Language').selectOption('All');

		const forkCard = page.getByRole('article').filter({
			has: page.getByRole('link', { name: 'classification-predict-streamlit-template', exact: true })
		});
		await expect(forkCard).toContainText('Fork / Sprint Template');
		await page.getByLabel('Include Forks').uncheck();
		await expect(forkCard).toHaveCount(0);
		await page.getByLabel('Include Forks').check();
		await expect(forkCard).toBeVisible();

		const archivedCard = page.getByRole('article').filter({
			has: page.getByRole('link', { name: 'archived-experiment', exact: true })
		});
		await expect(archivedCard).toContainText('Archived');
		await expect(archivedCard).toContainText('Multi-file');
		await expect(archivedCard).toContainText('Public engineering repository');

		await page.getByLabel('Sort By').selectOption('stars');
		const cards = page.getByRole('article');
		await expect(cards.first()).toContainText('portfolio');
		await expect(page.getByText(/Showing 5 of 5 repositories/)).toBeVisible();
	});

	test('filters curated project case studies by domain', async ({ page }) => {
		await page.goto('/work');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Engineering Case Studies');
		const projectCountHeading = page.getByRole('heading', { name: /Curated Case Studies/ });
		await expect(projectCountHeading).toContainText('6');
		await page.getByRole('tab', { name: 'Mobile' }).click();
		await expect(page.getByRole('heading', { name: /Curated Case Studies/ })).toContainText('1');
		await expect(page.getByRole('link', { name: /GreenBidder — Geospatial Agricultural Marketplace/i })).toBeVisible();
	});

	test('moves from About to Experience while preserving truthful career distinctions', async ({ page }) => {
		await page.goto('/about');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Software Development at the Core');
		await expect(page.getByText('AWS Cloud Practitioner')).toBeVisible();
		await page.getByRole('link', { name: 'View Experience Timeline' }).click();
		await expect(page).toHaveURL(/\/experience$/);
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Professional Experience');
		await expect(page.getByText('Professional Employment').first()).toBeVisible();
		await expect(page.getByText('Structured Training / Learnership').first()).toBeVisible();
	});

	test('validates a contact draft without claiming that a message was sent', async ({ page }) => {
		await page.goto('/contact');
		await expect(page.getByRole('heading', { name: 'Validate a Message Draft' })).toBeVisible();
		await page.getByLabel('Your Name').fill('Ada Lovelace');
		await page.getByLabel('Email Address').fill('ada@example.org');
		await page.getByLabel('Subject').fill('Engineering opportunity');
		await page
			.getByLabel('Message')
			.fill('Hello <b>Yamkela</b>, I would like to discuss an engineering role with you.');
		await page.getByRole('button', { name: 'Validate Draft' }).click();

		const status = page.getByRole('status');
		await expect(status).toContainText('passed server-side validation');
		await expect(status).toContainText('Nothing was sent or stored');
		await expect(page.getByLabel('Your Name')).toHaveValue('Ada Lovelace');
		await expect(page.getByLabel('Email Address')).toHaveValue('ada@example.org');
		await expect(page.getByLabel('Message')).toHaveValue(
			'Hello Yamkela, I would like to discuss an engineering role with you.'
		);
		await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
			'href',
			'https://www.linkedin.com/in/yamkela-jojo-911774217'
		);
	});

	test('serves an accessible 404 destination with direct paths back to useful content', async ({ page }) => {
		const response = await page.goto('/this-page-does-not-exist');
		expect(response?.status()).toBe(404);
		await expect(page.getByRole('heading', { name: 'Route not found' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Return Home' })).toHaveAttribute('href', '/');
		await expect(page.getByRole('link', { name: 'View Selected Work' })).toHaveAttribute('href', '/work');
	});

	test('downloads the CV PDF from the web CV page', async ({ page, request }) => {
		await page.goto('/cv');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Curriculum Vitae');
		const response = await request.get('/resume/yamkela-jojo-cv.pdf');
		expect(response.status()).toBe(200);
		expect(response.headers()['content-type']).toContain('application/pdf');
		await expect(page.getByRole('link', { name: 'Download CV (PDF)' }).first()).toHaveAttribute(
			'href',
			'/resume/yamkela-jojo-cv.pdf'
		);
	});

	test('has no horizontal overflow and passes axe on responsive pages', async ({ page }) => {
		const routes = [
			'/',
			'/work',
			'/work/greenbidder-marketplace',
			'/about',
			'/experience',
			'/github',
			'/cv',
			'/contact',
			'/labs',
			'/this-page-does-not-exist'
		];
		const viewportSizes = [
			{ width: 390, height: 844 },
			{ width: 768, height: 1024 },
			{ width: 1280, height: 800 }
		];

		for (const viewport of viewportSizes) {
			await page.setViewportSize(viewport);
			for (const route of routes) {
				const response = await page.goto(route);
				if (route === '/this-page-does-not-exist') {
					expect(response?.status()).toBe(404);
				} else {
					expect(response?.status(), `${route} should load at ${viewport.width}px`).toBe(200);
				}
				await expectNoHorizontalOverflow(page, route);

				if (viewport.width === 390) {
					const scan = await new AxeBuilder({ page }).analyze();
					expect(scan.violations, `${route} accessibility violations`).toEqual([]);
				}
			}
		}
	});
});

test('renders a secured 503 fallback page from the built Worker @fallback', async ({ request }) => {
	const response = await request.get('/github');
	expect(response.status()).toBe(503);
	expect(response.headers()['x-github-data-source']).toBe('fallback-snapshot');
	expect(response.headers()['retry-after']).toBe('300');
	expect(response.headers()['cache-control']).toContain('max-age=300');
	const html = await response.text();
	expect(html).toContain('Maintained fallback snapshot');
	expect(html).toContain('rate-limited');
	expect(html).toContain('greenbidder');
	expect(html).not.toContain('private upstream body');
});

test('returns a safe, explicit rate-limit snapshot from the built Worker API @fallback', async ({ request }) => {
	const response = await request.get('/api/github');
	expect(response.status()).toBe(503);
	expect(response.headers()['x-github-data-source']).toBe('fallback-snapshot');
	expect(response.headers()['retry-after']).toBe('300');
	expect(response.headers()['cache-control']).toContain('max-age=300');
	const result = await response.json();
	expect(result).toMatchObject({
		source: 'fallback-snapshot',
		fetchedAt: null,
		failureCode: 'rate-limited'
	});
	expect(result.errorMessage).not.toContain('private upstream body');
	expect(result.repositories.length).toBeGreaterThan(0);
});

test('shows a maintained, searchable snapshot when the Worker receives a GitHub rate limit @fallback', async ({
	page
}) => {
	const response = await page.goto('/github');
	expect(response?.status()).toBe(503);
	expect(response?.headers()['x-github-data-source']).toBe('fallback-snapshot');
	expect(response?.headers()['retry-after']).toBe('300');
	expect(response?.headers()['cache-control']).toContain('max-age=300');
	await expect(page.getByRole('group', { name: 'GitHub repository data status' })).toContainText(
		'Maintained fallback snapshot'
	);
	await expect(page.getByRole('status')).toContainText('rate-limited');
	await expect(page.getByRole('status')).not.toContainText('private upstream body');
	await expect(page.getByRole('link', { name: 'greenbidder', exact: true })).toBeVisible();

	const search = page.getByRole('searchbox', { name: 'Search Repositories' });
	await search.fill('greenbidder');
	await expect(page.getByRole('article')).toHaveCount(1);
	await expect(page.getByRole('link', { name: 'greenbidder', exact: true })).toBeVisible();
});
