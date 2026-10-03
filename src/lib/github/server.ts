import { env } from '$env/dynamic/private';
import type { GitHubRepositoriesResult } from '$lib/types';
import { getGitHubResponseMetadata } from './cache-policy';
import { fetchUserRepositories } from './service';

type ResponseHooks = {
	locals?: App.Locals;
	setHeaders?: (headers: Record<string, string>) => void;
};

export async function loadGitHubRepositories(
	fetchImpl: typeof fetch,
	options: ResponseHooks & { username?: string } = {}
): Promise<GitHubRepositoriesResult> {
	const result = await fetchUserRepositories({
		username: options.username || env.GITHUB_USERNAME || 'yamkelajojo',
		token: env.GITHUB_TOKEN,
		apiBaseUrl: env.GITHUB_API_BASE_URL,
		fetchImpl
	});
	const responseMetadata = getGitHubResponseMetadata(result);

	options.setHeaders?.(responseMetadata.headers);
	if (responseMetadata.status >= 500 && options.locals) {
		options.locals.githubDataStatus = 503;
	}

	return result;
}
