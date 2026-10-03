import { describe, expect, it } from 'vitest';
import {
	extractAvailableLanguages,
	filterAndSortRepositories,
	normalizeGitHubRepo,
	normalizeGitHubRepos
} from '$lib/github/normalizer';

describe('GITHUB-001 & GITHUB-004 — GitHub normalizer branch and boundary coverage', () => {
	const baseRawRepo = {
		name: 'greenbidder',
		full_name: 'yamkelajojo/greenbidder',
		description: 'Agricultural marketplace built with React Native and Supabase PostGIS',
		html_url: 'https://github.com/yamkelajojo/greenbidder',
		homepage: 'https://greenbidder.example.com',
		language: 'JavaScript',
		stargazers_count: 4,
		forks_count: 1,
		topics: ['react-native', 'supabase', 'postgis'],
		created_at: '2026-04-10T09:39:24Z',
		updated_at: '2026-05-05T18:28:58Z',
		pushed_at: '2026-09-21T04:34:48Z',
		default_branch: 'main',
		visibility: 'public',
		fork: false,
		archived: false,
		private: false
	};

	it('normalizes a complete raw GitHub repository payload including defaultBranch and visibility', () => {
		const repo = normalizeGitHubRepo(baseRawRepo);
		expect(repo).toEqual({
			name: 'greenbidder',
			fullName: 'yamkelajojo/greenbidder',
			description: 'Agricultural marketplace built with React Native and Supabase PostGIS',
			htmlUrl: 'https://github.com/yamkelajojo/greenbidder',
			homepage: 'https://greenbidder.example.com',
			language: 'JavaScript',
			stars: 4,
			forks: 1,
			topics: ['react-native', 'supabase', 'postgis'],
			createdAt: '2026-04-10T09:39:24Z',
			updatedAt: '2026-05-05T18:28:58Z',
			pushedAt: '2026-09-21T04:34:48Z',
			defaultBranch: 'main',
			visibility: 'public',
			isFork: false,
			isArchived: false
		});
	});

	it('handles missing description, missing language, empty topics, and blank or malformed homepage branches', () => {
		const repo = normalizeGitHubRepo({
			...baseRawRepo,
			full_name: undefined,
			description: '   ',
			language: null,
			homepage: 'not a valid url',
			topics: null,
			pushed_at: null,
			default_branch: undefined,
			visibility: undefined
		});

		expect(repo).not.toBeNull();
		expect(repo?.fullName).toBe('yamkelajojo/greenbidder');
		expect(repo?.description).toBeNull();
		expect(repo?.language).toBeNull();
		expect(repo?.homepage).toBeNull();
		expect(repo?.topics).toEqual([]);
		expect(repo?.pushedAt).toBeNull();
		expect(repo?.createdAt).toBe('2026-04-10T09:39:24Z');
		expect(repo?.updatedAt).toBe('2026-05-05T18:28:58Z');
		expect(repo?.defaultBranch).toBeNull();
		expect(repo?.visibility).toBeNull();
	});

	it('preserves genuinely absent optional timestamps and branch metadata as null', () => {
		const repo = normalizeGitHubRepo({
			...baseRawRepo,
			created_at: undefined,
			updated_at: undefined,
			pushed_at: undefined,
			default_branch: undefined,
			visibility: undefined,
			fork: 'true',
			archived: 1
		});

		expect(repo).not.toBeNull();
		expect(repo?.createdAt).toBeNull();
		expect(repo?.updatedAt).toBeNull();
		expect(repo?.pushedAt).toBeNull();
		expect(repo?.defaultBranch).toBeNull();
		expect(repo?.visibility).toBeNull();
		expect(repo?.isFork).toBe(false);
		expect(repo?.isArchived).toBe(false);
	});

	it('handles boundary cases for stars (0, 1, large values) and topics (0, 1, many)', () => {
		const zeroRepo = normalizeGitHubRepo({
			...baseRawRepo,
			stargazers_count: 0,
			forks_count: 0,
			topics: []
		});
		expect(zeroRepo?.stars).toBe(0);
		expect(zeroRepo?.forks).toBe(0);
		expect(zeroRepo?.topics).toEqual([]);

		const singleRepo = normalizeGitHubRepo({
			...baseRawRepo,
			stargazers_count: 1,
			forks_count: 1,
			topics: ['sveltekit']
		});
		expect(singleRepo?.stars).toBe(1);
		expect(singleRepo?.topics).toEqual(['sveltekit']);

		const largeRepo = normalizeGitHubRepo({
			...baseRawRepo,
			stargazers_count: 42500,
			forks_count: 3200,
			topics: ['a', 'b', 'c', 'd', 'e', 'f', '  ', 123 as unknown as string]
		});
		expect(largeRepo?.stars).toBe(42500);
		expect(largeRepo?.forks).toBe(3200);
		expect(largeRepo?.topics).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);

		const negativeOrNaNRepo = normalizeGitHubRepo({
			...baseRawRepo,
			stargazers_count: -5,
			forks_count: 'invalid'
		});
		expect(negativeOrNaNRepo?.stars).toBe(0);
		expect(negativeOrNaNRepo?.forks).toBe(0);
	});

	it('rejects null, primitive, private, or malformed payloads missing name or valid html_url', () => {
		expect(normalizeGitHubRepo(null)).toBeNull();
		expect(normalizeGitHubRepo('not-an-object')).toBeNull();
		expect(normalizeGitHubRepo({})).toBeNull();
		expect(normalizeGitHubRepo({ ...baseRawRepo, name: '' })).toBeNull();
		expect(normalizeGitHubRepo({ ...baseRawRepo, html_url: 'javascript:alert(1)' })).toBeNull();
		expect(normalizeGitHubRepo({ ...baseRawRepo, html_url: ':::invalid-url:::' })).toBeNull();
		expect(normalizeGitHubRepo({ ...baseRawRepo, private: true })).toBeNull();
		expect(
			normalizeGitHubRepo({ ...baseRawRepo, private: false, visibility: 'PRIVATE' })
		).toBeNull();
		expect(
			normalizeGitHubRepo({ ...baseRawRepo, private: false, visibility: 'INTERNAL' })
		).toBeNull();
		expect(
			normalizeGitHubRepo({ ...baseRawRepo, private: 'false', visibility: 'public' })
		).toBeNull();
		expect(
			normalizeGitHubRepo({ ...baseRawRepo, private: undefined, visibility: undefined })
		).toBeNull();
		expect(
			normalizeGitHubRepo({ ...baseRawRepo, private: undefined, visibility: 'public' })
		).not.toBeNull();
	});

	it('handles boundary cases for repository arrays (0, 1, many) and sorts by latest activity', () => {
		expect(normalizeGitHubRepos(null)).toEqual([]);
		expect(normalizeGitHubRepos([])).toEqual([]);

		const oneList = normalizeGitHubRepos([baseRawRepo]);
		expect(oneList.length).toBe(1);

		const manyList = normalizeGitHubRepos([
			{
				...baseRawRepo,
				name: 'older-repo',
				pushed_at: '2023-08-29T07:11:04Z',
				updated_at: '2023-08-29T07:11:04Z'
			},
			null,
			{
				...baseRawRepo,
				name: 'newest-repo',
				pushed_at: '2026-10-03T07:13:11Z',
				updated_at: '2026-10-03T07:13:14Z'
			},
			{
				...baseRawRepo,
				name: 'middle-repo',
				pushed_at: null,
				updated_at: '2025-08-11T20:53:23Z'
			}
		]);

		expect(manyList.map((r) => r.name)).toEqual(['newest-repo', 'middle-repo', 'older-repo']);
	});

	it('filters and sorts normalized repositories by query, language, fork visibility, and sort mode', () => {
		const repos = normalizeGitHubRepos([
			{
				...baseRawRepo,
				name: 'alpha-laravel',
				description: 'Laravel recipe app',
				language: 'PHP',
				stargazers_count: 2,
				topics: ['laravel'],
				fork: false,
				pushed_at: '2025-05-01T00:00:00Z'
			},
			{
				...baseRawRepo,
				name: 'zeta-python',
				description: 'Sentiment classifier',
				language: 'Python',
				stargazers_count: 10,
				topics: ['nlp', 'streamlit'],
				fork: false,
				pushed_at: '2024-03-01T00:00:00Z'
			},
			{
				...baseRawRepo,
				name: 'beta-fork',
				description: 'Forked repo',
				language: 'Jupyter Notebook',
				stargazers_count: 0,
				topics: [],
				fork: true,
				pushed_at: '2026-01-01T00:00:00Z'
			}
		]);

		expect(extractAvailableLanguages(repos)).toEqual(['Jupyter Notebook', 'PHP', 'Python']);

		const nonForks = filterAndSortRepositories(repos, { includeForks: false });
		expect(nonForks.map((r) => r.name)).toEqual(['alpha-laravel', 'zeta-python']);

		const phpOnly = filterAndSortRepositories(repos, { language: 'PHP' });
		expect(phpOnly.map((r) => r.name)).toEqual(['alpha-laravel']);

		const topicQuery = filterAndSortRepositories(repos, { query: 'streamlit' });
		expect(topicQuery.map((r) => r.name)).toEqual(['zeta-python']);

		const byStars = filterAndSortRepositories(repos, { sortBy: 'stars' });
		expect(byStars[0]?.name).toBe('zeta-python');

		const byName = filterAndSortRepositories(repos, { sortBy: 'name' });
		expect(byName.map((r) => r.name)).toEqual(['alpha-laravel', 'beta-fork', 'zeta-python']);
	});
});
