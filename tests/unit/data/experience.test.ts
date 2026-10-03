import { describe, expect, it } from 'vitest';
import {
	getAllExperiences,
	getExperiencesByType,
	getProfessionalExperiences,
	getTrainingAndApprenticeshipExperiences
} from '$lib/data/experience';

describe('EXP-001 & EXP-002 — Experience timeline and context separation', () => {
	it('presents experiences in reverse-chronological order starting with CustomConnect', () => {
		const experiences = getAllExperiences();
		expect(experiences.length).toBe(4);
		expect(experiences.map((item) => item.company)).toEqual([
			'CustomConnect',
			'ExploreAI Academy',
			'WeThinkCode_',
			'Nova Smart Technologies'
		]);
	});

	it('explicitly distinguishes professional employment from training and apprenticeship', () => {
		const professional = getExperiencesByType('professional');
		const training = getExperiencesByType('training');
		const apprenticeship = getExperiencesByType('apprenticeship');

		expect(professional.map((e) => e.company)).toEqual(['CustomConnect']);
		expect(training.map((e) => e.company)).toEqual(['ExploreAI Academy', 'WeThinkCode_']);
		expect(apprenticeship.map((e) => e.company)).toEqual(['Nova Smart Technologies']);

		expect(getProfessionalExperiences().length).toBe(1);
		expect(getTrainingAndApprenticeshipExperiences().length).toBe(3);
	});

	it('preserves overlapping learnership and employment dates without artificial alteration', () => {
		const experiences = getAllExperiences();
		const customConnect = experiences.find((e) => e.company === 'CustomConnect');
		const exploreAi = experiences.find((e) => e.company === 'ExploreAI Academy');
		const weThinkCode = experiences.find((e) => e.company === 'WeThinkCode_');
		const novaSmart = experiences.find((e) => e.company === 'Nova Smart Technologies');

		expect(customConnect?.startDate).toBe('2024-05');
		expect(customConnect?.endDate).toBeUndefined();
		expect(exploreAi?.startDate).toBe('2023-09');
		expect(exploreAi?.endDate).toBe('2024-08');
		expect(weThinkCode?.startDate).toBe('2022-09');
		expect(weThinkCode?.endDate).toBe('2023-12');
		expect(novaSmart?.startDate).toBe('2021-12');
		expect(novaSmart?.endDate).toBe('2022-03');
	});

	it('normalizes CustomConnect content without duplicate CV heading wording and highlights TDD at WeThinkCode_', () => {
		const experiences = getAllExperiences();
		const customConnect = experiences.find((e) => e.company === 'CustomConnect')!;
		const weThinkCode = experiences.find((e) => e.company === 'WeThinkCode_')!;

		expect(customConnect.description).not.toMatch(/Development and Security.*Development and Security/i);
		expect(customConnect.technologies).toEqual(
			expect.arrayContaining(['Laravel', 'PHP', 'Vue.js', 'Tailwind CSS', 'Bootstrap', 'MySQL'])
		);
		expect(weThinkCode.technologies).toEqual(
			expect.arrayContaining(['Test-Driven Development', 'Java', 'Python', 'Docker', 'Flutter', 'Dart'])
		);
	});
});
