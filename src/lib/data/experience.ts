import type { Experience, ExperienceType } from '$lib/types';

const EXPERIENCES: Experience[] = [
	{
		id: 'customconnect-junior-web-developer',
		company: 'CustomConnect',
		role: 'Junior Web Developer',
		location: 'Durban',
		startDate: '2024-05',
		periodLabel: 'May 2024 – Present',
		type: 'professional',
		typeLabel: 'Professional Employment',
		description:
			'Full-stack web developer building and maintaining internal business platforms, operational workflows, and reusable frontend interfaces in close collaboration with executive leadership, data analysts, and IT teams.',
		technologies: [
			'Laravel',
			'PHP',
			'Vue.js',
			'Tailwind CSS',
			'Bootstrap',
			'Custom CSS',
			'MySQL',
			'Microsoft Teams',
			'Git'
		],
		highlights: [
			'Develop full-stack internal business platforms using Laravel and PHP, handling application routing, backend controllers, and frontend/backend integration.',
			'Build responsive, component-based user interfaces and reusable UI modules with Vue.js, Tailwind CSS, Bootstrap, and custom CSS.',
			'Design and maintain relational data models and queries in MySQL through Laravel database integration for reliable application data management.',
			'Deliver operational business systems including internal asset ticket logging workflows and employee dashboards.',
			'Partner directly with the CEO, Data Analysts, and IT leadership through daily standups and Microsoft Teams to translate operational needs into practical software improvements.'
		],
		domains: ['Full-Stack Web Development', 'Frontend Engineering', 'Database Systems', 'Business Process Systems']
	},
	{
		id: 'exploreai-data-science-learnership',
		company: 'ExploreAI Academy',
		role: 'Full Stack Data Science Learnership',
		location: 'Durban',
		startDate: '2023-09',
		endDate: '2024-08',
		periodLabel: 'September 2023 – August 2024',
		type: 'training',
		typeLabel: 'Structured Technical Training',
		description:
			'Intensive full-stack data science learnership focused on statistical modelling, supervised and unsupervised machine learning, natural language processing, interactive model deployment, and collaborative data storytelling.',
		technologies: [
			'Python',
			'Pandas',
			'Matplotlib',
			'Jupyter',
			'Streamlit',
			'Power BI',
			'scikit-learn',
			'NLTK',
			'Git'
		],
		highlights: [
			'Built and evaluated predictive models using linear and multiple regression, decision trees, random forests, and ensemble classifiers across team sprints and Kaggle competitions.',
			'Developed natural language processing pipelines for climate-change tweet sentiment classification and deployed interactive model interfaces with Streamlit.',
			'Implemented unsupervised learning workflows including clustering, anomaly detection, and collaborative/content-based movie recommendation engines.',
			'Produced analytical dashboards and data storytelling presentations using Python, Pandas, Matplotlib, and Power BI during collaborative hackathons and sprint reviews.'
		],
		domains: ['Data Science', 'Machine Learning', 'NLP', 'Data Visualization']
	},
	{
		id: 'wethinkcode-software-development-learnership',
		company: 'WeThinkCode_',
		role: 'Full Stack Software Development Learnership',
		location: 'Durban',
		startDate: '2022-09',
		endDate: '2023-12',
		periodLabel: 'September 2022 – December 2023',
		type: 'training',
		typeLabel: 'Structured Software Engineering Training',
		description:
			'Peer-driven systems and software engineering program emphasizing Test-Driven Development (TDD), object-oriented architecture, networked client/server systems, database persistence, and cross-platform application development.',
		technologies: [
			'Test-Driven Development',
			'Java',
			'Python',
			'Docker',
			'Maven',
			'JVM',
			'SQLite',
			'JDBC',
			'Flutter',
			'Dart',
			'PyQt5',
			'Git',
			'GitLab'
		],
		highlights: [
			'Practiced strict Test-Driven Development (TDD) and automated software testing across Java and Python codebases.',
			'Engineered multi-client/server networked applications, custom wire protocols, and concurrent JVM services managed with Maven and Docker.',
			'Implemented relational persistence layers using SQLite and JDBC alongside desktop (PyQt5) and mobile (Flutter & Dart) client applications.',
			'Applied Git/GitLab version control, code reviews, package management, and foundational application security practices in team cohorts.'
		],
		domains: ['Software Engineering', 'Test-Driven Development', 'Client/Server Systems', 'Mobile & Desktop Apps']
	},
	{
		id: 'nova-smart-web-developer-apprentice',
		company: 'Nova Smart Technologies',
		role: 'Web Developer Apprentice',
		location: 'Durban',
		startDate: '2021-12',
		endDate: '2022-03',
		periodLabel: 'December 2021 – March 2022',
		type: 'apprenticeship',
		typeLabel: 'Early-Career Apprenticeship',
		description:
			'Practical web development apprenticeship focused on layout design, content management systems, plugin configuration, MySQL database backing, and search engine optimization.',
		technologies: ['WordPress', 'Figma', 'MySQL', 'SEO', 'HTML', 'CSS'],
		highlights: [
			'Designed website layouts and interface mockups in Figma and translated them into responsive WordPress pages.',
			'Configured plugins, content management workflows, and MySQL-backed site configurations.',
			'Applied foundational technical SEO practices and structured content hierarchy for client websites.'
		],
		domains: ['Web Design', 'CMS & WordPress', 'UI Prototyping']
	}
];

export function getAllExperiences(): Experience[] {
	return EXPERIENCES;
}

export function getExperiencesByType(type: ExperienceType): Experience[] {
	return EXPERIENCES.filter((experience) => experience.type === type);
}

export function getProfessionalExperiences(): Experience[] {
	return getExperiencesByType('professional');
}

export function getTrainingAndApprenticeshipExperiences(): Experience[] {
	return EXPERIENCES.filter(
		(experience) => experience.type === 'training' || experience.type === 'apprenticeship'
	);
}
