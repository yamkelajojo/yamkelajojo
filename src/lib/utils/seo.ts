import { getProfile } from '$lib/data/profile';

export const DEFAULT_SITE_ORIGIN = 'https://yamkelajojo-portfolio.yamkelajojo.workers.dev';
const DEFAULT_OG_IMAGE = '/images/og-cover.svg';

export type PageSeoInput = {
	title?: string;
	description: string;
	path: string;
	baseUrl?: string;
	imagePath?: string;
	ogType?: 'website' | 'article' | 'profile';
};

/**
 * Return the configured canonical origin, rejecting path-bearing values and
 * non-HTTPS origins. The request Host header is intentionally never consulted.
 */
export function getSiteOrigin(configuredOrigin = DEFAULT_SITE_ORIGIN): string {
	if (!configuredOrigin?.trim()) return DEFAULT_SITE_ORIGIN;

	try {
		const parsed = new URL(configuredOrigin.trim());
		if (
			parsed.protocol !== 'https:' ||
			parsed.username ||
			parsed.password ||
			parsed.pathname !== '/' ||
			parsed.search ||
			parsed.hash
		) {
			return DEFAULT_SITE_ORIGIN;
		}
		return parsed.origin;
	} catch {
		return DEFAULT_SITE_ORIGIN;
	}
}

export function buildCanonicalUrl(path: string, baseUrl?: string): string {
	const origin = getSiteOrigin(baseUrl);
	const safePath = path.startsWith('/') && !path.startsWith('//') ? path : `/${path.replace(/^\/+/, '')}`;
	const parsed = new URL(safePath, `${origin}/`);

	if (parsed.origin !== origin) return `${origin}/`;
	return `${origin}${parsed.pathname}`;
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

export function buildPersonJsonLd(baseUrl?: string): string {
	const profile = getProfile();
	const siteUrl = buildCanonicalUrl('/', baseUrl);
	const structuredData = {
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
	};

	// Prevent a profile string containing a closing script tag from terminating
	// the JSON-LD script element in the document head.
	return JSON.stringify(structuredData).replace(/[<>&]/g, (character) => {
		const escapes: Record<string, string> = {
			'<': '\\u003c',
			'>': '\\u003e',
			'&': '\\u0026'
		};
		return escapes[character] ?? character;
	});
}

function escapeXml(value: string): string {
	return value.replace(/[<>&"']/g, (character) => {
		const escapes: Record<string, string> = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&apos;'
		};
		return escapes[character] ?? character;
	});
}

export function buildSitemapXml(baseUrl: string | undefined, projectSlugs: string[]): string {
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
			const loc = escapeXml(buildCanonicalUrl(route, baseUrl));
			const priority = route === '/' ? '1.0' : route.startsWith('/work') ? '0.9' : '0.8';
			return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}
