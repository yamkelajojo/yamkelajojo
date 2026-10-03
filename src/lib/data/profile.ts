import type { Profile, SocialLink } from '$lib/types';

const PROFILE_DATA: Profile = {
	name: 'Yamkela Jojo',
	headline:
		'Full-Stack & Software Developer building reliable web platforms, internal business systems, and data-informed applications.',
	shortPositioning:
		'Full-stack/software developer with professional web development experience and broader experience across application development, data science and emerging cybersecurity/cloud technologies.',
	summary:
		'Grounded in formal application development studies at Walter Sisulu University and test-driven software engineering at WeThinkCode_, I build full-stack web applications and internal operational platforms at CustomConnect using Laravel, PHP, Vue.js, Tailwind CSS, and MySQL—while extending that foundation across cross-platform apps, applied data science, and cloud/security fundamentals.',
	location: 'Durban, KwaZulu-Natal, South Africa',
	githubUrl: 'https://github.com/yamkelajojo',
	githubUsername: 'yamkelajojo',
	linkedinUrl: 'https://www.linkedin.com/in/yamkela-jojo-911774217',
	resumeUrl: '/resume/yamkela-jojo-cv.pdf',
	availabilityNote:
		'Currently Junior Web Developer at CustomConnect (Durban) · Open to software & full-stack engineering conversations.',
	careerProgression: [
		{
			step: '01',
			title: 'Information Technology Foundation',
			context: 'Walter Sisulu University · 2019–2021',
			summary:
				'National Diploma in Information Technology (Applications Development) covering Java, C#, VB.NET, Oracle databases, GUI systems, and information systems design.'
		},
		{
			step: '02',
			title: 'Software Development & TDD Discipline',
			context: 'WeThinkCode_ · 2022–2023',
			summary:
				'Rigorous systems development training anchored in Test-Driven Development, Java, Python, client/server networking, Docker, Maven, SQLite/JDBC, and collaborative engineering.'
		},
		{
			step: '03',
			title: 'Full-Stack Web Development',
			context: 'CustomConnect · 2024–Present',
			summary:
				'Production full-stack engineering with Laravel, PHP, Vue.js, Tailwind CSS, Bootstrap, and MySQL—delivering internal business platforms, asset ticket logging, and employee dashboards.'
		},
		{
			step: '04',
			title: 'Data Science & Machine Learning',
			context: 'ExploreAI Academy · 2023–2024',
			summary:
				'Applied training in predictive modelling, regression, decision trees, NLP sentiment classification, unsupervised recommender systems, Pandas, Streamlit, and Power BI.'
		},
		{
			step: '05',
			title: 'Broader Application Development',
			context: 'Cross-Platform & Product Engineering',
			summary:
				'Building mobile and web applications across Flutter/Dart, React Native (Expo + Tamagui + Supabase/PostGIS), Nuxt.js, and SvelteKit.'
		},
		{
			step: '06',
			title: 'Cybersecurity & Cloud Direction',
			context: 'Ongoing Technical Progression',
			summary:
				'Active exploration of Linux/Bash systems, network analysis (Wireshark, Nmap), cryptography fundamentals, and AWS Cloud Practitioner preparation.'
		}
	],
	socialLinks: [
		{
			id: 'github',
			label: 'GitHub',
			href: 'https://github.com/yamkelajojo',
			external: true,
			description: 'Public repositories, application code, and live engineering work.'
		},
		{
			id: 'linkedin',
			label: 'LinkedIn',
			href: 'https://www.linkedin.com/in/yamkela-jojo-911774217',
			external: true,
			description: 'Professional history, career timeline, and direct networking.'
		},
		{
			id: 'cv',
			label: 'Curriculum Vitae (PDF)',
			href: '/resume/yamkela-jojo-cv.pdf',
			external: false,
			description: 'Downloadable PDF version of Yamkela Jojo’s Curriculum Vitae.'
		}
	]
};

export function getProfile(): Profile {
	return PROFILE_DATA;
}

export function getSocialLinkById(id: SocialLink['id']): SocialLink | null {
	return PROFILE_DATA.socialLinks.find((link) => link.id === id) ?? null;
}
