<script lang="ts">
	import SeoHead from '$lib/components/shared/SeoHead.svelte';
	import RepoCard from '$lib/components/github/RepoCard.svelte';
	import GitHubDataStatus from '$lib/components/github/GitHubDataStatus.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { filterAndSortRepositories } from '$lib/github/normalizer';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedLanguage = $state('All');
	let includeForks = $state(true);
	let sortBy = $state<'updated' | 'stars' | 'name'>('updated');

	const filteredRepos = $derived(
		filterAndSortRepositories(data.githubResult.repositories, {
			query: searchQuery,
			language: selectedLanguage,
			includeForks,
			sortBy
		})
	);

</script>

<SeoHead
	title="GitHub Repositories"
	description="Public GitHub repositories and open engineering work from github.com/yamkelajojo, normalized on Worker misses and served with Cloudflare Workers Caching response policies."
	path="/github"
/>

<section class="border-b py-section-compact sm:py-section-regular" style="border-color: var(--border-subtle);">
	<div class="editorial-container">
		<div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
			<div>
				<p class="section-kicker">Public Repository Index</p>
				<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style="color: var(--text-primary);">
					GitHub — @{data.profile.githubUsername}
				</h1>
				<p class="mt-3 max-w-2xl text-base leading-relaxed" style="color: var(--text-secondary);">
					Public repositories are read from GitHub on Worker cache misses or revalidations, then normalized before display. A fresh Workers Caching hit skips Worker code but still counts as a Worker request; the response freshness policy is shown below.
				</p>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<a
					href={data.profile.githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold"
					style="background-color: var(--accent-primary); color: var(--text-on-accent);"
				>
					<Icon name="github" size={16} />
					<span>Open github.com/{data.profile.githubUsername}</span>
					<Icon name="arrow-up-right" size={14} />
				</a>
			</div>
		</div>

		<div class="mt-6">
			<GitHubDataStatus
				status={data.githubResult}
				totalRepositories={data.githubResult.repositories.length}
			/>
		</div>
	</div>
</section>

<!-- Filter Controls & Repository Grid -->
<section class="py-section-compact">
	<div class="editorial-container">
		<h2 class="sr-only">Repository Directory and Filter Controls</h2>
		<div class="editorial-card p-5">
			<div class="grid gap-4 md:grid-cols-12">
				<!-- Search Input -->
				<div class="md:col-span-5">
					<label
						for="repo-search"
						class="block text-xs font-semibold uppercase tracking-wider"
						style="font-family: var(--font-mono); color: var(--text-muted);"
					>
						Search Repositories
					</label>
					<div class="relative mt-1.5">
						<input
							id="repo-search"
							type="search"
							bind:value={searchQuery}
							placeholder="Filter by name, description, language, or topic..."
							class="w-full rounded-md border px-3 py-2 text-sm"
							style="background-color: var(--bg-canvas); border-color: var(--border-subtle); color: var(--text-primary);"
						/>
					</div>
				</div>

				<!-- Language Filter -->
				<div class="md:col-span-3">
					<label
						for="repo-language"
						class="block text-xs font-semibold uppercase tracking-wider"
						style="font-family: var(--font-mono); color: var(--text-muted);"
					>
						Primary Language
					</label>
					<select
						id="repo-language"
						bind:value={selectedLanguage}
						class="mt-1.5 w-full rounded-md border px-3 py-2 text-sm"
						style="background-color: var(--bg-canvas); border-color: var(--border-subtle); color: var(--text-primary);"
					>
						<option value="All">All Languages</option>
						{#each data.languages as lang (lang)}
							<option value={lang}>{lang}</option>
						{/each}
					</select>
				</div>

				<!-- Sort Order -->
				<div class="md:col-span-2">
					<label
						for="repo-sort"
						class="block text-xs font-semibold uppercase tracking-wider"
						style="font-family: var(--font-mono); color: var(--text-muted);"
					>
						Sort By
					</label>
					<select
						id="repo-sort"
						bind:value={sortBy}
						class="mt-1.5 w-full rounded-md border px-3 py-2 text-sm"
						style="background-color: var(--bg-canvas); border-color: var(--border-subtle); color: var(--text-primary);"
					>
						<option value="updated">Latest Activity</option>
						<option value="stars">Stars</option>
						<option value="name">Name (A–Z)</option>
					</select>
				</div>

				<!-- Include Forks Checkbox -->
				<div class="flex items-end pb-2 md:col-span-2">
					<label class="inline-flex cursor-pointer items-center gap-2 text-xs font-medium" style="color: var(--text-secondary);">
						<input
							type="checkbox"
							bind:checked={includeForks}
							class="h-4 w-4 rounded"
						/>
						<span>Include Forks</span>
					</label>
				</div>
			</div>
		</div>

		<!-- Results Count -->
		<div class="mt-6 flex items-center justify-between text-xs" style="font-family: var(--font-mono); color: var(--text-muted);">
			<p>Showing {filteredRepos.length} of {data.githubResult.repositories.length} repositories</p>
			{#if searchQuery || selectedLanguage !== 'All' || !includeForks}
				<button
					type="button"
					onclick={() => {
						searchQuery = '';
						selectedLanguage = 'All';
						includeForks = true;
						sortBy = 'updated';
					}}
					class="font-semibold hover:underline"
					style="color: var(--accent-primary);"
				>
					Reset filters
				</button>
			{/if}
		</div>

		{#if filteredRepos.length > 0}
			<div class="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
				{#each filteredRepos as repo (repo.name)}
					<RepoCard {repo} />
				{/each}
			</div>
		{:else}
			<div class="editorial-card mt-6 p-10 text-center">
				<p class="text-base font-semibold" style="color: var(--text-primary);">
					No repositories match your current filter criteria.
				</p>
				<p class="mt-1 text-sm" style="color: var(--text-secondary);">
					Try clearing the search query or enabling forked sprint repositories.
				</p>
			</div>
		{/if}
	</div>
</section>
