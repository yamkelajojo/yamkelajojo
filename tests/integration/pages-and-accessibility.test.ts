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
			// jsdom cannot calculate actual rendered colors; browser E2E runs the full axe checks.
			'color-contrast': { enabled: false },
			region: { enabled: false }
		}
	});
	expect(results.violations).toEqual([]);
}

const siteOrigin = 'https://portfolio.example';
const profile = getProfile();
const experiences = getAllExperiences();
const repositories = getFallbackRepositories();
const enrichedProjects = enrichProjectsWithGitHub(getFeaturedProjects(), repositories);
const githubStatus = {
	source: 'github-api' as const,
	fetchedAt: '2026-10-03T07:13:14Z',
	failureCode: null,
	errorMessage: null
};

describe('Integration — rendered portfolio flows and semantic accessibility', () => {
	it('renders keyboard navigation, homepage identity, GitHub source status and footer', async () => {
		const { container: headerContainer, getByLabelText } = render(Header, {
			props: { currentPath: '/' }
		});
		expect(getByLabelText('Yamkela Jojo — Home')).toBeInTheDocument();
		await expectNoAxeViolations(headerContainer);

		const { container: homeContainer, getByRole, getAllByText } = render(HomePage, {
			props: {
					data: {
						siteOrigin,
						profile,
						experiences,
					featuredProjects: enrichedProjects.slice(0, 4),
					recentRepos: repositories.slice(0, 4),
					githubMeta: { ...githubStatus, totalRepos: repositories.length },
					technicalAreas: SKILL_CATEGORIES.map((category) => ({
						category,
						skills: getSkillsByCategory(category).slice(0, 5)
					}))
				}
			}
		});
		expect(getByRole('heading', { level: 1 })).toHaveTextContent(/Yamkela Jojo/i);
		expect(getAllByText(/CustomConnect/i).length).toBeGreaterThan(0);
		expect(getByRole('group', { name: /GitHub repository data status/i })).toBeInTheDocument();
		await expectNoAxeViolations(homeContainer);

		const { container: footerContainer } = render(Footer);
		await expectNoAxeViolations(footerContainer);
		cleanup();
	});

	it('renders About and Experience with real portfolio distinctions and accessible headings', async () => {
		const { container: aboutContainer, getByRole, getAllByText } = render(AboutPage);
		expect(getByRole('heading', { level: 1 })).toHaveTextContent(/Software Development at the Core/i);
		expect(getAllByText(/Walter Sisulu University/i).length).toBeGreaterThan(0);
		expect(getAllByText(/AWS Cloud Practitioner/i).length).toBeGreaterThan(0);
		expect(getAllByText(/In Progress/i).length).toBeGreaterThan(0);
		await expectNoAxeViolations(aboutContainer);
		cleanup();

		const { container: experienceContainer, getByRole: getExperienceRole, getAllByText: getExperienceText } =
			render(ExperiencePage);
		expect(getExperienceRole('heading', { level: 1 })).toHaveTextContent(
			/Professional Experience & Engineering Training/i
		);
		expect(getExperienceText('Professional Employment').length).toBeGreaterThan(0);
		expect(getExperienceText('Structured Training / Learnership').length).toBeGreaterThan(0);
		await expectNoAxeViolations(experienceContainer);
	});

	it('renders curated projects, GitHub-backed repo cards and case-study related links', async () => {
		const { container: workContainer, getByRole: getWorkRole, getAllByText } = render(WorkPage, {
			props: {
					data: {
						siteOrigin,
						categories: ['All', ...PROJECT_CATEGORIES],
					featuredProjects: enrichedProjects,
					repositories,
					githubMeta: { ...githubStatus, totalRepos: repositories.length }
				}
			}
		});
		expect(getWorkRole('heading', { level: 1 })).toHaveTextContent(
			/Engineering Case Studies & Repository Index/i
		);
		expect(getAllByText('greenbidder').length).toBeGreaterThan(0);
		await expectNoAxeViolations(workContainer);
		cleanup();

		const project = getFeaturedProjectBySlug('engineering-portfolio')!;
		const { container: caseContainer, getByRole: getCaseRole, getByText: getCaseText } = render(
			CaseStudyPage,
			{
				props: {
						data: { siteOrigin, project, relatedProjects: getFeaturedProjects().slice(1, 3) }
				}
			}
		);
		expect(getCaseRole('heading', { level: 1 })).toHaveTextContent(project.title);
		expect(getCaseText(/Decouple UI from raw GitHub API schema/i)).toBeInTheDocument();
		expect(getCaseRole('link', { name: /Open GitHub Repository/i })).toHaveAttribute(
			'href',
			project.links.github
		);
		expect(getCaseRole('heading', { name: /Other Engineering Case Studies/i })).toBeInTheDocument();
		await expectNoAxeViolations(caseContainer);
	});

	it('renders a truthful fallback status and filters, sorts, and includes forked repositories', async () => {
		const fallbackResult = {
			repositories,
			source: 'fallback-snapshot' as const,
			fetchedAt: null,
			failureCode: 'rate-limited' as const,
			errorMessage:
				'GitHub temporarily rate-limited the server. Showing the maintained repository snapshot; the next cache miss or revalidation after its short response-cache window will try GitHub again.'
		};
		const { container, getByLabelText, getByRole, getByText, queryByText } = render(GitHubPage, {
			props: {
					data: {
						siteOrigin,
						profile,
						githubResult: fallbackResult,
					languages: extractAvailableLanguages(repositories)
				}
			}
		});

		expect(getByText('Maintained fallback snapshot')).toBeInTheDocument();
		expect(getByText(/GitHub temporarily rate-limited/i)).toBeInTheDocument();
		expect(getByText(/next cache miss or revalidation/i)).toBeInTheDocument();
		expect(getByText('greenbidder')).toBeInTheDocument();

		const searchInput = getByLabelText(/Search Repositories/i) as HTMLInputElement;
		await fireEvent.input(searchInput, { target: { value: 'greenbidder' } });
		expect(getByText('greenbidder')).toBeInTheDocument();
		expect(queryByText('Odin-Recipes-2')).not.toBeInTheDocument();

		await fireEvent.input(searchInput, { target: { value: '' } });
		const forkCheckbox = getByLabelText(/Include Forks/i) as HTMLInputElement;
		expect(forkCheckbox.checked).toBe(true);
		await fireEvent.click(forkCheckbox);
		expect(forkCheckbox.checked).toBe(false);
		expect(queryByText('classification-predict-streamlit-template')).not.toBeInTheDocument();

		const sortSelect = getByLabelText('Sort By') as HTMLSelectElement;
		await fireEvent.change(sortSelect, { target: { value: 'name' } });
		expect(sortSelect.value).toBe('name');
		expect(getByRole('button', { name: /reset filters/i })).toBeInTheDocument();
		await expectNoAxeViolations(container);
	});

	it('renders CV, Contact and Labs as real direct-navigation destinations', async () => {
		const { container: cvContainer, getByRole: getCvRole } = render(CvPage);
		expect(getCvRole('heading', { level: 1 })).toHaveTextContent(/Curriculum Vitae/i);
		await expectNoAxeViolations(cvContainer);
		cleanup();

		const { container: contactContainer, getByRole: getContactRole } = render(ContactPage, {
				props: { data: { siteOrigin, profile }, form: null }
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
