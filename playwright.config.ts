import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	timeout: 30_000,
	reporter: process.env.CI ? [['list'], ['github']] : 'list',
	use: {
		baseURL: 'http://127.0.0.1:4173',
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'chromium-desktop',
			grepInvert: /@fallback/,
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 800 }
			}
		},
		{
			name: 'chromium-mobile',
			grepInvert: /@fallback/,
			use: {
				...devices['Pixel 7'],
				viewport: { width: 390, height: 844 }
			}
		},
		{
			name: 'chromium-fallback',
			grep: /@fallback/,
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 800 },
				baseURL: 'http://127.0.0.1:4174'
			}
		}
	],
	webServer: [
		{
			command:
				'node scripts/e2e-worker-server.mjs --mode=success --port=4173 --mock-port=8788 --persist-dir=.wrangler/e2e-success',
			url: 'http://127.0.0.1:4173/robots.txt',
			reuseExistingServer: false,
			timeout: 120_000,
			stdout: 'pipe',
			stderr: 'pipe'
		},
		{
			command:
				'node scripts/e2e-worker-server.mjs --mode=failure --port=4174 --mock-port=8789 --persist-dir=.wrangler/e2e-failure',
			url: 'http://127.0.0.1:4174/robots.txt',
			reuseExistingServer: false,
			timeout: 120_000,
			stdout: 'pipe',
			stderr: 'pipe'
		}
	]
});
