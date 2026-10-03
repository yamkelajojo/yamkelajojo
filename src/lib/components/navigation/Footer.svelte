<script lang="ts">
	import { getProfile } from '$lib/data/profile';
	import Icon from '$lib/components/ui/Icon.svelte';

	const profile = getProfile();
</script>

<footer
	class="mt-20 border-t py-12"
	style="border-color: var(--border-subtle); background-color: var(--bg-subtle);"
>
	<div class="editorial-container">
		<div class="grid gap-10 md:grid-cols-12">
			<!-- Col 1: Identity & Positioning -->
			<div class="md:col-span-5">
				<div class="flex items-center gap-2.5">
					<span
						class="inline-flex h-7 w-7 items-center justify-center rounded text-xs font-bold"
						style="font-family: var(--font-mono); background-color: var(--text-primary); color: var(--bg-canvas);"
					>
						YJ
					</span>
					<span class="text-base font-semibold" style="color: var(--text-primary);">
						{profile.name}
					</span>
				</div>
				<p class="mt-3 max-w-md text-sm leading-relaxed" style="color: var(--text-secondary);">
					{profile.shortPositioning}
				</p>
				<p
					class="mt-3 inline-flex items-center gap-1.5 text-xs"
					style="font-family: var(--font-mono); color: var(--text-muted);"
				>
					<Icon name="map-pin" size={13} />
					<span>{profile.location}</span>
				</p>
			</div>

			<!-- Col 2: Site Index -->
			<div class="md:col-span-3">
				<h2
					class="text-xs font-semibold uppercase tracking-wider"
					style="font-family: var(--font-mono); color: var(--text-muted);"
				>
					Navigation
				</h2>
				<ul class="mt-3 grid grid-cols-2 gap-2 text-sm">
					<li><a href="/" class="hover:underline" style="color: var(--text-secondary);">Home</a></li>
					<li><a href="/work" class="hover:underline" style="color: var(--text-secondary);">Work</a></li>
					<li><a href="/about" class="hover:underline" style="color: var(--text-secondary);">About</a></li>
					<li>
						<a href="/experience" class="hover:underline" style="color: var(--text-secondary);">
							Experience
						</a>
					</li>
					<li><a href="/github" class="hover:underline" style="color: var(--text-secondary);">GitHub</a></li>
					<li><a href="/cv" class="hover:underline" style="color: var(--text-secondary);">CV</a></li>
					<li><a href="/contact" class="hover:underline" style="color: var(--text-secondary);">Contact</a></li>
					<li><a href="/labs" class="hover:underline" style="color: var(--text-secondary);">Labs</a></li>
				</ul>
			</div>

			<!-- Col 3: Professional Links & Engineering Colophon -->
			<div class="md:col-span-4">
				<h2
					class="text-xs font-semibold uppercase tracking-wider"
					style="font-family: var(--font-mono); color: var(--text-muted);"
				>
					Verified Channels &amp; CV
				</h2>
				<ul class="mt-3 flex flex-col gap-2 text-sm">
					<li>
						<a
							href={profile.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 hover:underline"
							style="color: var(--text-primary);"
						>
							<Icon name="github" size={15} />
							<span>github.com/{profile.githubUsername}</span>
							<Icon name="arrow-up-right" size={13} />
						</a>
					</li>
					<li>
						<a
							href={profile.linkedinUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 hover:underline"
							style="color: var(--text-primary);"
						>
							<Icon name="linkedin" size={15} />
							<span>LinkedIn — Yamkela Jojo</span>
							<Icon name="arrow-up-right" size={13} />
						</a>
					</li>
					<li>
						<a
							href={profile.resumeUrl}
							download="Yamkela-Jojo-CV.pdf"
							class="inline-flex items-center gap-2 font-medium hover:underline"
							style="color: var(--accent-primary);"
						>
							<Icon name="download" size={15} />
							<span>Download Curriculum Vitae (PDF)</span>
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div
			class="mt-10 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center"
			style="border-color: var(--border-subtle); color: var(--text-muted); font-family: var(--font-mono);"
		>
			<p>© {new Date().getUTCFullYear()} {profile.name}. Built with engineering restraint.</p>
			<p>
				SvelteKit · Svelte 5 · TypeScript · Bits UI · Tailwind CSS · Cloudflare Workers (R0 Tier)
			</p>
		</div>
	</div>
</footer>
