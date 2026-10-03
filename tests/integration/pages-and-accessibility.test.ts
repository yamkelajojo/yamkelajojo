import { describe, expect, it } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import axe from 'axe-core';
import Header from '$lib/components/navigation/Header.svelte';
import Footer from '$lib/components/navigation/Footer.svelte';
import HomePage from '../../src/routes/+page.svelte';
import WorkPage from '../../src/routes/work/+page.svelte';
import CaseStudyPage from '../../src/routes/work/[slug]/+page.svelte';
import AboutPage from '../../src/routes/about/+page.svelte';
import ExperiencePage from '../../src/routes/experience/+page.svelte';
import GitHubPage from '../../src/routes/github/+page.svelte';
import CvPage from '../../src/routes/cv/+page.svelte';
import ContactPage from '../../src/routes/contact/+page.svelte';
import LabsPage from '../../src/routes/labs/+page.svelte';
import { getProfile } from '$lib/data/profile';
import { getAllExperiences } from '$lib/data/experience';
import {
	PROJECT_CATEGORIES,
	enrichProjectsWithGitHub,
	getFeaturedProjectBySlug,
	getFeaturedProjects
} from '$lib/data/projects';
import { SKILL_CATEGORIES, getSkillsByCategory } from '$lib/data/skills';
import { getFallbackRepositories } from '$lib/github/fallback';
import { extractAvailableLanguages } from '$lib/github/normalizer';

async function expectNoAxeViolations(container: HTMLElement) {
	const results = await axe.run(container, {
		rules: {
			// jsdom does not compute canvas pixel contrast; color tokens are verified separately
			'color-contrast': { enabled: false },
			region: { enabled: false }
		}
	});
	expect(results.violations).toEqual([]);
}

describe('Integration & Accessibility — Rendered Pages, Bits UI Interactions & Acceptance Criteria (AT-001..AT-010)', () => {
	const profile = getProfile();
	const experiences = getAllExperiences();
	const repos = getFallbackRepositories();
	const enrichedProjects = enrichProjectsWithGitHub(getFeaturedProjects(), repos);

	it('AT-001 — Renders Header, Footer, and Homepage with immediate identity, positioning, work, and zero axe violations', async () => {
		const { container: headerContainer, getByLabelText } = render(Header, {
			props: { currentPath: '/' }
		});
		expect(getByLabelText('Yamkela Jojo — Home')).toBeInTheDocument();
		await expectNoAxeViolations(headerContainer);

		const { container: homeContainer, getByRole, getAllByText } = render(HomePage, {
			props: {
				data: {
					profile,
					experiences,
					featuredProjects: enrichedProjects.slice(0, 4),
					recentRepos: repos.slice(0, 4),
					githubMeta: {
						source: 'live',
						fetchedAt: '2026-10-03T07:13:14Z',
						isStale: false,
						totalRepos: repos.length
					},
					technicalAreas: SKILL_CATEGORIES.map((category) => ({
						category,
						skills: getSkillsByCategory(category).slice(0, 5)
					}))
				}
			}
		});

		expect(getByRole('heading', { level: 1 })).toHaveTextContent(/Yamkela Jojo/i);
		expect(getAllByText(/CustomConnect/i).length).toBeGreaterThan(0);
		await expectNoAxeViolations(homeContainer);

		const { container: footerContainer } = render(Footer);
		await expectNoAxeViolations(footerContainer);
	});

	it('AT-002 — Renders About page with narrative, honest skill contexts, tertiary education weighting, and certification status', async () => {
		const { container, getByRole, getAllByText } = render(AboutPage);

		expect(getByRole('heading', { level: 1 })).toHaveTextContent(/Software Development at the Core/i);
		expect(getAllByText(/Walter Sisulu University/i).length).toBeGreaterThan(0);
		expect(getAllByText(/AWS Cloud Practitioner/i).length).toBeGreaterThan(0);
		expect(getAllByText(/In Progress/i).length).toBeGreaterThan(0);
		await expectNoAxeViolations(container);
	});

	it('AT-003 — Renders Experience page and distinguishes Professional Employment from Structured Training', async () => {
		const { container, getByRole, getAllByText } = render(ExperiencePage);

		expect(getByRole('heading', { level: 1 })).toHaveTextContent(
			/Professional Experience & Engineering Training/i
		);
		expect(getAllByText('Professional Employment').length).toBeGreaterThan(0);
		expect(getAllByText('Structured Training / Learnership').length).toBeGreaterThan(0);
		await expectNoAxeViolations(container);
	});

	it('AT-004 — Renders Work page and Case Study detail page with architecture, decisions, and GitHub telemetry', async () => {
		const { container: workContainer, getByRole: getWorkRole } = render(WorkPage, {
			props: {
				data: {
					categories: ['All', ...PROJECT_CATEGORIES],
					featuredProjects: enrichedProjects,
					repositories: repos,
					githubMeta: {
						source: 'live',
						isStale: false,
						fetchedAt: '2026-10-03T07:13:14Z'
					}
				}
			}
		});
		expect(getWorkRole('heading', { level: 1 })).toHaveTextContent(
			/Engineering Case Studies & Repository Index/i
		);
		await expectNoAxeViolations(workContainer);
		cleanup();

		const project = getFeaturedProjectBySlug('engineering-portfolio')!;
		const { container: caseContainer, getByRole: getCaseRole, getByText } = render(
			CaseStudyPage,
			{
				props: {
					data: {
						project,
						githubRepo: repos[0] ?? null,
						relatedProjects: getFeaturedProjects().slice(1, 3)
					}
				}
			}
		);
		expect(getCaseRole('heading', { level: 1 })).toHaveTextContent(project.title);
		expect(getByText(/Decouple UI from raw GitHub API schema/i)).toBeInTheDocument();
		await expectNoAxeViolations(caseContainer);
	});

	it('AT-005 & AT-007 — Renders GitHub explorer, supports filtering, and displays graceful stale/fallback banner without crashing', async () => {
		const { container, getByLabelText, getByText } = render(GitHubPage, {
			props: {
				data: {
					profile,
					githubResult: {
						repositories: repos,
						source: 'stale-cache',
						fetchedAt: '2026-10-03T07:13:14Z',
						isStale: true,
						errorMessage:
							'Live GitHub synchronization is temporarily unavailable; displaying cached repository metadata.'
					},
					languages: extractAvailableLanguages(repos)
				}
			}
		});

		expect(getByText(/Stale Cache Fallback/i)).toBeInTheDocument();
		expect(
			getByText(/displaying cached repository metadata/i)
		).toBeInTheDocument();

		const searchInput = getByLabelText(/Search Repositories/i) as HTMLInputElement;
		await fireEvent.input(searchInput, { target: { value: 'greenbidder' } });
		expect(getByText('greenbidder')).toBeInTheDocument();

		await expectNoAxeViolations(container);
	});

	it('AT-008 — Renders CV, Contact, and Labs pages with accessible links and zero axe violations', async () => {
		const { container: cvContainer, getByRole: getCvRole } = render(CvPage);
		expect(getCvRole('heading', { level: 1 })).toHaveTextContent(/Curriculum Vitae/i);
		await expectNoAxeViolations(cvContainer);
		cleanup();

		const { container: contactContainer, getByRole: getContactRole } = render(ContactPage, {
			props: {
				data: { profile },
				form: null
			}
		});
		expect(getContactRole('heading', { level: 1 })).toHaveTextContent(/Get in Touch/i);
		await expectNoAxeViolations(contactContainer);
		cleanup();

		const { container: labsContainer, getByRole: getLabsRole } = render(LabsPage);
		expect(getLabsRole('heading', { level: 1 })).toHaveTextContent(
			/Engineering Experiments & Technical Notes/i
		);
		await expectNoAxeViolations(labsContainer);
	});
});
