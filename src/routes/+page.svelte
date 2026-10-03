<script lang="ts">
	import SeoHead from '$lib/components/shared/SeoHead.svelte';
	import ProjectCard from '$lib/components/projects/ProjectCard.svelte';
	import RepoCard from '$lib/components/github/RepoCard.svelte';
	import ContextBadge from '$lib/components/ui/ContextBadge.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SeoHead
	description={data.profile.shortPositioning}
	path="/"
/>

<!-- 1. Hero Section -->
<section class="border-b py-14 sm:py-20" style="border-color: var(--border-subtle);">
	<div class="editorial-container">
		<div class="grid items-start gap-10 lg:grid-cols-12">
			<div class="lg:col-span-8">
				<div class="inline-flex flex-wrap items-center gap-2 rounded-full border px-3 py-1 text-xs" style="border-color: var(--border-subtle); background-color: var(--bg-surface); font-family: var(--font-mono); color: var(--text-secondary);">
					<span class="inline-block h-2 w-2 rounded-full" style="background-color: #1f6f54;"></span>
					<span>{data.profile.availabilityNote}</span>
				</div>

				<h1
					class="mt-5 text-3xl font-bold tracking-tight sm:text-5xl lg:text-[3.35rem] lg:leading-[1.12]"
					style="color: var(--text-primary);"
				>
					{data.profile.name} —
					<span style="font-family: var(--font-display); font-weight: 400; color: var(--accent-primary);">
						Software &amp; Full-Stack Developer
					</span>
				</h1>

				<p class="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg" style="color: var(--text-secondary);">
					{data.profile.shortPositioning}
				</p>

				<p class="mt-3 max-w-2xl text-sm leading-relaxed" style="color: var(--text-muted);">
					{data.profile.summary}
				</p>

				<div class="mt-8 flex flex-wrap items-center gap-3">
					<a
						href="/work"
						class="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors"
						style="background-color: var(--accent-primary); color: #ffffff;"
					>
						<span>Explore Selected Work</span>
						<Icon name="arrow-right" size={16} />
					</a>

					<a
						href={data.profile.resumeUrl}
						download="Yamkela-Jojo-CV.pdf"
						class="inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors"
						style="border-color: var(--border-strong); background-color: var(--bg-surface); color: var(--text-primary);"
					>
						<Icon name="download" size={16} />
						<span>Download CV (PDF)</span>
					</a>

					<a
						href={data.profile.githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors"
						style="border-color: var(--border-subtle); color: var(--text-secondary); font-family: var(--font-mono);"
					>
						<Icon name="github" size={16} />
						<span>github.com/{data.profile.githubUsername}</span>
						<Icon name="arrow-up-right" size={14} />
					</a>
				</div>
			</div>

			<!-- Right Column: Architectural Positioning Card (SPECS_PRD Section 63 & 64) -->
			<aside class="editorial-card p-6 lg:col-span-4" aria-label="Developer Positioning">
				<p class="section-kicker">Engineering Profile</p>
				<h2 class="mt-1.5 text-lg font-semibold" style="color: var(--text-primary);">
					Three Questions, Answered Clearly
				</h2>

				<dl class="mt-4 space-y-4 text-sm">
					<div class="border-t pt-3" style="border-color: var(--border-subtle);">
						<dt class="font-semibold" style="color: var(--text-primary);">
							1. Who is this developer?
						</dt>
						<dd class="mt-1 leading-relaxed" style="color: var(--text-secondary);">
							A software developer with production full-stack web experience at CustomConnect (Laravel, PHP, Vue.js, MySQL) and formal systems &amp; data science training.
						</dd>
					</div>

					<div class="border-t pt-3" style="border-color: var(--border-subtle);">
						<dt class="font-semibold" style="color: var(--text-primary);">
							2. What has been built?
						</dt>
						<dd class="mt-1 leading-relaxed" style="color: var(--text-secondary);">
							Internal business platforms, asset ticket logging systems, employee dashboards, a PostGIS agricultural marketplace, Laravel/Inertia apps, and ML pipelines.
						</dd>
					</div>

					<div class="border-t pt-3" style="border-color: var(--border-subtle);">
						<dt class="font-semibold" style="color: var(--text-primary);">
							3. How is software built here?
						</dt>
						<dd class="mt-1 leading-relaxed" style="color: var(--text-secondary);">
							Through Test-Driven Development (TDD), normalized domain boundaries, accessible Bits UI primitives, and resilient Cloudflare Workers architecture.
						</dd>
					</div>
				</dl>
			</aside>
		</div>
	</div>
</section>

<!-- 2. Selected Work (Featured Projects) -->
<section class="border-b py-16" style="border-color: var(--border-subtle);">
	<div class="editorial-container">
		<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
			<div>
				<p class="section-kicker">01 / Selected Work</p>
				<h2 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl" style="color: var(--text-primary);">
					Curated Engineering Case Studies
				</h2>
				<p class="mt-2 max-w-2xl text-sm" style="color: var(--text-secondary);">
					Each project pairs architectural decisions and domain modelling with live repository metadata retrieved from GitHub.
				</p>
			</div>

			<a
				href="/work"
				class="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
				style="color: var(--accent-primary);"
			>
				<span>View All Case Studies &amp; Work</span>
				<Icon name="arrow-right" size={16} />
			</a>
		</div>

		<div class="mt-8 grid gap-6 md:grid-cols-2">
			{#each data.featuredProjects as project (project.slug)}
				<ProjectCard {project} />
			{/each}
		</div>
	</div>
</section>

<!-- 3. Technical Areas & Honest Skill Context -->
<section class="border-b py-16" style="border-color: var(--border-subtle); background-color: var(--bg-subtle);">
	<div class="editorial-container">
		<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
			<div>
				<p class="section-kicker">02 / Technical Architecture</p>
				<h2 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl" style="color: var(--text-primary);">
					Capabilities Grouped by Domain &amp; Context
				</h2>
				<p class="mt-2 max-w-2xl text-sm" style="color: var(--text-secondary);">
					No arbitrary percentage bars. Every capability is tagged with its real provenance:
					<strong>Professional</strong>, <strong>Hands-on</strong>, <strong>Academic / Training</strong>, or <strong>Exploring</strong>.
				</p>
			</div>

			<a
				href="/about#skills"
				class="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
				style="color: var(--accent-primary);"
			>
				<span>Inspect Full Skill Matrix</span>
				<Icon name="arrow-right" size={16} />
			</a>
		</div>

		<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each data.technicalAreas as area (area.category)}
				<div class="editorial-card p-5">
					<h3
						class="text-xs font-semibold uppercase tracking-wider"
						style="font-family: var(--font-mono); color: var(--accent-primary);"
					>
						{area.category}
					</h3>
					<ul class="mt-3.5 space-y-2">
						{#each area.skills as skill (skill.name)}
							<li class="flex items-center justify-between gap-2 text-sm">
								<span class="font-medium" style="color: var(--text-primary);">{skill.name}</span>
								<ContextBadge context={skill.context} compact />
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- 4. Experience Snapshot -->
<section class="border-b py-16" style="border-color: var(--border-subtle);">
	<div class="editorial-container">
		<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
			<div>
				<p class="section-kicker">03 / Career Progression</p>
				<h2 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl" style="color: var(--text-primary);">
					Experience &amp; Engineering Training Snapshot
				</h2>
				<p class="mt-2 max-w-2xl text-sm" style="color: var(--text-secondary);">
					A clear distinction between production software employment, structured full-time engineering learnerships, and early apprenticeship work.
				</p>
			</div>

			<a
				href="/experience"
				class="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
				style="color: var(--accent-primary);"
			>
				<span>Full Experience Timeline</span>
				<Icon name="arrow-right" size={16} />
			</a>
		</div>

		<div class="mt-8 grid gap-5 md:grid-cols-2">
			{#each data.experiences as exp (exp.id)}
				<article class="editorial-card p-5">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<ContextBadge experienceType={exp.type} />
						<span class="text-xs" style="font-family: var(--font-mono); color: var(--text-muted);">
							{exp.periodLabel}
						</span>
					</div>
					<h3 class="mt-3 text-lg font-semibold" style="color: var(--text-primary);">
						{exp.role} · <span style="color: var(--text-secondary);">{exp.company}</span>
					</h3>
					<p class="mt-2 text-sm leading-relaxed" style="color: var(--text-secondary);">
						{exp.description}
					</p>
					<div class="mt-4 flex flex-wrap gap-1.5">
						{#each exp.technologies.slice(0, 6) as tech (tech)}
							<span
								class="rounded border px-2 py-0.5 text-[11px]"
								style="font-family: var(--font-mono); border-color: var(--border-subtle); color: var(--text-secondary);"
							>
								{tech}
							</span>
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- 5. GitHub Activity / Repository Pulse -->
<section class="border-b py-16" style="border-color: var(--border-subtle);">
	<div class="editorial-container">
		<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
			<div>
				<p class="section-kicker">04 / Live GitHub Integration</p>
				<h2 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl" style="color: var(--text-primary);">
					Public Repositories ({data.githubMeta.totalRepos})
				</h2>
				<p class="mt-2 max-w-2xl text-sm" style="color: var(--text-secondary);">
					Automatically retrieved and normalized from <code>github.com/yamkelajojo</code> via our server-side adapter and cache boundary.
				</p>
			</div>

			<a
				href="/github"
				class="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
				style="color: var(--accent-primary);"
			>
				<span>Open GitHub Explorer</span>
				<Icon name="arrow-right" size={16} />
			</a>
		</div>

		<div class="mt-8 grid gap-5 md:grid-cols-2">
			{#each data.recentRepos as repo (repo.name)}
				<RepoCard {repo} />
			{/each}
		</div>
	</div>
</section>

<!-- 6. Call to Action -->
<section class="py-16">
	<div class="editorial-container">
		<div class="editorial-card flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
			<div>
				<p class="section-kicker">05 / Next Step</p>
				<h2 class="mt-1 text-2xl font-bold tracking-tight" style="color: var(--text-primary);">
					Looking for a disciplined Full-Stack or Software Developer?
				</h2>
				<p class="mt-2 max-w-xl text-sm leading-relaxed" style="color: var(--text-secondary);">
					Review the interactive CV, download the print-ready PDF, or reach out directly via LinkedIn, GitHub, or the contact page.
				</p>
			</div>

			<div class="flex flex-wrap gap-3">
				<a
					href="/contact"
					class="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold"
					style="background-color: var(--accent-primary); color: #ffffff;"
				>
					<span>Contact Yamkela</span>
					<Icon name="arrow-right" size={16} />
				</a>
				<a
					href="/cv"
					class="inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold"
					style="border-color: var(--border-strong); color: var(--text-primary);"
				>
					<Icon name="file-text" size={16} />
					<span>Inspect Full CV</span>
				</a>
			</div>
		</div>
	</div>
</section>
