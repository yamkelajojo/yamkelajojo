<script lang="ts">
	import SeoHead from '$lib/components/shared/SeoHead.svelte';
	import ContextBadge from '$lib/components/ui/ContextBadge.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { getProfile } from '$lib/data/profile';
	import { getAllExperiences } from '$lib/data/experience';
	import { getAllEducation } from '$lib/data/education';
	import { SKILL_CATEGORIES, getSkillsByCategory } from '$lib/data/skills';
	import { formatCertificationBadge, getAllCertifications } from '$lib/data/certifications';

	const profile = getProfile();
	const experiences = getAllExperiences();
	const education = getAllEducation();
	const certifications = getAllCertifications();
</script>

<SeoHead
	title="Curriculum Vitae (CV)"
	description="Normalized interactive Curriculum Vitae and downloadable PDF resume for Yamkela Jojo — Full-Stack & Software Developer."
	path="/cv"
/>

<section class="border-b py-10 sm:py-12 no-print" style="border-color: var(--border-subtle);">
	<div class="editorial-container flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<p class="section-kicker">Normalized Curriculum Vitae</p>
			<h1 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl" style="color: var(--text-primary);">
				{profile.name} — Curriculum Vitae
			</h1>
			<p class="mt-1 text-sm" style="color: var(--text-secondary);">
				Available both as a structured web document below and as a standalone PDF download.
			</p>
		</div>

		<div class="flex flex-wrap items-center gap-3">
			<a
				href={profile.resumeUrl}
				download="Yamkela-Jojo-CV.pdf"
				class="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold"
				style="background-color: var(--accent-primary); color: #ffffff;"
			>
				<Icon name="download" size={16} />
				<span>Download CV (PDF)</span>
			</a>
			<button
				type="button"
				onclick={() => window.print()}
				class="inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium"
				style="border-color: var(--border-strong); color: var(--text-primary);"
			>
				<Icon name="file-text" size={16} />
				<span>Print View</span>
			</button>
		</div>
	</div>
</section>

<section class="py-10 sm:py-14">
	<div class="editorial-container">
		<div class="editorial-card mx-auto max-w-4xl p-6 sm:p-10">
			<!-- CV Header -->
			<header class="border-b pb-6" style="border-color: var(--border-subtle);">
				<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
					<div>
						<h2 class="text-2xl font-bold tracking-tight sm:text-3xl" style="color: var(--text-primary);">
							{profile.name}
						</h2>
						<p class="mt-1 text-base font-medium" style="color: var(--accent-primary);">
							Full-Stack &amp; Software Developer
						</p>
						<p class="mt-1 text-xs" style="font-family: var(--font-mono); color: var(--text-muted);">
							{profile.location}
						</p>
					</div>

					<ul class="space-y-1 text-xs" style="font-family: var(--font-mono); color: var(--text-secondary);">
						<li>
							GitHub:
							<a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" class="underline">
								github.com/{profile.githubUsername}
							</a>
						</li>
						<li>
							LinkedIn:
							<a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" class="underline">
								linkedin.com/in/yamkela-jojo-911774217
							</a>
						</li>
					</ul>
				</div>

				<p class="mt-4 text-sm leading-relaxed" style="color: var(--text-secondary);">
					{profile.summary}
				</p>
			</header>

			<!-- Experience Section -->
			<section class="mt-8 border-b pb-8" style="border-color: var(--border-subtle);" aria-labelledby="cv-experience">
				<h3
					id="cv-experience"
					class="text-xs font-bold uppercase tracking-wider"
					style="font-family: var(--font-mono); color: var(--accent-primary);"
				>
					Professional &amp; Engineering Training Experience
				</h3>

				<div class="mt-5 space-y-6">
					{#each experiences as exp (exp.id)}
						<div>
							<div class="flex flex-wrap items-center justify-between gap-2">
								<h4 class="text-base font-bold" style="color: var(--text-primary);">
									{exp.role} · <span style="color: var(--text-secondary);">{exp.company}</span>
								</h4>
								<div class="flex items-center gap-2">
									<ContextBadge experienceType={exp.type} />
									<span class="text-xs" style="font-family: var(--font-mono); color: var(--text-muted);">
										{exp.periodLabel}
									</span>
								</div>
							</div>

							<ul class="mt-2.5 space-y-1.5 text-sm" style="color: var(--text-secondary);">
								{#each exp.highlights as highlight (highlight)}
									<li class="flex items-start gap-2">
										<span class="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full" style="background-color: var(--accent-primary);"></span>
										<span>{highlight}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</section>

			<!-- Education & Certifications -->
			<section class="mt-8 border-b pb-8" style="border-color: var(--border-subtle);" aria-labelledby="cv-education">
				<h3
					id="cv-education"
					class="text-xs font-bold uppercase tracking-wider"
					style="font-family: var(--font-mono); color: var(--accent-primary);"
				>
					Education &amp; Certification
				</h3>

				<div class="mt-4 space-y-4">
					{#each education as edu (edu.id)}
						<div class="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
							<div>
								<p class="text-sm font-bold" style="color: var(--text-primary);">
									{edu.qualification}
								</p>
								<p class="text-xs" style="color: var(--text-secondary);">
									{edu.institution}
								</p>
							</div>
							<span class="text-xs" style="font-family: var(--font-mono); color: var(--text-muted);">
								{edu.periodLabel}
							</span>
						</div>
					{/each}

					{#each certifications as cert (cert.id)}
						{@const badge = formatCertificationBadge(cert.status)}
						<div class="flex flex-col justify-between gap-1 pt-2 sm:flex-row sm:items-baseline">
							<div>
								<p class="text-sm font-bold" style="color: var(--text-primary);">
									Certification: {cert.name} ({cert.provider})
								</p>
							</div>
							<span class="rounded px-2 py-0.5 text-xs font-semibold badge-training" style="font-family: var(--font-mono);">
								{badge.label}
							</span>
						</div>
					{/each}
				</div>
			</section>

			<!-- Technical Skills -->
			<section class="mt-8" aria-labelledby="cv-skills">
				<h3
					id="cv-skills"
					class="text-xs font-bold uppercase tracking-wider"
					style="font-family: var(--font-mono); color: var(--accent-primary);"
				>
					Technical Capabilities by Domain
				</h3>

				<div class="mt-4 grid gap-4 sm:grid-cols-2">
					{#each SKILL_CATEGORIES as category (category)}
						<div>
							<h4 class="text-xs font-semibold" style="color: var(--text-primary);">
								{category}
							</h4>
							<p class="mt-1 text-xs leading-relaxed" style="color: var(--text-secondary);">
								{getSkillsByCategory(category)
									.map((s) => s.name)
									.join(' · ')}
							</p>
						</div>
					{/each}
				</div>
			</section>
		</div>
	</div>
</section>
