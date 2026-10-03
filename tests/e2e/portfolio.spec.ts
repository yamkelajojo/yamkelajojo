import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Portfolio End-to-End Acceptance Suite (AT-001 through AT-010)', () => {
	test('AT-001 & AT-004: Home -> Work -> Project Case Study -> GitHub link', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1')).toContainText('Yamkela Jojo');
		await expect(page.getByRole('navigation', { name: /Primary|Mobile/i }).first()).toBeVisible();

		await page.getByRole('link', { name: /Explore Selected Work/i }).click();
		await expect(page).toHaveURL(/\/work/);
		await expect(page.locator('h1')).toContainText('Engineering Case Studies');

		await page.getByRole('link', { name: /Read Engineering Case Study/i }).first().click();
		await expect(page).toHaveURL(/\/work\/.+/);
		await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

		const githubLink = page.getByRole('link', { name: /Open GitHub Repository/i });
		await expect(githubLink).toHaveAttribute('href', /https:\/\/github\.com\/yamkelajojo\//);
	});

	test('AT-002 & AT-003: Home -> About -> Experience distinguishes Professional vs Training', async ({
		page
	}) => {
		await page.goto('/about');
		await expect(page.locator('h1')).toContainText('Software Development at the Core');
		await expect(page.getByText('AWS Cloud Practitioner')).toBeVisible();

		await page.getByRole('link', { name: /View Experience Timeline/i }).click();
		await expect(page).toHaveURL('/experience');
		await expect(page.getByText('CustomConnect').first()).toBeVisible();
		await expect(page.getByText('Professional Employment').first()).toBeVisible();
		await expect(page.getByText('Structured Training / Learnership').first()).toBeVisible();
	});

	test('AT-005 & AT-008: GitHub Explorer and CV Download', async ({ page, request }) => {
		await page.goto('/github');
		await expect(page.locator('h1')).toContainText('GitHub — @yamkelajojo');

		const cvResponse = await request.get('/resume/yamkela-jojo-cv.pdf');
		expect(cvResponse.status()).toBe(200);
		expect(cvResponse.headers()['content-type']).toContain('application/pdf');
	});

	test('AT-009 & AT-010: Responsive layout and automated WCAG accessibility check', async ({
		page
	}) => {
		await page.goto('/');
		const hasHorizontalOverflow = await page.evaluate(
			() => document.documentElement.scrollWidth > document.documentElement.clientWidth
		);
		expect(hasHorizontalOverflow).toBe(false);

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
