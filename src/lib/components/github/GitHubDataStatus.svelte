<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { GitHubDataSource } from '$lib/types';
	import { formatIsoDate } from '$lib/utils/format';

	type StatusModel = {
		source: GitHubDataSource;
		fetchedAt: string | null;
		errorMessage: string | null;
	};

	let {
		status,
		totalRepositories
	}: {
		status: StatusModel;
		totalRepositories: number;
	} = $props();

	const isFallback = $derived(status.source === 'fallback-snapshot');
</script>

<div
	class="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border px-4 py-3 text-xs"
	style="border-color: var(--border-subtle); background-color: var(--bg-surface); font-family: var(--font-mono);"
	role="group"
	aria-label="GitHub repository data status"
>
	<span class="rounded px-2 py-0.5 font-semibold {isFallback ? 'badge-training' : 'badge-pro'}">
		{isFallback ? 'Maintained fallback snapshot' : 'GitHub API data'}
	</span>
	<span style="color: var(--text-secondary);">
		{totalRepositories} public repositories
	</span>
	{#if status.fetchedAt}
		<span style="color: var(--text-muted);">Payload fetched {formatIsoDate(status.fetchedAt)}</span>
	{:else}
		<span style="color: var(--text-muted);">No live-fetch timestamp is available</span>
	{/if}
	<span class="basis-full" style="color: var(--text-muted);">
		Production policy: successful responses stay fresh for 30 minutes, then may be served stale during background revalidation or for up to 24 hours on Worker error. A Workers Caching hit still counts as a Worker request but skips Worker execution; a miss or revalidation can invoke the Worker and call GitHub.
	</span>
</div>

{#if isFallback}
	<div
		role="status"
		class="mt-3 flex items-start gap-2.5 rounded-md border px-4 py-3 text-xs leading-relaxed"
		style="border-color: var(--status-training-border); background-color: var(--status-training-bg); color: var(--status-training-text);"
	>
		<Icon name="alert" size={15} class="mt-0.5 shrink-0" />
		<span>
			{status.errorMessage ?? 'Live GitHub synchronization failed; showing a manually maintained repository snapshot.'}
			The fallback response is fresh for five minutes; a later miss or revalidation must receive traffic before it tries GitHub again.
		</span>
	</div>
{/if}
