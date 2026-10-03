import type { Education } from '$lib/types';

const EDUCATION_HISTORY: Education[] = [
	{
		id: 'wsu-national-diploma-it',
		institution: 'Walter Sisulu University',
		qualification: 'National Diploma: Information Technology — Applications Development',
		startDate: '2019-01',
		endDate: '2021-12',
		periodLabel: 'January 2019 – December 2021',
		level: 'NQF Level 6 National Diploma',
		tier: 'tertiary',
		summary:
			'Formal tertiary qualification in software and application development, covering object-oriented programming, relational database systems, GUI engineering, and enterprise information systems.',
		subjects: [
			'Java',
			'Oracle Database',
			'VB.NET',
			'C#',
			'GUI Development',
			'Information Systems',
			'System Software',
			'Application Development'
		]
	},
	{
		id: 'wethinkcode-nqf5-systems-development',
		institution: 'WeThinkCode_',
		qualification: 'NQF Level 5 Qualification: Systems Development',
		location: 'Durban',
		startDate: '2022-01',
		endDate: '2023-12',
		periodLabel: 'January 2022 – December 2023',
		level: 'NQF Level 5',
		tier: 'learnership',
		summary:
			'Applied systems development qualification focused on Test-Driven Development, Java, Python, client/server architecture, containerization with Docker, SQLite/JDBC persistence, and Flutter/Dart mobile engineering.',
		subjects: [
			'Test-Driven Development',
			'Java & JVM',
			'Python',
			'Client/Server Networking',
			'Docker & Maven',
			'SQLite & JDBC',
			'Flutter & Dart'
		]
	},
	{
		id: 'exploreai-nqf5-data-science',
		institution: 'ExploreAI Academy, South Africa',
		qualification: 'NQF Level 5 Qualification (Full Stack Data Science)',
		location: 'Durban',
		startDate: '2023-09',
		endDate: '2024-08',
		periodLabel: 'September 2023 – August 2024',
		level: 'NQF Level 5',
		tier: 'learnership',
		summary:
			'Structured data science qualification covering supervised and unsupervised machine learning, natural language processing, Python analytics, Streamlit deployment, and Power BI data storytelling.',
		subjects: [
			'Machine Learning & Predictive Modelling',
			'Natural Language Processing',
			'Unsupervised Learning & Recommender Systems',
			'Python, Pandas & Matplotlib',
			'Streamlit & Power BI'
		]
	},
	{
		id: 'kokstad-college-nsc',
		institution: 'Kokstad College',
		qualification: 'Grade 12 National Senior Certificate (NSC)',
		startDate: '2013-01',
		endDate: '2017-12',
		periodLabel: 'January 2013 – December 2017',
		level: 'Grade 12 NSC',
		tier: 'secondary',
		summary: 'Completed secondary schooling prior to tertiary Information Technology studies.'
	}
];

export function getAllEducation(): Education[] {
	return EDUCATION_HISTORY;
}

export function getPrimaryEducation(): Education[] {
	return EDUCATION_HISTORY.filter(
		(entry) => entry.tier === 'tertiary' || entry.tier === 'learnership'
	);
}

export function getSecondaryEducation(): Education[] {
	return EDUCATION_HISTORY.filter((entry) => entry.tier === 'secondary');
}
