import { describe, expect, it } from 'vitest';
import { getProfile, getSocialLinkById } from '$lib/data/profile';

describe('PROFILE-001 & PROFILE-002 — Profile domain model', () => {
	it('returns Yamkela Jojo primary software developer positioning and narrative', () => {
		const profile = getProfile();
		expect(profile.name).toBe('Yamkela Jojo');
		expect(profile.headline.toLowerCase()).toContain('full-stack');
		expect(profile.headline.toLowerCase()).toContain('software');
		expect(profile.location).toContain('Durban');
		expect(profile.githubUsername).toBe('yamkelajojo');
		expect(profile.githubUrl).toBe('https://github.com/yamkelajojo');
		expect(profile.linkedinUrl).toBe('https://www.linkedin.com/in/yamkela-jojo-911774217');
		expect(profile.resumeUrl).toBe('/resume/yamkela-jojo-cv.pdf');
	});

	it('models the six-stage intentional career progression from IT to Cybersecurity & Cloud', () => {
		const profile = getProfile();
		expect(profile.careerProgression.length).toBe(6);
		expect(profile.careerProgression[0]?.title).toContain('Information Technology');
		expect(profile.careerProgression[5]?.title.toLowerCase()).toContain('security');
	});

	it('resolves structured social and CV links by id and returns null for unknown id', () => {
		expect(getSocialLinkById('github')?.href).toBe('https://github.com/yamkelajojo');
		expect(getSocialLinkById('linkedin')?.href).toBe(
			'https://www.linkedin.com/in/yamkela-jojo-911774217'
		);
		expect(getSocialLinkById('cv')?.href).toBe('/resume/yamkela-jojo-cv.pdf');
		expect(getSocialLinkById('unknown' as 'github')).toBeNull();
	});
});
