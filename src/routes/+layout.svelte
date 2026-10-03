<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Header from '$lib/components/navigation/Header.svelte';
	import Footer from '$lib/components/navigation/Footer.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const currentPath = $derived(page.url.pathname);
</script>

<a href="#main-content" class="skip-link">Skip to main content</a>

<div class="flex min-h-dvh flex-col">
	<Header {currentPath} />

	<main id="main-content" tabindex="-1" class="flex-1">
		{@render children()}
	</main>

	<Footer />
</div>
