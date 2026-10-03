<script lang="ts">
	import type { GitHubRepository } from '$lib/types';
	import { formatIsoDate, getLanguageColor } from '$lib/utils/format';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { repo }: { repo: GitHubRepository } = $props();
</script>

<article class="editorial-card flex h-full flex-col justify-between p-5">
	<div>
		<div class="flex items-start justify-between gap-3">
			<div class="min-w-0">
				<h3
					class="truncate text-base font-semibold tracking-tight"
					style="font-family: var(--font-mono); color: var(--text-primary);"
				>
					<a
						href={repo.htmlUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="hover:underline"
					>
						{repo.name}
					</a>
				</h3>
				<p class="text-xs" style="font-family: var(--font-mono); color: var(--text-muted);">
					{repo.fullName}
				</p>
			</div>

			{#if repo.isFork}
				<span
					class="shrink-0 rounded border px-2 py-0.5 text-[11px]"
					style="font-family: var(--font-mono); border-color: var(--border-subtle); color: var(--text-muted);"
				>
					Fork / Sprint Template
				</span>
			{:else}
				<span
					class="shrink-0 rounded px-2 py-0.5 text-[11px] badge-handson"
					style="font-family: var(--font-mono);"
				>
					Source Repo
				</span>
			{/if}
		</div>

		<p class="mt-3 text-sm leading-relaxed" style="color: var(--text-secondary);">
			{repo.description ??
				'Public engineering repository in Yamkela Jojo’s GitHub workspace.'}
		</p>

		{#if repo.topics.length > 0}
			<div class="mt-3 flex flex-wrap gap-1.5" aria-label="Repository topics">
				{#each repo.topics as topic (topic)}
					<span
						class="rounded px-2 py-0.5 text-[11px]"
						style="font-family: var(--font-mono); background-color: var(--bg-subtle); color: var(--text-secondary);"
					>
						#{topic}
					</span>
				{/each}
			</div>
		{/if}
	</div>

	<div class="mt-5 border-t pt-3.5" style="border-color: var(--border-subtle);">
		<div
			class="flex flex-wrap items-center justify-between gap-2 text-xs"
			style="font-family: var(--font-mono); color: var(--text-muted);"
		>
			<div class="flex items-center gap-3">
				<span class="inline-flex items-center gap-1.5" style="color: var(--text-secondary);">
					<span
						class="inline-block h-2.5 w-2.5 rounded-full"
						style="background-color: {getLanguageColor(repo.language)};"
					></span>
					<span>{repo.language ?? 'Multi-file'}</span>
				</span>

				<span class="inline-flex items-center gap-1" title="Stars">
					<Icon name="star" size={13} />
					<span>{repo.stars}</span>
				</span>

				<span class="inline-flex items-center gap-1" title="Forks">
					<Icon name="git-fork" size={13} />
					<span>{repo.forks}</span>
				</span>
			</div>

			<span>Updated {formatIsoDate(repo.pushedAt ?? repo.updatedAt)}</span>
		</div>

		<div class="mt-3 flex flex-wrap items-center gap-3">
			<a
				href={repo.htmlUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
				style="font-family: var(--font-mono); color: var(--accent-primary);"
			>
				<Icon name="github" size={13} />
				<span>View on GitHub</span>
				<Icon name="arrow-up-right" size={12} />
			</a>

			{#if repo.homepage}
				<a
					href={repo.homepage}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1 text-xs font-medium hover:underline"
					style="font-family: var(--font-mono); color: var(--text-secondary);"
				>
					<span>External Reference</span>
					<Icon name="arrow-up-right" size={12} />
				</a>
			{/if}
		</div>
	</div>
</article>
