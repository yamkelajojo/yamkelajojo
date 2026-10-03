import { describe, expect, it } from 'vitest';
import {
	SKILL_CATEGORIES,
	getAllSkills,
	getSkillsByCategory,
	getSkillsByContext,
	getSkillContextMeta
} from '$lib/data/skills';

describe('SKILL-001 — Technical skill grouping and honest context representation', () => {
	it('groups skills across all 8 required domains', () => {
		expect(SKILL_CATEGORIES).toEqual([
			'Software Development',
			'Web Development',
			'Data Science',
			'Databases',
			'Mobile / Application Development',
			'Testing / Engineering',
			'Security / Systems',
			'Design / Product'
		]);

		for (const category of SKILL_CATEGORIES) {
			const categorySkills = getSkillsByCategory(category);
			expect(categorySkills.length).toBeGreaterThan(0);
		}
	});

	it('never uses percentage proficiency values and assigns valid context labels to every skill', () => {
		const skills = getAllSkills();
		expect(skills.length).toBeGreaterThanOrEqual(30);

		for (const skill of skills) {
			expect(['professional', 'hands-on', 'training', 'learning', 'exploring']).toContain(
				skill.context
			);
			expect('percentage' in skill).toBe(false);
			expect(skill.evidence?.includes('%')).toBeFalsy();
		}
	});

	it('represents security/system tools as training/exploring interests rather than professional employment', () => {
		const securitySkills = getSkillsByCategory('Security / Systems');
		const names = securitySkills.map((s) => s.name);
		expect(names).toEqual(
			expect.arrayContaining([
				'Kali Linux',
				'Bash',
				'Metasploit Framework',
				'Nmap',
				'Wireshark',
				'Cryptographic Hashing',
				'Asymmetric Encryption'
			])
		);

		for (const skill of securitySkills) {
			expect(skill.context).not.toBe('professional');
		}
	});

	it('filters skills by context and returns descriptive metadata for each context level', () => {
		const proSkills = getSkillsByContext('professional');
		expect(proSkills.map((s) => s.name)).toEqual(
			expect.arrayContaining(['Laravel', 'PHP', 'Vue.js', 'MySQL', 'Tailwind CSS'])
		);

		const meta = getSkillContextMeta('professional');
		expect(meta.label).toBe('Professional');
		expect(meta.description.length).toBeGreaterThan(10);
	});
});
