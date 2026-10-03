export type ExperienceType = 'professional' | 'training' | 'apprenticeship';

export type EducationTier = 'tertiary' | 'learnership' | 'secondary';

export type SkillCategory =
	| 'Software Development'
	| 'Web Development'
	| 'Data Science'
	| 'Databases'
	| 'Mobile / Application Development'
	| 'Testing / Engineering'
	| 'Security / Systems'
	| 'Design / Product';

export type SkillContext =
	| 'professional'
	| 'hands-on'
	| 'training'
	| 'learning'
	| 'exploring';

export type CertificationStatus = 'in-progress' | 'completed' | 'planned' | 'expired';

export type ProjectCategory =
	| 'Web'
	| 'Mobile'
	| 'Full Stack'
	| 'Data Science'
	| 'AI / ML'
	| 'Cybersecurity'
	| 'DevOps / Cloud'
	| 'UI / UX'
	| 'Experiments';

export type CareerStage = {
	step: string;
	title: string;
	context: string;
	summary: string;
};

export type SocialLink = {
	id: 'github' | 'linkedin' | 'cv';
	label: string;
	href: string;
	external: boolean;
	description: string;
};

export type Profile = {
	name: string;
	headline: string;
	shortPositioning: string;
	summary: string;
	location?: string;
	githubUrl: string;
	githubUsername: string;
	linkedinUrl: string;
	resumeUrl: string;
	availabilityNote: string;
	careerProgression: CareerStage[];
	socialLinks: SocialLink[];
};

export type Experience = {
	id: string;
	company: string;
	role: string;
	location?: string;
	startDate: string;
	endDate?: string;
	periodLabel: string;
	type: ExperienceType;
	typeLabel: string;
	description: string;
	technologies: string[];
	highlights: string[];
	domains: string[];
};

export type Education = {
	id: string;
	institution: string;
	qualification: string;
	location?: string;
	startDate: string;
	endDate?: string;
	periodLabel: string;
	level?: string;
	tier: EducationTier;
	summary: string;
	subjects?: string[];
};

export type Skill = {
	name: string;
	category: SkillCategory;
	context: SkillContext;
	evidence?: string;
};

export type Certification = {
	id: string;
	name: string;
	provider: string;
	status: CertificationStatus;
	date?: string;
	credentialUrl?: string;
	verificationUrl?: string;
	focusAreas: string[];
	notes?: string;
};

export type ProjectDecision = {
	title: string;
	rationale: string;
};

export type ProjectVisualArtifact = {
	title: string;
	caption: string;
	diagramType: 'architecture' | 'pipeline' | 'schema' | 'interface';
	imageUrl?: string;
	nodes: string[];
};

export type FeaturedProject = {
	slug: string;
	title: string;
	subtitle: string;
	categories: ProjectCategory[];
	context: 'professional' | 'personal' | 'training';
	contextLabel: string;
	period: string;
	featuredOrder: number;
	repoName?: string;
	overview: string;
	problem: string;
	approach: string;
	role: string;
	technologies: string[];
	architecture?: string[];
	keyDecisions?: ProjectDecision[];
	challenges?: string[];
	testing?: string[];
	screenshots?: ProjectVisualArtifact[];
	results?: string[];
	links: {
		github?: string;
		live?: string;
		caseStudy: string;
	};
};

export type LabExperiment = {
	id: string;
	title: string;
	domain: 'Software Engineering' | 'Data Science / ML' | 'Security / Systems';
	context: SkillContext;
	summary: string;
	technicalNotes: string[];
	technologies: string[];
	relatedRepo?: string;
};
