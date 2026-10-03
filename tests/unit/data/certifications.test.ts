import { describe, expect, it } from 'vitest';
import {
	formatCertificationBadge,
	getAllCertifications,
	getCertificationsByStatus
} from '$lib/data/certifications';

describe('CERT-001 — Structured certification status model', () => {
	it('models AWS Cloud Practitioner as structured data with status in-progress', () => {
		const certs = getAllCertifications();
		expect(certs.length).toBeGreaterThanOrEqual(1);
		const aws = certs.find((c) => c.name === 'AWS Cloud Practitioner');
		expect(aws).toBeDefined();
		expect(aws?.provider).toBe('Amazon Web Services (AWS)');
		expect(aws?.status).toBe('in-progress');
	});

	it('formats certification badge dynamically across all four lifecycle statuses', () => {
		expect(formatCertificationBadge('in-progress')).toEqual({
			label: 'In Progress',
			tone: 'amber',
			isVerified: false
		});
		expect(formatCertificationBadge('completed')).toEqual({
			label: 'Completed',
			tone: 'emerald',
			isVerified: true
		});
		expect(formatCertificationBadge('planned')).toEqual({
			label: 'Planned',
			tone: 'slate',
			isVerified: false
		});
		expect(formatCertificationBadge('expired')).toEqual({
			label: 'Expired',
			tone: 'muted',
			isVerified: false
		});
	});

	it('filters certifications by status', () => {
		expect(getCertificationsByStatus('in-progress').length).toBe(1);
		expect(getCertificationsByStatus('completed').length).toBe(0);
	});
});
