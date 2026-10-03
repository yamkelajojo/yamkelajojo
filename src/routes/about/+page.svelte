<script lang="ts">
	import { Tabs } from 'bits-ui';
	import SeoHead from '$lib/components/shared/SeoHead.svelte';
	import ContextBadge from '$lib/components/ui/ContextBadge.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { getProfile } from '$lib/data/profile';
	import {
		SKILL_CATEGORIES,
		SKILL_CONTEXT_META,
		getAllSkills
	} from '$lib/data/skills';
	import { getPrimaryEducation, getSecondaryEducation } from '$lib/data/education';
	import { formatCertificationBadge, getAllCertifications } from '$lib/data/certifications';
	import type { SkillContext } from '$lib/types';

	const profile = getProfile();
	const allSkills = getAllSkills();
	const primaryEducation = getPrimaryEducation();
	const secondaryEducation = getSecondaryEducation();
	const certifications = getAllCertifications();

	let selectedContext = $state<'all' | SkillContext>('all');

	const contextTabs: { value: 'all' | SkillContext; label: string }[] = [
		{ value: 'all', label: 'All Contexts' },
		{ value: 'professional', label: 'Professional' },
		{ value: 'hands-on', label: 'Hands-on' },
		{ value: 'training', label: 'Academic / Training' },
		{ value: 'exploring', label: 'Exploring' }
	];

	const groupedSkills = $derived(
		SKILL_CATEGORIES.map((category) => ({
			category,
			skills: allSkills.filter(
				(s) =>
					s.category === category &&
					(selectedContext === 'all' || s.context === selectedContext)
			)
		})).filter((group) => group.skills.length > 0)
	);
</script>

<SeoHead
	title="About, Skills & Education"
	description="Yamkela Jojo’s software engineering story, honest technical skill matrix, tertiary education, and certification progression."
	path="/about"
	ogType="profile"
/>

<!-- 1. Narrative Section -->
<section class="border-b py-12 sm:py-16" style="border-color: var(--border-subtle);">
	<div class="editorial-container">
		<div class="grid gap-10 lg:grid-cols-12">
			<div class="lg:col-span-7">
				<p class="section-kicker">Developer Narrative</p>
				<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style="color: var(--text-primary);">
					Software Development at the Core—Broadened by Full-Stack Delivery &amp; Data Science
				</h1>

				<div class="mt-5 space-y-4 text-base leading-relaxed" style="color: var(--text-secondary);">
					<p>
						I am <strong>{profile.name}</strong>, a software and full-stack web developer based in
						<strong>Durban, South Africa</strong>. My path into software engineering began with a formal
						<strong>National Diploma in Information Technology (Applications Development)</strong> at
						Walter Sisulu University, where I built a disciplined foundation in object-oriented programming,
						relational databases, and application design.
					</p>
					<p>
						At <strong>WeThinkCode_</strong>, that foundation was sharpened through peer-reviewed systems
						engineering, networked client/server architecture, and strict
						<strong>Test-Driven Development (TDD)</strong> in Java, Python, Docker, SQLite/JDBC, and
						Flutter/Dart. I later expanded into statistical modelling, NLP, and recommender systems
						through the <strong>ExploreAI Academy Full Stack Data Science Learnership</strong>.
					</p>
					<p>
						Today, as a <strong>Junior Web Developer at CustomConnect</strong>, I apply those engineering
						habits in production—building internal business platforms, asset ticket logging systems, and
						employee dashboards with <strong>Laravel, PHP, Vue.js, Tailwind CSS, Bootstrap, and MySQL</strong>
						alongside executive and technical leadership.
					</p>
				</div>

				<div class="mt-7 flex flex-wrap gap-3">
					<a
						href={profile.resumeUrl}
						download="Yamkela-Jojo-CV.pdf"
						class="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold"
						style="background-color: var(--accent-primary); color: #ffffff;"
					>
						<Icon name="download" size={16} />
						<span>Download CV (PDF)</span>
					</a>
					<a
						href="/experience"
						class="inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold"
						style="border-color: var(--border-strong); color: var(--text-primary);"
					>
						<span>View Experience Timeline</span>
						<Icon name="arrow-right" size={15} />
					</a>
				</div>
			</div>

			<!-- 6-Stage Career Progression Ladder (SPECS_PRD Section 3 & 12) -->
			<aside class="editorial-card p-6 lg:col-span-5" aria-label="Career Progression Architecture">
				<p class="section-kicker">Intentional Progression</p>
				<h2 class="mt-1 text-lg font-semibold" style="color: var(--text-primary);">
					How My Technical Areas Connect
				</h2>
				<ol class="mt-4 space-y-3.5">
					{#each profile.careerProgression as stage (stage.step)}
						<li class="border-l-2 pl-3.5" style="border-color: var(--accent-primary);">
							<div class="flex items-center justify-between gap-2">
								<span class="text-sm font-semibold" style="color: var(--text-primary);">
									{stage.step}. {stage.title}
								</span>
							</div>
							<p class="text-[11px]" style="font-family: var(--font-mono); color: var(--text-muted);">
								{stage.context}
							</p>
							<p class="mt-1 text-xs leading-relaxed" style="color: var(--text-secondary);">
								{stage.summary}
							</p>
						</li>
					{/each}
				</ol>
			</aside>
		</div>
	</div>
</section>

<!-- 2. Technical Skill Matrix with Honest Context Labels (SPECS_PRD Section 10 & 11) -->
<section id="skills" class="border-b py-14" style="border-color: var(--border-subtle); background-color: var(--bg-subtle);">
	<div class="editorial-container">
		<p class="section-kicker">Technical Capability Model</p>
		<h2 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl" style="color: var(--text-primary);">
			Skills Grouped by Area &amp; Provenance
		</h2>
		<p class="mt-2 max-w-3xl text-sm leading-relaxed" style="color: var(--text-secondary);">
			Rather than claiming equal mastery of every tool or inventing arbitrary proficiency percentages, each skill is paired with its honest engineering context and verifiable evidence.
		</p>

		<!-- Context Legend -->
		<div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{#each ['professional', 'hands-on', 'training', 'exploring'] as const as ctx (ctx)}
				{@const meta = SKILL_CONTEXT_META[ctx]}
				<div class="editorial-card p-4">
					<ContextBadge context={ctx} />
					<p class="mt-2 text-xs leading-relaxed" style="color: var(--text-secondary);">
						{meta.description}
					</p>
				</div>
			{/each}
		</div>

		<!-- Bits UI Tabs for Filtering by Skill Context -->
		<Tabs.Root bind:value={selectedContext} class="mt-7">
			<Tabs.List
				aria-label="Filter skills by experience context"
				class="flex flex-wrap gap-1.5 rounded-lg border p-1.5"
				style="border-color: var(--border-subtle); background-color: var(--bg-surface);"
			>
				{#each contextTabs as tab (tab.value)}
					<Tabs.Trigger
						value={tab.value}
						class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
						style={selectedContext === tab.value
							? 'background-color: var(--accent-primary); color: #ffffff; font-family: var(--font-mono);'
							: 'color: var(--text-secondary); font-family: var(--font-mono);'}
					>
						{tab.label}
					</Tabs.Trigger>
				{/each}
			</Tabs.List>

			<Tabs.Content value={selectedContext} class="mt-6">
				<div class="grid gap-6 md:grid-cols-2">
					{#each groupedSkills as group (group.category)}
						<div class="editorial-card p-6">
							<div class="flex items-center justify-between gap-2 border-b pb-3" style="border-color: var(--border-subtle);">
								<h3 class="text-base font-bold" style="color: var(--text-primary);">
									{group.category}
								</h3>
								<span
									class="text-xs"
									style="font-family: var(--font-mono); color: var(--text-muted);"
								>
									{group.skills.length} items
								</span>
							</div>

							{#if group.category === 'Security / Systems'}
								<p
									class="mt-3 rounded border px-3 py-2 text-xs"
									style="border-color: var(--border-subtle); background-color: var(--bg-subtle); color: var(--text-secondary);"
								>
									<strong>Note:</strong> Security and systems tools reflect structured training and lab exploration, not commercial penetration-testing employment.
								</p>
							{/if}

							<ul class="mt-4 divide-y" style="border-color: var(--border-subtle);">
								{#each group.skills as skill (skill.name)}
									<li class="py-2.5 first:pt-0 last:pb-0">
										<div class="flex flex-wrap items-center justify-between gap-2">
											<span class="text-sm font-semibold" style="color: var(--text-primary);">
												{skill.name}
											</span>
											<ContextBadge context={skill.context} />
										</div>
										{#if skill.evidence}
											<p class="mt-1 text-xs leading-relaxed" style="color: var(--text-muted);">
												{skill.evidence}
											</p>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>

<!-- 3. Education & Certification (SPECS_PRD Section 8 & 9) -->
<section class="py-14">
	<div class="editorial-container">
		<div class="grid gap-10 lg:grid-cols-12">
			<!-- Tertiary & Learnership Education -->
			<div class="lg:col-span-8">
				<p class="section-kicker">Academic &amp; NQF Qualifications</p>
				<h2 class="mt-1 text-2xl font-bold tracking-tight" style="color: var(--text-primary);">
					Education
				</h2>

				<div class="mt-6 space-y-5">
					{#each primaryEducation as edu (edu.id)}
						<article class="editorial-card p-6">
							<div class="flex flex-wrap items-center justify-between gap-2">
								<span
									class="rounded px-2 py-0.5 text-xs font-medium badge-pro"
									style="font-family: var(--font-mono);"
								>
									{edu.level}
								</span>
								<span class="text-xs" style="font-family: var(--font-mono); color: var(--text-muted);">
									{edu.periodLabel}
								</span>
							</div>

							<h3 class="mt-3 text-lg font-bold" style="color: var(--text-primary);">
								{edu.qualification}
							</h3>
							<p class="text-sm font-medium" style="color: var(--accent-primary);">
								{edu.institution}
							</p>
							<p class="mt-2 text-sm leading-relaxed" style="color: var(--text-secondary);">
								{edu.summary}
							</p>

							{#if edu.subjects && edu.subjects.length > 0}
								<div class="mt-4 flex flex-wrap gap-1.5">
									{#each edu.subjects as subject (subject)}
										<span
											class="rounded border px-2 py-0.5 text-xs"
											style="font-family: var(--font-mono); border-color: var(--border-subtle); color: var(--text-secondary);"
										>
											{subject}
										</span>
									{/each}
								</div>
							{/if}
						</article>
					{/each}

					<!-- Secondary Education (Visually Subordinate per SPECS_PRD Section 8) -->
					{#each secondaryEducation as sec (sec.id)}
						<div
							class="rounded-md border px-4 py-3 text-xs"
							style="border-color: var(--border-subtle); background-color: var(--bg-subtle); color: var(--text-muted);"
						>
							<span class="font-semibold" style="color: var(--text-secondary);">
								Earlier Secondary Education:
							</span>
							{sec.qualification} — {sec.institution} ({sec.periodLabel})
						</div>
					{/each}
				</div>
			</div>

			<!-- Structured Certification Status Model (SPECS_PRD Section 9) -->
			<aside class="lg:col-span-4" aria-label="Certifications">
				<p class="section-kicker">Credentials</p>
				<h2 class="mt-1 text-2xl font-bold tracking-tight" style="color: var(--text-primary);">
					Certification Status
				</h2>

				<div class="mt-6 space-y-4">
					{#each certifications as cert (cert.id)}
						{@const badge = formatCertificationBadge(cert.status)}
						<article class="editorial-card p-6">
							<div class="flex items-center justify-between gap-2">
								<span
									class="rounded px-2.5 py-0.5 text-xs font-semibold badge-training"
									style="font-family: var(--font-mono);"
								>
									Status: {badge.label}
								</span>
								<Icon name="shield" size={16} />
							</div>

							<h3 class="mt-3 text-lg font-bold" style="color: var(--text-primary);">
								{cert.name}
							</h3>
							<p class="text-xs" style="font-family: var(--font-mono); color: var(--text-muted);">
								Provider: {cert.provider}
							</p>

							<ul class="mt-4 space-y-1.5 text-xs" style="color: var(--text-secondary);">
								{#each cert.focusAreas as area (area)}
									<li class="flex items-start gap-2">
										<span class="mt-1 inline-block h-1.5 w-1.5 rounded-full" style="background-color: var(--accent-primary);"></span>
										<span>{area}</span>
									</li>
								{/each}
							</ul>

							{#if cert.notes}
								<p
									class="mt-4 border-t pt-3 text-xs leading-relaxed"
									style="border-color: var(--border-subtle); color: var(--text-muted);"
								>
									{cert.notes}
								</p>
							{/if}
						</article>
					{/each}
				</div>
			</aside>
		</div>
	</div>
</section>
