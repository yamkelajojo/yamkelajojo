<script lang="ts">
	import { page } from '$app/state';
	import SeoHead from '$lib/components/shared/SeoHead.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
</script>

<SeoHead
	title="Page Not Found"
	description="The requested route could not be found on Yamkela Jojo’s portfolio."
	path={page.url.pathname}
/>

<section class="editorial-container py-section-generous">
	<div class="editorial-card mx-auto max-w-2xl p-8">
		<p class="section-kicker">HTTP {page.status}</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight" style="color: var(--text-primary);">
			{page.status === 404 ? 'Route not found' : 'Something went wrong'}
		</h1>
		<p class="mt-3 text-base leading-relaxed" style="color: var(--text-secondary);">
			{page.error?.message ??
				'The page you requested does not exist or has moved. Use the navigation links below to continue exploring.'}
		</p>

		<div class="mt-6 flex flex-wrap gap-3">
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold"
				style="background-color: var(--accent-primary); color: var(--text-on-accent);"
			>
				<span>Return Home</span>
				<Icon name="arrow-right" size={15} />
			</a>
			<a
				href="/work"
				class="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
				style="border-color: var(--border-subtle); color: var(--text-primary);"
			>
				<span>View Selected Work</span>
			</a>
		</div>
	</div>
</section>
