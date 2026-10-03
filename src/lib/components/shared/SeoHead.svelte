<script lang="ts">
	import {
		buildPageSeo,
		buildPersonJsonLd,
		type PageSeoInput
	} from '$lib/utils/seo';

	let {
		title,
		description,
		path,
		imagePath,
		ogType = 'website'
	}: PageSeoInput = $props();

	const seo = $derived(
		buildPageSeo({
			title,
			description,
			path,
			imagePath,
			ogType
		})
	);

	const jsonLdScript = $derived(
		`<script type="application/ld+json">${buildPersonJsonLd()}<` + '/script>'
	);
</script>

<svelte:head>
	<title>{seo.fullTitle}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={seo.canonicalUrl} />
	<meta property="og:title" content={seo.fullTitle} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:url" content={seo.canonicalUrl} />
	<meta property="og:image" content={seo.imageUrl} />
	<meta property="og:type" content={seo.ogType} />
	<meta property="og:site_name" content={seo.siteName} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.fullTitle} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.imageUrl} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdScript}
</svelte:head>
