<script lang="ts">
	import type { EnrichedFeaturedProject } from '$lib/data/projects';
	import { formatIsoDate, getLanguageColor } from '$lib/utils/format';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { project }: { project: EnrichedFeaturedProject } = $props();

	const contextBadgeClass = $derived(
		project.context === 'professional'
			? 'badge-pro'
			: project.context === 'training'
				? 'badge-training'
				: 'badge-handson'
	);
</script>

<article class="editorial-card flex h-full flex-col justify-between p-6">
	<div>
		<!-- Top Metadata Bar -->
		<div class="flex flex-wrap items-center justify-between gap-2">
			<span
				class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium {contextBadgeClass}"
				style="font-family: var(--font-mono);"
			>
				{project.contextLabel}
			</span>
			<span
				class="text-xs"
				style="font-family: var(--font-mono); color: var(--text-muted);"
			>
				{project.period}
			</span>
		</div>

		<!-- Title & Subtitle -->
		<h3 class="mt-3 text-xl font-semibold tracking-tight" style="color: var(--text-primary);">
			<a href="/work/{project.slug}" class="hover:underline">
				{project.title}
			</a>
		</h3>

		<p class="mt-2 text-sm leading-relaxed" style="color: var(--text-secondary);">
			{project.subtitle}
		</p>

		<!-- Domain Categories -->
		<div class="mt-4 flex flex-wrap gap-1.5" aria-label="Project categories">
			{#each project.categories as category (category)}
				<span
					class="rounded border px-2 py-0.5 text-[11px] font-medium"
					style="font-family: var(--font-mono); border-color: var(--border-subtle); background-color: var(--bg-subtle); color: var(--text-secondary);"
				>
					{category}
				</span>
			{/each}
		</div>

		<!-- Technologies -->
		<div class="mt-4 border-t pt-4" style="border-color: var(--border-subtle);">
			<p
				class="text-[11px] uppercase tracking-wider"
				style="font-family: var(--font-mono); color: var(--text-muted);"
			>
				Core Stack
			</p>
			<div class="mt-2 flex flex-wrap gap-1.5">
				{#each project.technologies.slice(0, 7) as tech (tech)}
					<span
						class="rounded px-2 py-0.5 text-xs"
						style="background-color: var(--bg-canvas); border: 1px solid var(--border-subtle); color: var(--text-primary);"
					>
						{tech}
					</span>
				{/each}
			</div>
		</div>
	</div>

	<!-- Bottom Live GitHub Telemetry & Action Links -->
	<div class="mt-6 border-t pt-4" style="border-color: var(--border-subtle);">
		{#if project.githubRepo}
			<div
				class="mb-3 flex flex-wrap items-center justify-between gap-2 rounded px-2.5 py-1.5 text-xs"
				style="background-color: var(--bg-subtle); font-family: var(--font-mono); color: var(--text-secondary);"
			>
				<span class="inline-flex items-center gap-1.5">
					<Icon name="github" size={13} />
					<span>{project.githubRepo.name}</span>
				</span>
				<span class="inline-flex items-center gap-3">
					{#if project.githubRepo.language}
						<span class="inline-flex items-center gap-1">
							<span
								class="inline-block h-2 w-2 rounded-full"
								style="background-color: {getLanguageColor(project.githubRepo.language)};"
							></span>
							<span>{project.githubRepo.language}</span>
						</span>
					{/if}
					<span class="inline-flex items-center gap-1" title="Stars">
						<Icon name="star" size={12} />
						<span>{project.githubRepo.stars}</span>
					</span>
					<span class="text-[11px]" style="color: var(--text-muted);">
						Updated {formatIsoDate(project.githubRepo.pushedAt ?? project.githubRepo.updatedAt)}
					</span>
				</span>
			</div>
		{/if}

		<div class="flex flex-wrap items-center justify-between gap-3">
			<a
				href="/work/{project.slug}"
				class="inline-flex items-center gap-1.5 text-sm font-semibold"
				style="color: var(--accent-primary);"
			>
				<span>Read Engineering Case Study</span>
				<Icon name="arrow-right" size={15} />
			</a>

			{#if project.links.github}
				<a
					href={project.links.github}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-medium"
					style="border-color: var(--border-subtle); color: var(--text-secondary); font-family: var(--font-mono);"
					aria-label="Open {project.title} repository on GitHub"
				>
					<Icon name="github" size={13} />
					<span>Source</span>
					<Icon name="arrow-up-right" size={12} />
				</a>
			{/if}
		</div>
	</div>
</article>
