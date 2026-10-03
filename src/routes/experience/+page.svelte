<script lang="ts">
	import { Tabs } from 'bits-ui';
	import SeoHead from '$lib/components/shared/SeoHead.svelte';
	import ExperienceCard from '$lib/components/experience/ExperienceCard.svelte';
	import ContextBadge from '$lib/components/ui/ContextBadge.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { getAllExperiences } from '$lib/data/experience';
	import type { ExperienceType } from '$lib/types';

	const experiences = getAllExperiences();
	let selectedFilter = $state<'all' | ExperienceType>('all');

	const filteredExperiences = $derived(
		selectedFilter === 'all'
			? experiences
			: experiences.filter((exp) => exp.type === selectedFilter)
	);
</script>

<SeoHead
	title="Experience Timeline"
	description="Yamkela Jojo’s chronological software engineering experience across CustomConnect, ExploreAI Academy, WeThinkCode_, and Nova Smart Technologies."
	path="/experience"
/>

<section class="border-b py-12 sm:py-16" style="border-color: var(--border-subtle);">
	<div class="editorial-container">
		<p class="section-kicker">Chronological Career Record</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style="color: var(--text-primary);">
			Professional Experience &amp; Engineering Training
		</h1>
		<p class="mt-3 max-w-3xl text-base leading-relaxed" style="color: var(--text-secondary);">
			In accordance with our content accuracy model, production software employment is clearly distinguished from structured full-time engineering learnerships and early-career apprenticeship work. Overlapping training and employment dates reflect actual program schedules.
		</p>

		<!-- Context Legend Cards -->
		<div class="mt-6 grid gap-4 sm:grid-cols-3">
			<div class="editorial-card p-4">
				<ContextBadge experienceType="professional" />
				<p class="mt-2 text-xs leading-relaxed" style="color: var(--text-secondary);">
					Commercial full-stack web development delivering internal business systems, asset ticket logging, and employee dashboards at <strong>CustomConnect</strong>.
				</p>
			</div>
			<div class="editorial-card p-4">
				<ContextBadge experienceType="training" />
				<p class="mt-2 text-xs leading-relaxed" style="color: var(--text-secondary);">
					Intensive NQF Level 5 engineering learnerships at <strong>WeThinkCode_</strong> (Software &amp; TDD) and <strong>ExploreAI Academy</strong> (Data Science &amp; ML).
				</p>
			</div>
			<div class="editorial-card p-4">
				<ContextBadge experienceType="apprenticeship" />
				<p class="mt-2 text-xs leading-relaxed" style="color: var(--text-secondary);">
					Early-career practical web design, WordPress, Figma, MySQL, and SEO apprenticeship at <strong>Nova Smart Technologies</strong>.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="py-14">
	<div class="editorial-container">
		<h2 class="sr-only">Experience Timeline Entries</h2>
		<Tabs.Root bind:value={selectedFilter}>
			<div class="flex flex-wrap items-center justify-between gap-4">
				<Tabs.List
					aria-label="Filter experience by category"
					class="flex flex-wrap gap-1.5 rounded-lg border p-1.5"
					style="border-color: var(--border-subtle); background-color: var(--bg-subtle);"
				>
					<Tabs.Trigger
						value="all"
						class="rounded-md px-3 py-1.5 text-xs font-medium"
						style={selectedFilter === 'all'
							? 'background-color: var(--accent-primary); color: #ffffff; font-family: var(--font-mono);'
							: 'color: var(--text-secondary); font-family: var(--font-mono);'}
					>
						All ({experiences.length})
					</Tabs.Trigger>
					<Tabs.Trigger
						value="professional"
						class="rounded-md px-3 py-1.5 text-xs font-medium"
						style={selectedFilter === 'professional'
							? 'background-color: var(--accent-primary); color: #ffffff; font-family: var(--font-mono);'
							: 'color: var(--text-secondary); font-family: var(--font-mono);'}
					>
						Professional Employment (1)
					</Tabs.Trigger>
					<Tabs.Trigger
						value="training"
						class="rounded-md px-3 py-1.5 text-xs font-medium"
						style={selectedFilter === 'training'
							? 'background-color: var(--accent-primary); color: #ffffff; font-family: var(--font-mono);'
							: 'color: var(--text-secondary); font-family: var(--font-mono);'}
					>
						Structured Training (2)
					</Tabs.Trigger>
					<Tabs.Trigger
						value="apprenticeship"
						class="rounded-md px-3 py-1.5 text-xs font-medium"
						style={selectedFilter === 'apprenticeship'
							? 'background-color: var(--accent-primary); color: #ffffff; font-family: var(--font-mono);'
							: 'color: var(--text-secondary); font-family: var(--font-mono);'}
					>
						Apprenticeship (1)
					</Tabs.Trigger>
				</Tabs.List>

				<a
					href="/resume/yamkela-jojo-cv.pdf"
					download="Yamkela-Jojo-CV.pdf"
					class="inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-semibold"
					style="border-color: var(--border-strong); color: var(--text-primary); font-family: var(--font-mono);"
				>
					<Icon name="download" size={14} />
					<span>Download Full CV (PDF)</span>
				</a>
			</div>

			<Tabs.Content value={selectedFilter} class="mt-8 space-y-6">
				{#each filteredExperiences as experience (experience.id)}
					<ExperienceCard {experience} />
				{/each}
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>
