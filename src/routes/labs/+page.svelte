<script lang="ts">
	import SeoHead from '$lib/components/shared/SeoHead.svelte';
	import ContextBadge from '$lib/components/ui/ContextBadge.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { getLabExperiments } from '$lib/data/projects';
	import { normalizeGitHubRepo } from '$lib/github/normalizer';

	const experiments = getLabExperiments();

	let rawPayloadSample = $state(
		JSON.stringify(
			{
				name: 'greenbidder',
				full_name: 'yamkelajojo/greenbidder',
				description: '   ',
				html_url: 'https://github.com/yamkelajojo/greenbidder',
				homepage: '   ',
				language: 'JavaScript',
				stargazers_count: 3,
				forks_count: -1,
				topics: ['react-native', 'postgis', '  '],
				created_at: '2026-04-10T09:39:24Z',
				updated_at: '2026-05-05T18:28:58Z',
				pushed_at: '2026-09-21T04:34:48Z'
			},
			null,
			2
		)
	);

	const normalizedPreview = $derived.by(() => {
		try {
			const parsed = JSON.parse(rawPayloadSample);
			const result = normalizeGitHubRepo(parsed);
			return {
				ok: true,
				output: JSON.stringify(result, null, 2)
			};
		} catch (err) {
			return {
				ok: false,
				output: `Invalid JSON: ${err instanceof Error ? err.message : 'Parse error'}`
			};
		}
	});
</script>

<SeoHead
	title="Labs & Engineering Notes"
	description="Technical experiments, interactive GitHub normalizer sandbox, and notes across software engineering, data science, and security fundamentals."
	path="/labs"
/>

<section class="border-b py-12 sm:py-16" style="border-color: var(--border-subtle);">
	<div class="editorial-container">
		<p class="section-kicker">/Labs — Technical Explorations</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style="color: var(--text-primary);">
			Engineering Experiments &amp; Technical Notes
		</h1>
		<p class="mt-3 max-w-3xl text-base leading-relaxed" style="color: var(--text-secondary);">
			As specified in our architecture plan, <code>/labs</code> houses technical demonstrations, data-science notes, and security/systems explorations that complement the primary case studies without overloading the main portfolio.
		</p>
	</div>
</section>

<!-- Interactive GitHub Adapter & Normalizer Sandbox -->
<section class="border-b py-14" style="border-color: var(--border-subtle); background-color: var(--bg-subtle);">
	<div class="editorial-container">
		<p class="section-kicker">Interactive Seam Verification</p>
		<h2 class="mt-1 text-2xl font-bold tracking-tight" style="color: var(--text-primary);">
			Live GitHub Normalizer Sandbox
		</h2>
		<p class="mt-2 max-w-2xl text-sm" style="color: var(--text-secondary);">
			Test how <code>normalizeGitHubRepo(raw)</code> handles whitespace-only descriptions, negative star/fork counts, unsafe URLs, or missing fields before any UI component renders them.
		</p>

		<div class="mt-6 grid gap-6 lg:grid-cols-2">
			<div class="editorial-card p-5">
				<label
					for="raw-github-json"
					class="block text-xs font-semibold uppercase tracking-wider"
					style="font-family: var(--font-mono); color: var(--text-muted);"
				>
					Raw Untrusted GitHub API Payload (Editable JSON)
				</label>
				<textarea
					id="raw-github-json"
					rows="14"
					bind:value={rawPayloadSample}
					class="mt-2 w-full rounded border p-3 text-xs"
					style="font-family: var(--font-mono); background-color: var(--bg-canvas); border-color: var(--border-subtle); color: var(--text-primary);"
				></textarea>
			</div>

			<div class="editorial-card p-5">
				<p
					class="text-xs font-semibold uppercase tracking-wider"
					style="font-family: var(--font-mono); color: var(--text-muted);"
				>
					Normalized Domain Output (GitHubRepository | null)
				</p>
				<pre
					class="mt-2 overflow-x-auto rounded border p-3 text-xs leading-relaxed"
					style="font-family: var(--font-mono); background-color: var(--bg-canvas); border-color: var(--border-subtle); color: var(--text-primary);">{normalizedPreview.output}</pre>
			</div>
		</div>
	</div>
</section>

<!-- Structured Lab Notes -->
<section class="py-14">
	<div class="editorial-container">
		<h2 class="text-2xl font-bold tracking-tight" style="color: var(--text-primary);">
			Domain Exploration Notes
		</h2>

		<div class="mt-6 grid gap-6 md:grid-cols-2">
			{#each experiments as lab (lab.id)}
				<article class="editorial-card p-6">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<span
							class="text-xs font-semibold"
							style="font-family: var(--font-mono); color: var(--accent-primary);"
						>
							{lab.domain}
						</span>
						<ContextBadge context={lab.context} />
					</div>

					<h3 class="mt-2.5 text-lg font-bold" style="color: var(--text-primary);">
						{lab.title}
					</h3>
					<p class="mt-2 text-sm leading-relaxed" style="color: var(--text-secondary);">
						{lab.summary}
					</p>

					<ul class="mt-4 space-y-2 text-xs" style="color: var(--text-secondary);">
						{#each lab.technicalNotes as note (note)}
							<li class="flex items-start gap-2">
								<Icon name="terminal" size={13} class="mt-0.5" />
								<span>{note}</span>
							</li>
						{/each}
					</ul>

					<div class="mt-4 flex flex-wrap gap-1.5 border-t pt-3" style="border-color: var(--border-subtle);">
						{#each lab.technologies as tech (tech)}
							<span
								class="rounded border px-2 py-0.5 text-[11px]"
								style="font-family: var(--font-mono); border-color: var(--border-subtle); color: var(--text-muted);"
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
