import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	...(process.env.VITEST
		? {
				resolve: {
					conditions: ['browser']
				}
			}
		: {}),
	server: {
		host: '0.0.0.0',
		port: 5173,
		allowedHosts: true
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./tests/setup.ts'],
		include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
		maxWorkers: 2,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'json-summary'],
			include: [
				'src/lib/data/**/*.ts',
				'src/lib/github/**/*.ts',
				'src/lib/utils/**/*.ts'
			]
		}
	}
});
