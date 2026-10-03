import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OPTIONS = new Map();
for (const argument of process.argv.slice(2)) {
	const [key, value = ''] = argument.replace(/^--/, '').split('=', 2);
	OPTIONS.set(key, value);
}

const mode = OPTIONS.get('mode') ?? 'success';
const workerPort = Number(OPTIONS.get('port') ?? (mode === 'failure' ? 4174 : 4173));
const mockPort = Number(OPTIONS.get('mock-port') ?? (mode === 'failure' ? 8789 : 8788));
const mockHost = OPTIONS.get('api-host') ?? '127.0.0.1';
const persistDir = path.resolve(ROOT, OPTIONS.get('persist-dir') ?? `.wrangler/e2e-${mode}`);
const persistRoot = path.join(ROOT, '.wrangler');
const wranglerEntrypoint = path.join(ROOT, 'node_modules/wrangler/bin/wrangler.js');

if (!['success', 'failure'].includes(mode)) {
	throw new Error(`Unsupported E2E server mode: ${mode}`);
}
if (!Number.isInteger(workerPort) || !Number.isInteger(mockPort)) {
	throw new Error('Worker and mock ports must be integers.');
}
if (!persistDir.startsWith(`${persistRoot}${path.sep}`)) {
	throw new Error('The E2E persistence directory must be inside .wrangler/.');
}

let upstreamRequests = 0;
const requestedUrls = [];

function sendJson(response, status, body, headers = {}) {
	response.writeHead(status, {
		'Content-Type': 'application/json; charset=utf-8',
		'Cache-Control': 'no-store',
		...headers
	});
	response.end(JSON.stringify(body));
}

const mockServer = createServer((request, response) => {
	const url = new URL(request.url ?? '/', `http://${request.headers.host ?? '127.0.0.1'}`);

	if (url.pathname === '/__e2e/state' && request.method === 'GET') {
		sendJson(response, 200, { mode, upstreamRequests, requestedUrls });
		return;
	}

	if (url.pathname === '/__e2e/reset' && request.method === 'POST') {
		upstreamRequests = 0;
		requestedUrls.length = 0;
		sendJson(response, 200, { mode, upstreamRequests });
		return;
	}

	if (url.pathname !== '/users/yamkelajojo/repos' || request.method !== 'GET') {
		sendJson(response, 404, { message: 'Not found' });
		return;
	}

	upstreamRequests += 1;
	requestedUrls.push(`${url.pathname}${url.search}`);

	if (mode === 'failure') {
		sendJson(
			response,
			403,
			{ message: 'API rate limit exceeded. This private upstream body must not reach visitors.' },
			{ 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': '2000000000' }
		);
		return;
	}

	const page = Number(url.searchParams.get('page') ?? '1');
	if (page !== 1) {
		sendJson(response, 200, []);
		return;
	}

	const repositories = [
		{
			name: 'portfolio',
			full_name: 'yamkelajojo/portfolio',
			description: 'SvelteKit portfolio running on Cloudflare Workers.',
			html_url: 'https://github.com/yamkelajojo/portfolio',
			homepage: 'https://portfolio.example',
			language: 'TypeScript',
			stargazers_count: 8,
			forks_count: 2,
			topics: ['sveltekit', 'cloudflare-workers'],
			created_at: '2024-01-01T00:00:00Z',
			updated_at: '2026-09-29T12:00:00Z',
			pushed_at: '2026-09-29T12:00:00Z',
			default_branch: 'main',
			visibility: 'public',
			fork: false,
			archived: false,
			private: false
		},
		{
			name: 'greenbidder',
			full_name: 'yamkelajojo/greenbidder',
			description: 'Agricultural marketplace and produce discovery.',
			html_url: 'https://github.com/yamkelajojo/greenbidder',
			homepage: null,
			language: 'JavaScript',
			stargazers_count: 3,
			forks_count: 1,
			topics: ['react-native', 'postgis'],
			created_at: '2024-02-01T00:00:00Z',
			updated_at: '2026-09-28T12:00:00Z',
			pushed_at: '2026-09-28T12:00:00Z',
			default_branch: 'main',
			visibility: 'public',
			fork: false,
			archived: false,
			private: false
		},
		{
			name: 'odin-recipes',
			full_name: 'yamkelajojo/odin-recipes',
			description: 'A small recipe site built during frontend foundations.',
			html_url: 'https://github.com/yamkelajojo/odin-recipes',
			homepage: null,
			language: 'HTML',
			stargazers_count: 1,
			forks_count: 0,
			topics: ['html', 'css'],
			created_at: '2023-01-01T00:00:00Z',
			updated_at: '2026-09-27T12:00:00Z',
			pushed_at: '2026-09-27T12:00:00Z',
			default_branch: 'main',
			visibility: 'public',
			fork: false,
			archived: false,
			private: false
		},
		{
			name: 'classification-predict-streamlit-template',
			full_name: 'yamkelajojo/classification-predict-streamlit-template',
			description: 'A forked training template for a Streamlit classifier.',
			html_url: 'https://github.com/yamkelajojo/classification-predict-streamlit-template',
			homepage: null,
			language: 'Python',
			stargazers_count: 0,
			forks_count: 5,
			topics: ['streamlit', 'classification'],
			created_at: '2023-04-01T00:00:00Z',
			updated_at: '2026-09-26T12:00:00Z',
			pushed_at: '2026-09-26T12:00:00Z',
			default_branch: 'main',
			visibility: 'public',
			fork: true,
			archived: false,
			private: false
		},
		{
			name: 'archived-experiment',
			full_name: 'yamkelajojo/archived-experiment',
			description: null,
			html_url: 'https://github.com/yamkelajojo/archived-experiment',
			language: null,
			stargazers_count: 0,
			forks_count: 0,
			topics: [],
			created_at: '2021-01-01T00:00:00Z',
			updated_at: '2022-01-01T00:00:00Z',
			pushed_at: null,
			default_branch: 'main',
			visibility: 'public',
			fork: false,
			archived: true,
			private: false
		}
	];

	response.writeHead(200, {
		'Content-Type': 'application/json; charset=utf-8',
		'X-RateLimit-Remaining': '59'
	});
	response.end(JSON.stringify(repositories));
});

await new Promise((resolve, reject) => {
	mockServer.once('error', reject);
	mockServer.listen(mockPort, '127.0.0.1', resolve);
});

rmSync(persistDir, { recursive: true, force: true });
mkdirSync(persistDir, { recursive: true });
const workerArguments = [
	wranglerEntrypoint,
	'dev',
	'--local',
	'--ip',
	'127.0.0.1',
	'--port',
	String(workerPort),
	'--persist-to',
	persistDir,
	'--log-level',
	'none',
	'--show-interactive-dev-session=false',
	'--var',
	`GITHUB_API_BASE_URL:http://${mockHost}:${mockPort}`,
	'--var',
	'GITHUB_USERNAME:yamkelajojo',
	'--var',
	'SITE_ORIGIN:https://portfolio.example'
];

const worker = spawn(process.execPath, workerArguments, {
	cwd: ROOT,
	stdio: 'inherit',
	env: { ...process.env, CI: '1' }
});

let stopping = false;
function stop(exitCode = 0) {
	if (stopping) return;
	stopping = true;
	mockServer.close();
	if (worker.exitCode === null && !worker.killed) worker.kill('SIGTERM');
	process.exitCode = exitCode;
}

process.once('SIGINT', () => stop(0));
process.once('SIGTERM', () => stop(0));
worker.once('error', (error) => {
	console.error('Could not start the built Cloudflare Worker:', error);
	stop(1);
});
worker.once('exit', (code, signal) => {
	if (stopping) return;
	console.error(`The Cloudflare Worker exited unexpectedly (code=${code}, signal=${signal}).`);
	stop(code ?? 1);
});
