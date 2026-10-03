import type { Skill, SkillCategory, SkillContext } from '$lib/types';

export const SKILL_CATEGORIES: SkillCategory[] = [
	'Software Development',
	'Web Development',
	'Data Science',
	'Databases',
	'Mobile / Application Development',
	'Testing / Engineering',
	'Security / Systems',
	'Design / Product'
];

export const SKILL_CONTEXT_META: Record<
	SkillContext,
	{ label: string; shortLabel: string; description: string }
> = {
	professional: {
		label: 'Professional',
		shortLabel: 'Production Work',
		description:
			'Used directly in production employment at CustomConnect to deliver and maintain business systems.'
	},
	'hands-on': {
		label: 'Hands-on',
		shortLabel: 'Built Projects',
		description:
			'Applied in complete, verifiable personal or portfolio applications and public GitHub repositories.'
	},
	training: {
		label: 'Academic / Training',
		shortLabel: 'Formal Training',
		description:
			'Practiced rigorously across Walter Sisulu University, WeThinkCode_, or ExploreAI Academy cohorts.'
	},
	learning: {
		label: 'Currently Learning',
		shortLabel: 'Active Study',
		description:
			'Actively studying toward structured certification or deeper architectural mastery.'
	},
	exploring: {
		label: 'Exploring',
		shortLabel: 'Lab & Systems Interest',
		description:
			'Explored through lab environments, systems tooling, and security/cryptography experimentation—not claimed as commercial consulting.'
	}
};

const SKILLS: Skill[] = [
	// 1. Software Development
	{
		name: 'PHP',
		category: 'Software Development',
		context: 'professional',
		evidence: 'Backend application logic and internal business platforms at CustomConnect & Odin Recipes.'
	},
	{
		name: 'JavaScript',
		category: 'Software Development',
		context: 'professional',
		evidence: 'Interactive frontend engineering at CustomConnect and cross-platform apps (GreenBidder, Dojo Drumkit).'
	},
	{
		name: 'TypeScript',
		category: 'Software Development',
		context: 'hands-on',
		evidence: 'Typed domain models, GitHub API normalizers, and SvelteKit architecture in this portfolio and GreenBidder.'
	},
	{
		name: 'Java',
		category: 'Software Development',
		context: 'training',
		evidence: 'Core systems language at Walter Sisulu University and WeThinkCode_ (OOP, JDBC, client/server).'
	},
	{
		name: 'Python',
		category: 'Software Development',
		context: 'training',
		evidence: 'Used across WeThinkCode_ systems projects and ExploreAI Academy machine learning pipelines.'
	},
	{
		name: 'C# & VB.NET',
		category: 'Software Development',
		context: 'training',
		evidence: 'GUI and application development coursework during National Diploma at Walter Sisulu University.'
	},
	{
		name: 'HTML',
		category: 'Software Development',
		context: 'professional',
		evidence: 'Semantic document structure and accessible interfaces across production and personal web work.'
	},
	{
		name: 'CSS',
		category: 'Software Development',
		context: 'professional',
		evidence: 'Custom responsive styling, layout architecture, and design token systems.'
	},

	// 2. Web Development
	{
		name: 'Laravel',
		category: 'Web Development',
		context: 'professional',
		evidence: 'Primary full-stack backend framework at CustomConnect and in Odin Recipes (Inertia/Blade).'
	},
	{
		name: 'Vue.js',
		category: 'Web Development',
		context: 'professional',
		evidence: 'Component-based frontend development for internal dashboards and platforms at CustomConnect.'
	},
	{
		name: 'Tailwind CSS',
		category: 'Web Development',
		context: 'professional',
		evidence: 'Production UI styling at CustomConnect, Odin Recipes, and this SvelteKit portfolio.'
	},
	{
		name: 'Bootstrap',
		category: 'Web Development',
		context: 'professional',
		evidence: 'Maintained and extended internal responsive business interfaces at CustomConnect.'
	},
	{
		name: 'SvelteKit & Svelte 5',
		category: 'Web Development',
		context: 'hands-on',
		evidence: 'Engineered this portfolio with Svelte 5 runes, Bits UI primitives, and Cloudflare Workers.'
	},
	{
		name: 'Nuxt.js',
		category: 'Web Development',
		context: 'hands-on',
		evidence: 'Built Dojo Drumkit Studio using Nuxt 3, Vue Composition API, and custom audio composables.'
	},
	{
		name: 'React.js',
		category: 'Web Development',
		context: 'hands-on',
		evidence: 'Component architecture shared with React Native / Expo web targets in GreenBidder.'
	},
	{
		name: 'WordPress',
		category: 'Web Development',
		context: 'training',
		evidence: 'CMS configuration, plugin integration, and SEO during Nova Smart Technologies apprenticeship.'
	},

	// 3. Data Science
	{
		name: 'Pandas',
		category: 'Data Science',
		context: 'training',
		evidence: 'Data wrangling, feature engineering, and exploratory analysis at ExploreAI Academy.'
	},
	{
		name: 'Machine Learning & Predictive Modelling',
		category: 'Data Science',
		context: 'training',
		evidence: 'Linear/multiple regression, decision trees, random forests, and anomaly detection.'
	},
	{
		name: 'Natural Language Processing (NLP)',
		category: 'Data Science',
		context: 'training',
		evidence: 'Twitter climate sentiment classification using NLTK, TF-IDF, and supervised classifiers.'
	},
	{
		name: 'Unsupervised Learning & Recommender Systems',
		category: 'Data Science',
		context: 'training',
		evidence: 'Collaborative and content-based movie recommendation engine deployed on Streamlit.'
	},
	{
		name: 'Streamlit',
		category: 'Data Science',
		context: 'training',
		evidence: 'Interactive web deployment for ML classification and recommendation models.'
	},
	{
		name: 'Matplotlib & Data Visualization',
		category: 'Data Science',
		context: 'training',
		evidence: 'Visual diagnostics and model evaluation plots in Jupyter Notebooks.'
	},
	{
		name: 'Power BI & Data Storytelling',
		category: 'Data Science',
		context: 'training',
		evidence: 'Executive dashboards and narrative insight reporting during ExploreAI sprints.'
	},
	{
		name: 'Jupyter',
		category: 'Data Science',
		context: 'training',
		evidence: 'Reproducible notebook workflows for data exploration and model experimentation.'
	},

	// 4. Databases
	{
		name: 'MySQL',
		category: 'Databases',
		context: 'professional',
		evidence: 'Production relational database design and Laravel Eloquent integration at CustomConnect.'
	},
	{
		name: 'SQL',
		category: 'Databases',
		context: 'professional',
		evidence: 'Relational schema design, migrations, and query authoring across MySQL, SQLite, and PostgreSQL.'
	},
	{
		name: 'SQLite',
		category: 'Databases',
		context: 'hands-on',
		evidence: 'Used in WeThinkCode_ persistence layers and Laravel/Inertia Odin Recipes.'
	},
	{
		name: 'PostgreSQL / Supabase (PostGIS)',
		category: 'Databases',
		context: 'hands-on',
		evidence: '12-table schema with PostGIS geography points and Row-Level Security in GreenBidder.'
	},
	{
		name: 'JDBC',
		category: 'Databases',
		context: 'training',
		evidence: 'Java database connectivity and DAO layers built at WeThinkCode_.'
	},
	{
		name: 'Oracle Database',
		category: 'Databases',
		context: 'training',
		evidence: 'Relational database systems coursework at Walter Sisulu University.'
	},

	// 5. Mobile / Application Development
	{
		name: 'Flutter & Dart',
		category: 'Mobile / Application Development',
		context: 'training',
		evidence: 'Cross-platform mobile application development during WeThinkCode_ systems track.'
	},
	{
		name: 'React Native & Expo',
		category: 'Mobile / Application Development',
		context: 'hands-on',
		evidence: 'Built GreenBidder mobile/web marketplace with Expo 54, Tamagui, and Zod validation.'
	},
	{
		name: 'PyQt5 & Desktop GUI Development',
		category: 'Mobile / Application Development',
		context: 'training',
		evidence: 'Desktop client interfaces built during WeThinkCode_ and WSU application development studies.'
	},

	// 6. Testing / Engineering
	{
		name: 'Test-Driven Development (TDD)',
		category: 'Testing / Engineering',
		context: 'hands-on',
		evidence: 'Core engineering discipline from WeThinkCode_ applied throughout this portfolio (RED → GREEN → REFACTOR).'
	},
	{
		name: 'Unit & Integration Testing (Vitest / JUnit / PHPUnit)',
		category: 'Testing / Engineering',
		context: 'hands-on',
		evidence: 'White-box branch/boundary testing in Vitest, Java JUnit suites, and Laravel PHPUnit tests.'
	},
	{
		name: 'End-to-End Testing (Playwright)',
		category: 'Testing / Engineering',
		context: 'hands-on',
		evidence: 'Browser-level user journey and accessibility verification for this portfolio.'
	},
	{
		name: 'Git & GitLab / GitHub',
		category: 'Testing / Engineering',
		context: 'professional',
		evidence: 'Daily version control, branching workflows, pull requests, and CI pipelines.'
	},
	{
		name: 'Docker',
		category: 'Testing / Engineering',
		context: 'training',
		evidence: 'Containerized application packaging and reproducible environments at WeThinkCode_.'
	},
	{
		name: 'Maven',
		category: 'Testing / Engineering',
		context: 'training',
		evidence: 'JVM build lifecycle, dependency management, and automated test execution.'
	},

	// 7. Security / Systems
	{
		name: 'Bash',
		category: 'Security / Systems',
		context: 'training',
		evidence: 'Command-line workflow automation, environment configuration, and Linux shell scripting.'
	},
	{
		name: 'Kali Linux',
		category: 'Security / Systems',
		context: 'exploring',
		evidence: 'Lab environment used for studying system security fundamentals and network diagnostics.'
	},
	{
		name: 'Metasploit Framework',
		category: 'Security / Systems',
		context: 'exploring',
		evidence: 'Studied vulnerability mechanics in controlled labs to understand defensive application hardening.'
	},
	{
		name: 'Nmap',
		category: 'Security / Systems',
		context: 'exploring',
		evidence: 'Network host discovery and port enumeration in local lab topologies.'
	},
	{
		name: 'Wireshark',
		category: 'Security / Systems',
		context: 'exploring',
		evidence: 'Packet capture and protocol inspection for debugging client/server and HTTP traffic.'
	},
	{
		name: 'Cryptographic Hashing',
		category: 'Security / Systems',
		context: 'training',
		evidence: 'Applied password hashing, digest verification, and data integrity checks in software projects.'
	},
	{
		name: 'Asymmetric Encryption',
		category: 'Security / Systems',
		context: 'training',
		evidence: 'Studied public/private key cryptography, TLS handshakes, and SSH key authentication.'
	},

	// 8. Design / Product
	{
		name: 'Component-Based UI Architecture',
		category: 'Design / Product',
		context: 'professional',
		evidence: 'Reusable UI primitives across Vue.js at CustomConnect and Svelte 5 / Bits UI in this portfolio.'
	},
	{
		name: 'Responsive Design & Accessibility',
		category: 'Design / Product',
		context: 'professional',
		evidence: 'Mobile-first layouts, keyboard navigation, semantic HTML, and WCAG contrast discipline.'
	},
	{
		name: 'Figma & UI/UX Prototyping',
		category: 'Design / Product',
		context: 'hands-on',
		evidence: 'Interface wireframing and design handoff practiced from Nova Smart Technologies to current work.'
	}
];

export function getAllSkills(): Skill[] {
	return SKILLS;
}

export function getSkillsByCategory(category: SkillCategory): Skill[] {
	return SKILLS.filter((skill) => skill.category === category);
}

export function getSkillsByContext(context: SkillContext): Skill[] {
	return SKILLS.filter((skill) => skill.context === context);
}

export function getSkillContextMeta(context: SkillContext) {
	return SKILL_CONTEXT_META[context];
}
