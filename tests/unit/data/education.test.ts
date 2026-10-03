import { describe, expect, it } from 'vitest';
import {
	getAllEducation,
	getPrimaryEducation,
	getSecondaryEducation
} from '$lib/data/education';

describe('EDU-001 — Education hierarchy and visual weighting', () => {
	it('includes Walter Sisulu University, WeThinkCode_, ExploreAI Academy, and Kokstad College', () => {
		const all = getAllEducation();
		expect(all.length).toBe(4);
		expect(all.map((e) => e.institution)).toEqual([
			'Walter Sisulu University',
			'WeThinkCode_',
			'ExploreAI Academy, South Africa',
			'Kokstad College'
		]);
	});

	it('separates tertiary/NQF 5 qualifications from secondary education so Grade 12 is subordinate', () => {
		const primary = getPrimaryEducation();
		const secondary = getSecondaryEducation();

		expect(primary.length).toBe(3);
		expect(primary.every((e) => e.tier === 'tertiary' || e.tier === 'learnership')).toBe(true);
		expect(secondary.length).toBe(1);
		expect(secondary[0]?.institution).toBe('Kokstad College');
		expect(secondary[0]?.tier).toBe('secondary');
	});
});
