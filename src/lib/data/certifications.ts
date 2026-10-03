import type { Certification, CertificationStatus } from '$lib/types';

const CERTIFICATIONS: Certification[] = [
	{
		id: 'aws-cloud-practitioner',
		name: 'AWS Cloud Practitioner',
		provider: 'Amazon Web Services (AWS)',
		status: 'in-progress',
		focusAreas: [
			'Cloud Concepts & Architecture',
			'AWS Core Compute, Storage & Networking Services',
			'Cloud Security, IAM & Shared Responsibility Model',
			'Billing, Pricing & Cost Governance'
		],
		notes:
			'Modeled as structured certification state so status transitions from In Progress to Completed with verification metadata when issued.'
	}
];

export function getAllCertifications(): Certification[] {
	return CERTIFICATIONS;
}

export function getCertificationsByStatus(status: CertificationStatus): Certification[] {
	return CERTIFICATIONS.filter((cert) => cert.status === status);
}

export function formatCertificationBadge(status: CertificationStatus): {
	label: string;
	tone: 'amber' | 'emerald' | 'slate' | 'muted';
	isVerified: boolean;
} {
	switch (status) {
		case 'in-progress':
			return {
				label: 'In Progress',
				tone: 'amber',
				isVerified: false
			};
		case 'completed':
			return {
				label: 'Completed',
				tone: 'emerald',
				isVerified: true
			};
		case 'planned':
			return {
				label: 'Planned',
				tone: 'slate',
				isVerified: false
			};
		case 'expired':
			return {
				label: 'Expired',
				tone: 'muted',
				isVerified: false
			};
	}
}
