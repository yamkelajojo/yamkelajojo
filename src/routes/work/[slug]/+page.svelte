<script lang="ts">
	import { Accordion } from 'bits-ui';
	import SeoHead from '$lib/components/shared/SeoHead.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { formatIsoDate, getLanguageColor } from '$lib/utils/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
	const githubRepo = $derived(data.githubRepo);
</script>

<SeoHead
	title={project.title}
	description={project.subtitle}
	path={`/work/${project.slug}`}
	imagePath={project.screenshots?.[0]?.imageUrl}
	ogType="article"
/>

<article class="py-12 sm:py-16">
	<div class="editorial-container">
		<!-- Breadcrumb -->
		<nav aria-label="Breadcrumb" class="mb-6">
			<ol
				class="flex flex-wrap items-center gap-2 text-xs"
				style="font-family: var(--font-mono); color: var(--text-muted);"
			>
				<li><a href="/" class="hover:underline">Home</a></li>
				<li aria-hidden="true">/</li>
				<li><a href="/work" class="hover:underline">Work</a></li>
				<li aria-hidden="true">/</li>
				<li aria-current="page" style="color: var(--text-primary);">{project.title}</li>
			</ol>
		</nav>

		<!-- Case Study Header -->
		<header class="border-b pb-10" style="border-color: var(--border-subtle);">
			<div class="flex flex-wrap items-center gap-2">
				<span
					class="rounded px-2.5 py-0.5 text-xs font-medium badge-handson"
					style="font-family: var(--font-mono);"
				>
					{project.contextLabel}
				</span>
				<span class="text-xs" style="font-family: var(--font-mono); color: var(--text-muted);">
					{project.period}
				</span>
				{#each project.categories as category (category)}
					<span
						class="rounded border px-2 py-0.5 text-xs"
						style="font-family: var(--font-mono); border-color: var(--border-subtle); color: var(--text-secondary);"
					>
						{category}
					</span>
				{/each}
			</div>

			<h1
				class="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
				style="color: var(--text-primary);"
			>
				{project.title}
			</h1>

			<p class="mt-4 max-w-3xl text-base leading-relaxed sm:text-lg" style="color: var(--text-secondary);">
				{project.subtitle}
			</p>

			<!-- Role & External Links Bar -->
			<div class="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
				<div>
					<p
						class="text-[11px] uppercase tracking-wider"
						style="font-family: var(--font-mono); color: var(--text-muted);"
					>
						Engineering Role
					</p>
					<p class="mt-0.5 text-sm font-semibold" style="color: var(--text-primary);">
						{project.role}
					</p>
				</div>

				<div class="flex flex-wrap items-center gap-3">
					{#if project.links.github}
						<a
							href={project.links.github}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold"
							style="background-color: var(--accent-primary); color: #ffffff; font-family: var(--font-mono);"
						>
							<Icon name="github" size={15} />
							<span>Open GitHub Repository</span>
							<Icon name="arrow-up-right" size={13} />
						</a>
					{/if}
					{#if project.links.live}
						<a
							href={project.links.live}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold"
							style="border-color: var(--border-strong); color: var(--text-primary); font-family: var(--font-mono);"
						>
							<span>Live Deployment</span>
							<Icon name="arrow-up-right" size={13} />
						</a>
					{/if}
				</div>
			</div>
		</header>

		<!-- Main Case Study Grid (Sections render only when verified information exists — SPECS_PRD Section 18) -->
		<div class="mt-10 grid gap-10 lg:grid-cols-12">
			<div class="space-y-10 lg:col-span-8">
				<!-- Overview -->
				<section aria-labelledby="section-overview">
					<h2 id="section-overview" class="text-xl font-bold" style="color: var(--text-primary);">
						Overview
					</h2>
					<p class="mt-3 text-base leading-relaxed" style="color: var(--text-secondary);">
						{project.overview}
					</p>
				</section>

				<!-- Problem & Approach -->
				<div class="grid gap-6 sm:grid-cols-2">
					<section class="editorial-card p-6" aria-labelledby="section-problem">
						<p class="section-kicker">Problem Statement</p>
						<h2 id="section-problem" class="mt-1 text-lg font-semibold" style="color: var(--text-primary);">
							Why It Needed Solving
						</h2>
						<p class="mt-2.5 text-sm leading-relaxed" style="color: var(--text-secondary);">
							{project.problem}
						</p>
					</section>

					<section class="editorial-card p-6" aria-labelledby="section-approach">
						<p class="section-kicker">Engineering Approach</p>
						<h2 id="section-approach" class="mt-1 text-lg font-semibold" style="color: var(--text-primary);">
							How It Was Built
						</h2>
						<p class="mt-2.5 text-sm leading-relaxed" style="color: var(--text-secondary);">
							{project.approach}
						</p>
					</section>
				</div>

				<!-- Architecture (if present) -->
				{#if project.architecture && project.architecture.length > 0}
					<section aria-labelledby="section-architecture">
						<h2 id="section-architecture" class="text-xl font-bold" style="color: var(--text-primary);">
							System Architecture
						</h2>
						<ul class="mt-4 space-y-3">
							{#each project.architecture as layer (layer)}
								<li class="editorial-card flex items-start gap-3 p-4 text-sm" style="color: var(--text-secondary);">
									<Icon name="layers" size={16} class="mt-0.5" />
									<span>{layer}</span>
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				<!-- Visual Architecture / Schema Diagram (if present) -->
				{#if project.screenshots && project.screenshots.length > 0}
					<section aria-labelledby="section-diagrams">
						<h2 id="section-diagrams" class="text-xl font-bold" style="color: var(--text-primary);">
							Architectural Blueprint
						</h2>
						{#each project.screenshots as artifact (artifact.title)}
							<figure class="editorial-card mt-4 p-6">
								<figcaption>
									<p class="section-kicker">{artifact.diagramType} diagram</p>
									<p class="mt-1 text-base font-semibold" style="color: var(--text-primary);">
										{artifact.title}
									</p>
									<p class="mt-1 text-xs" style="color: var(--text-muted);">{artifact.caption}</p>
								</figcaption>

								{#if artifact.imageUrl}
									<img
										src={artifact.imageUrl}
										alt={artifact.title}
										width="960"
										height="320"
										loading="lazy"
										class="mt-4 w-full rounded border"
										style="border-color: var(--border-subtle);"
									/>
								{/if}

								<div class="mt-5 flex flex-wrap items-center gap-2">
									{#each artifact.nodes as node, idx (node)}
										<div
											class="rounded border px-3 py-2 text-xs font-medium"
											style="font-family: var(--font-mono); border-color: var(--border-strong); background-color: var(--bg-subtle); color: var(--text-primary);"
										>
											{node}
										</div>
										{#if idx < artifact.nodes.length - 1}
											<span style="color: var(--accent-primary); font-family: var(--font-mono);">→</span>
										{/if}
									{/each}
								</div>
							</figure>
						{/each}
					</section>
				{/if}

				<!-- Key Decisions with Bits UI Accordion (if present) -->
				{#if project.keyDecisions && project.keyDecisions.length > 0}
					<section aria-labelledby="section-decisions">
						<h2 id="section-decisions" class="text-xl font-bold" style="color: var(--text-primary);">
							Key Engineering Decisions
						</h2>
						<Accordion.Root type="multiple" value={[project.keyDecisions[0]?.title ?? '']} class="mt-4 space-y-3">
							{#each project.keyDecisions as decision (decision.title)}
								<Accordion.Item value={decision.title} class="editorial-card overflow-hidden">
									<Accordion.Header>
										<Accordion.Trigger
											class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold"
											style="color: var(--text-primary);"
										>
											<span>{decision.title}</span>
											<Icon name="chevron-down" size={16} />
										</Accordion.Trigger>
									</Accordion.Header>
									<Accordion.Content
										class="border-t px-5 py-4 text-sm leading-relaxed"
										style="border-color: var(--border-subtle); color: var(--text-secondary);"
									>
										{decision.rationale}
									</Accordion.Content>
								</Accordion.Item>
							{/each}
						</Accordion.Root>
					</section>
				{/if}

				<!-- Challenges (if present) -->
				{#if project.challenges && project.challenges.length > 0}
					<section aria-labelledby="section-challenges">
						<h2 id="section-challenges" class="text-xl font-bold" style="color: var(--text-primary);">
							Technical Challenges
						</h2>
						<ul class="mt-3 space-y-2.5 text-sm" style="color: var(--text-secondary);">
							{#each project.challenges as challenge (challenge)}
								<li class="flex items-start gap-2.5">
									<span class="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full" style="background-color: var(--accent-primary);"></span>
									<span>{challenge}</span>
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				<!-- Testing (if present) -->
				{#if project.testing && project.testing.length > 0}
					<section aria-labelledby="section-testing">
						<h2 id="section-testing" class="text-xl font-bold" style="color: var(--text-primary);">
							Verification &amp; Testing Strategy
						</h2>
						<ul class="mt-3 space-y-2.5 text-sm" style="color: var(--text-secondary);">
							{#each project.testing as item (item)}
								<li class="flex items-start gap-2.5">
									<Icon name="check" size={15} class="mt-0.5" />
									<span>{item}</span>
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				<!-- Results (if present) -->
				{#if project.results && project.results.length > 0}
					<section aria-labelledby="section-results">
						<h2 id="section-results" class="text-xl font-bold" style="color: var(--text-primary);">
							Verified Outcomes
						</h2>
						<ul class="mt-3 space-y-2.5 text-sm" style="color: var(--text-secondary);">
							{#each project.results as outcome (outcome)}
								<li class="flex items-start gap-2.5">
									<Icon name="check" size={15} class="mt-0.5" />
									<span>{outcome}</span>
								</li>
							{/each}
						</ul>
					</section>
				{/if}
			</div>

			<!-- Right Sidebar: Technology Stack & Live GitHub Repository Metadata -->
			<aside class="space-y-6 lg:col-span-4">
				<div class="editorial-card p-6">
					<h2
						class="text-xs font-semibold uppercase tracking-wider"
						style="font-family: var(--font-mono); color: var(--text-muted);"
					>
						Technology Stack
					</h2>
					<div class="mt-3 flex flex-wrap gap-2">
						{#each project.technologies as tech (tech)}
							<span
								class="rounded border px-2.5 py-1 text-xs font-medium"
								style="font-family: var(--font-mono); border-color: var(--border-subtle); background-color: var(--bg-canvas); color: var(--text-primary);"
							>
								{tech}
							</span>
						{/each}
					</div>
				</div>

				{#if githubRepo}
					<div class="editorial-card p-6">
						<div class="flex items-center justify-between gap-2">
							<h2
								class="text-xs font-semibold uppercase tracking-wider"
								style="font-family: var(--font-mono); color: var(--text-muted);"
							>
								Live GitHub Metadata
							</h2>
							<Icon name="github" size={15} />
						</div>

						<p class="mt-2 font-semibold" style="font-family: var(--font-mono); color: var(--text-primary);">
							{githubRepo.fullName}
						</p>

						<dl class="mt-4 space-y-2.5 border-t pt-3 text-xs" style="border-color: var(--border-subtle); font-family: var(--font-mono);">
							<div class="flex justify-between">
								<dt style="color: var(--text-muted);">Primary Language</dt>
								<dd class="inline-flex items-center gap-1.5" style="color: var(--text-primary);">
									<span
										class="inline-block h-2 w-2 rounded-full"
										style="background-color: {getLanguageColor(githubRepo.language)};"
									></span>
									<span>{githubRepo.language ?? 'Multi-language'}</span>
								</dd>
							</div>
							<div class="flex justify-between">
								<dt style="color: var(--text-muted);">Stars / Forks</dt>
								<dd style="color: var(--text-primary);">{githubRepo.stars} ★ · {githubRepo.forks} forks</dd>
							</div>
							<div class="flex justify-between">
								<dt style="color: var(--text-muted);">Last Pushed</dt>
								<dd style="color: var(--text-primary);">
									{formatIsoDate(githubRepo.pushedAt ?? githubRepo.updatedAt)}
								</dd>
							</div>
						</dl>

						<a
							href={githubRepo.htmlUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="mt-5 flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold"
							style="border-color: var(--border-strong); color: var(--accent-primary); font-family: var(--font-mono);"
						>
							<Icon name="github" size={14} />
							<span>Inspect Repository on GitHub</span>
							<Icon name="arrow-up-right" size={12} />
						</a>
					</div>
				{/if}
			</aside>
		</div>

		<!-- Related Case Studies & Navigation Continuity -->
		{#if data.relatedProjects && data.relatedProjects.length > 0}
			<section
				aria-labelledby="section-related-work"
				class="mt-16 border-t pt-12"
				style="border-color: var(--border-subtle);"
			>
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p class="section-kicker">Continue Exploring</p>
						<h2 id="section-related-work" class="mt-1 text-2xl font-bold" style="color: var(--text-primary);">
							Other Engineering Case Studies
						</h2>
					</div>

					<a
						href="/work"
						class="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
						style="color: var(--accent-primary);"
					>
						<span>Back to All Work</span>
						<Icon name="arrow-right" size={16} />
					</a>
				</div>

				<div class="mt-6 grid gap-6 md:grid-cols-2">
					{#each data.relatedProjects as related (related.slug)}
						<article class="editorial-card flex flex-col justify-between p-5">
							<div>
								<p class="text-xs" style="font-family: var(--font-mono); color: var(--text-muted);">
									{related.contextLabel} · {related.period}
								</p>
								<h3 class="mt-2 text-lg font-semibold" style="color: var(--text-primary);">
									<a href="/work/{related.slug}" class="hover:underline">
										{related.title}
									</a>
								</h3>
								<p class="mt-1.5 text-xs leading-relaxed" style="color: var(--text-secondary);">
									{related.subtitle}
								</p>
							</div>
							<div class="mt-4 pt-3 border-t" style="border-color: var(--border-subtle);">
								<a
									href="/work/{related.slug}"
									class="inline-flex items-center gap-1.5 text-xs font-semibold"
									style="font-family: var(--font-mono); color: var(--accent-primary);"
								>
									<span>Read Case Study</span>
									<Icon name="arrow-right" size={14} />
								</a>
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</article>
