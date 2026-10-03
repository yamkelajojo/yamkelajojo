import { getProfile } from '$lib/data/profile';

const DEFAULT_BASE_URL = 'https://yamkelajojo.workers.dev';
const DEFAULT_OG_IMAGE = '/images/og-cover.svg';

export type PageSeoInput = {
	title?: string;
	description: string;
	path: string;
	baseUrl?: string;
	imagePath?: string;
	ogType?: 'website' | 'article' | 'profile';
};

export function buildCanonicalUrl(path: string, baseUrl = DEFAULT_BASE_URL): string {
	const cleanBase = baseUrl.replace(/\/+$/, '');
	const cleanPath = path.startsWith('/') ? path : `/${path}`;
	return `${cleanBase}${cleanPath}`;
}

export function buildPageSeo(input: PageSeoInput) {
	const siteTitle = 'Yamkela Jojo | Full-Stack & Software Developer';
	const fullTitle = input.title ? `${input.title} — ${siteTitle}` : siteTitle;
	const canonicalUrl = buildCanonicalUrl(input.path, input.baseUrl);
	const imageUrl = buildCanonicalUrl(input.imagePath ?? DEFAULT_OG_IMAGE, input.baseUrl);
	const ogType = input.ogType ?? 'website';

	return {
		fullTitle,
		description: input.description,
		canonicalUrl,
		imageUrl,
		ogType,
		siteName: 'Yamkela Jojo — Developer Portfolio'
	};
}

export function buildPersonJsonLd(baseUrl = DEFAULT_BASE_URL): string {
	const profile = getProfile();
	const siteUrl = buildCanonicalUrl('/', baseUrl);

	return JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: profile.name,
		jobTitle: 'Full-Stack & Software Developer',
		description: profile.shortPositioning,
		url: siteUrl,
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Durban',
			addressRegion: 'KwaZulu-Natal',
			addressCountry: 'ZA'
		},
		alumniOf: [
			{
				'@type': 'CollegeOrUniversity',
				name: 'Walter Sisulu University'
			},
			{
				'@type': 'EducationalOrganization',
				name: 'WeThinkCode_'
			},
			{
				'@type': 'EducationalOrganization',
				name: 'ExploreAI Academy'
			}
		],
		worksFor: {
			'@type': 'Organization',
			name: 'CustomConnect'
		},
		sameAs: [profile.githubUrl, profile.linkedinUrl]
	});
}

export function buildSitemapXml(baseUrl: string, projectSlugs: string[]): string {
	const staticRoutes = [
		'/',
		'/work',
		'/about',
		'/experience',
		'/github',
		'/cv',
		'/contact',
		'/labs'
	];
	const projectRoutes = projectSlugs.map((slug) => `/work/${slug}`);
	const allRoutes = [...staticRoutes, ...projectRoutes];

	const urls = allRoutes
		.map((route) => {
			const loc = buildCanonicalUrl(route, baseUrl);
			const priority = route === '/' ? '1.0' : route.startsWith('/work') ? '0.9' : '0.8';
			return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}
