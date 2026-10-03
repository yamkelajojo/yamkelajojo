<script lang="ts">
	import type { Experience } from '$lib/types';
	import ContextBadge from '$lib/components/ui/ContextBadge.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { experience }: { experience: Experience } = $props();
</script>

<article class="editorial-card p-6">
	<div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
		<div>
			<div class="flex flex-wrap items-center gap-2">
				<ContextBadge experienceType={experience.type} />
				<span
					class="text-xs font-medium"
					style="font-family: var(--font-mono); color: var(--text-muted);"
				>
					{experience.periodLabel}
				</span>
				{#if experience.location}
					<span
						class="inline-flex items-center gap-1 text-xs"
						style="font-family: var(--font-mono); color: var(--text-muted);"
					>
						<Icon name="map-pin" size={12} />
						<span>{experience.location}</span>
					</span>
				{/if}
			</div>

			<h3 class="mt-2.5 text-xl font-semibold tracking-tight" style="color: var(--text-primary);">
				{experience.role}
				<span class="font-normal" style="color: var(--text-secondary);">
					— {experience.company}
				</span>
			</h3>
		</div>
	</div>

	<p class="mt-3 text-sm leading-relaxed" style="color: var(--text-secondary);">
		{experience.description}
	</p>

	<!-- Key Highlights -->
	<ul class="mt-4 space-y-2 text-sm" style="color: var(--text-secondary);">
		{#each experience.highlights as item (item)}
			<li class="flex items-start gap-2.5">
				<span
					class="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
					style="background-color: var(--accent-primary);"
				></span>
				<span>{item}</span>
			</li>
		{/each}
	</ul>

	<!-- Technologies -->
	<div class="mt-5 border-t pt-4" style="border-color: var(--border-subtle);">
		<p
			class="text-[11px] uppercase tracking-wider"
			style="font-family: var(--font-mono); color: var(--text-muted);"
		>
			Technologies &amp; Practices Applied
		</p>
		<div class="mt-2 flex flex-wrap gap-1.5">
			{#each experience.technologies as tech (tech)}
				<span
					class="rounded border px-2 py-0.5 text-xs"
					style="font-family: var(--font-mono); border-color: var(--border-subtle); background-color: var(--bg-canvas); color: var(--text-primary);"
				>
					{tech}
				</span>
			{/each}
		</div>
	</div>
</article>
