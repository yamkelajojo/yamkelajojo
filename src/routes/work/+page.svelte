<script lang="ts">
	import { Tabs } from 'bits-ui';
	import SeoHead from '$lib/components/shared/SeoHead.svelte';
	import ProjectCard from '$lib/components/projects/ProjectCard.svelte';
	import RepoCard from '$lib/components/github/RepoCard.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedCategory = $state<string>('All');

	const filteredProjects = $derived(
		selectedCategory === 'All'
			? data.featuredProjects
			: data.featuredProjects.filter((project) =>
					project.categories.includes(selectedCategory as never)
				)
	);
</script>

<SeoHead
	title="Work & Case Studies"
	description="Curated software, full-stack web, mobile, and data science case studies by Yamkela Jojo alongside dynamically discovered GitHub repositories."
	path="/work"
/>

<section class="border-b py-12 sm:py-16" style="border-color: var(--border-subtle);">
	<div class="editorial-container">
		<p class="section-kicker">Selected Work &amp; Architecture</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style="color: var(--text-primary);">
			Engineering Case Studies &amp; Repository Index
		</h1>
		<p class="mt-3 max-w-3xl text-base leading-relaxed" style="color: var(--text-secondary);">
			The portfolio separates manually curated engineering case studies—detailing problem framing, architecture, trade-offs, and testing—from automatically discovered public GitHub repositories.
		</p>

		<!-- Internal Commercial Work Callout (CustomConnect) -->
		<div
			class="mt-6 rounded-lg border p-5"
			style="border-color: var(--border-subtle); background-color: var(--bg-subtle);"
		>
			<div class="flex flex-wrap items-center justify-between gap-2">
				<span class="rounded px-2 py-0.5 text-xs font-semibold badge-pro" style="font-family: var(--font-mono);">
					Commercial Production Systems · CustomConnect (May 2024 – Present)
				</span>
				<a
					href="/experience"
					class="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
					style="font-family: var(--font-mono); color: var(--accent-primary);"
				>
					<span>See Professional Experience</span>
					<Icon name="arrow-right" size={13} />
				</a>
			</div>
			<p class="mt-2.5 text-sm leading-relaxed" style="color: var(--text-secondary);">
				At <strong>CustomConnect</strong> (Durban), I build and maintain proprietary internal business platforms using <strong>Laravel, PHP, Vue.js, Tailwind CSS, Bootstrap, and MySQL</strong>—including internal asset ticket logging systems and employee operational dashboards developed in collaboration with the CEO, Data Analysts, and IT leadership. Because those repositories are private company systems, the case studies below showcase verifiable public engineering work.
			</p>
		</div>
	</div>
</section>

<!-- Curated Featured Projects with Bits UI Tabs Filter -->
<section class="border-b py-14" style="border-color: var(--border-subtle);">
	<div class="editorial-container">
		<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
			<h2 class="text-xl font-bold tracking-tight sm:text-2xl" style="color: var(--text-primary);">
				Curated Case Studies ({filteredProjects.length})
			</h2>
		</div>

		<Tabs.Root bind:value={selectedCategory} class="mt-5">
			<Tabs.List
				aria-label="Filter projects by domain"
				class="flex flex-wrap gap-1.5 rounded-lg border p-1.5"
				style="border-color: var(--border-subtle); background-color: var(--bg-subtle);"
			>
				{#each data.categories as category (category)}
					<Tabs.Trigger
						value={category}
						class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
						style={selectedCategory === category
							? 'background-color: var(--accent-primary); color: #ffffff; font-family: var(--font-mono);'
							: 'color: var(--text-secondary); font-family: var(--font-mono);'}
					>
						{category}
					</Tabs.Trigger>
				{/each}
			</Tabs.List>

			<Tabs.Content value={selectedCategory} class="mt-8">
				{#if filteredProjects.length > 0}
					<div class="grid gap-6 md:grid-cols-2">
						{#each filteredProjects as project (project.slug)}
							<ProjectCard {project} />
						{/each}
					</div>
				{:else}
					<div class="editorial-card p-8 text-center">
						<p class="text-sm" style="color: var(--text-secondary);">
							No curated case studies match the <strong>{selectedCategory}</strong> filter yet.
						</p>
						<button
							type="button"
							onclick={() => (selectedCategory = 'All')}
							class="mt-3 rounded-md border px-3 py-1.5 text-xs font-semibold"
							style="border-color: var(--border-strong); color: var(--accent-primary); font-family: var(--font-mono);"
						>
							Reset Filter to All
						</button>
					</div>
				{/if}
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>

<!-- Auto-discovered GitHub Work -->
<section class="py-14">
	<div class="editorial-container">
		<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
			<div>
				<p class="section-kicker">Automatic Repository Discovery</p>
				<h2 class="mt-1 text-2xl font-bold tracking-tight" style="color: var(--text-primary);">
					All Public GitHub Repositories ({data.repositories.length})
				</h2>
				<p class="mt-1 text-sm" style="color: var(--text-secondary);">
					Normalized live metadata from <code>github.com/yamkelajojo</code>.
				</p>
			</div>

			<a
				href="/github"
				class="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
				style="color: var(--accent-primary);"
			>
				<span>Filter &amp; Search on GitHub Page</span>
				<Icon name="arrow-right" size={16} />
			</a>
		</div>

		<div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each data.repositories as repo (repo.name)}
				<RepoCard {repo} />
			{/each}
		</div>
	</div>
</section>
