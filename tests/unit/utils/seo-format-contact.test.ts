import { describe, expect, it } from 'vitest';
import {
	buildCanonicalUrl,
	buildPageSeo,
	buildPersonJsonLd,
	buildSitemapXml
} from '$lib/utils/seo';
import { formatIsoDate, getLanguageColor } from '$lib/utils/format';
import { sanitizeText, validateContactSubmission } from '$lib/utils/contact';

describe('SEO-001, SEC-001 & Formatting utilities', () => {
	it('builds canonical URLs, Open Graph image URLs, and structured page SEO metadata', () => {
		expect(
			buildCanonicalUrl('/work/greenbidder-marketplace', 'https://yamkelajojo.workers.dev/')
		).toBe('https://yamkelajojo.workers.dev/work/greenbidder-marketplace');
		expect(buildCanonicalUrl('work', 'https://yamkelajojo.workers.dev')).toBe(
			'https://yamkelajojo.workers.dev/work'
		);
		expect(buildCanonicalUrl('/', 'https://yamkelajojo.workers.dev')).toBe(
			'https://yamkelajojo.workers.dev/'
		);

		const seo = buildPageSeo({
			title: 'Selected Work',
			description: 'Case studies and engineering projects by Yamkela Jojo.',
			path: '/work'
		});
		expect(seo.fullTitle).toBe('Selected Work — Yamkela Jojo | Full-Stack & Software Developer');
		expect(seo.canonicalUrl).toBe('https://yamkelajojo.workers.dev/work');
		expect(seo.imageUrl).toBe('https://yamkelajojo.workers.dev/images/og-cover.svg');
		expect(seo.ogType).toBe('website');

		const customImageSeo = buildPageSeo({
			description: 'Home description',
			path: '/',
			imagePath: '/images/projects/portfolio-architecture.svg'
		});
		expect(customImageSeo.fullTitle).toBe('Yamkela Jojo | Full-Stack & Software Developer');
		expect(customImageSeo.imageUrl).toBe(
			'https://yamkelajojo.workers.dev/images/projects/portfolio-architecture.svg'
		);
	});

	it('builds valid schema.org Person and WebSite JSON-LD structured data', () => {
		const jsonLd = buildPersonJsonLd('https://yamkelajojo.workers.dev');
		const parsed = JSON.parse(jsonLd);
		expect(parsed['@context']).toBe('https://schema.org');
		expect(parsed['@type']).toBe('Person');
		expect(parsed.name).toBe('Yamkela Jojo');
		expect(parsed.sameAs).toContain('https://github.com/yamkelajojo');
		expect(parsed.sameAs).toContain('https://www.linkedin.com/in/yamkela-jojo-911774217');
	});

	it('generates valid sitemap XML containing all primary routes and project case studies', () => {
		const xml = buildSitemapXml('https://yamkelajojo.workers.dev', [
			'engineering-portfolio',
			'greenbidder-marketplace'
		]);
		expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(xml).toContain('<loc>https://yamkelajojo.workers.dev/</loc>');
		expect(xml).toContain('<loc>https://yamkelajojo.workers.dev/work/greenbidder-marketplace</loc>');
		expect(xml).toContain('<loc>https://yamkelajojo.workers.dev/github</loc>');
	});

	it('formats ISO dates safely and maps programming languages to design colors', () => {
		expect(formatIsoDate('2026-09-21T04:34:48Z')).toContain('2026');
		expect(formatIsoDate(null)).toBe('Unknown');
		expect(formatIsoDate('invalid-date')).toBe('Unknown');

		expect(getLanguageColor('TypeScript')).toMatch(/^#/);
		expect(getLanguageColor('PHP')).toMatch(/^#/);
		expect(getLanguageColor(null)).toBe('#6e6a63');
		expect(getLanguageColor('UnlistedLang')).toBe('#6e6a63');
	});

	it('sanitizes control/HTML characters and validates contact submissions across all boundary conditions', () => {
		expect(sanitizeText(null)).toBe('');
		expect(sanitizeText('  <script>alert(1)</script>\u0007 Hello  ')).toBe('alert(1) Hello');

		const invalidShort = validateContactSubmission({
			name: 'A',
			email: 'not-an-email',
			subject: '',
			message: 'Too short'
		});
		expect(invalidShort.valid).toBe(false);
		expect(invalidShort.errors.name).toBeDefined();
		expect(invalidShort.errors.email).toBeDefined();
		expect(invalidShort.errors.subject).toBeDefined();
		expect(invalidShort.errors.message).toBeDefined();

		const invalidLong = validateContactSubmission({
			name: 'N'.repeat(90),
			email: `${'e'.repeat(120)}@example.com`,
			subject: 'S'.repeat(130),
			message: 'M'.repeat(2100)
		});
		expect(invalidLong.valid).toBe(false);
		expect(invalidLong.errors.name).toBeDefined();
		expect(invalidLong.errors.email).toBeDefined();
		expect(invalidLong.errors.subject).toBeDefined();
		expect(invalidLong.errors.message).toBeDefined();

		const valid = validateContactSubmission({
			name: 'Sipho Ndlovu',
			email: 'SIPHO@example.co.za',
			subject: 'Full-Stack Engineering Opportunity',
			message:
				'Hi Yamkela, we reviewed your Laravel and SvelteKit portfolio and would like to connect.'
		});
		expect(valid.valid).toBe(true);
		expect(valid.sanitized?.email).toBe('sipho@example.co.za');
	});
});
