const LANGUAGE_COLORS: Record<string, string> = {
	TypeScript: '#2b6cb0',
	JavaScript: '#b7791f',
	PHP: '#5a509b',
	Blade: '#c2542d',
	Vue: '#1f6f54',
	Python: '#2c5282',
	'Jupyter Notebook': '#b84a27',
	Java: '#9c4221',
	Dart: '#0987a0'
};

export function formatIsoDate(isoDate: string | null | undefined): string {
	if (!isoDate) return 'Unknown';
	const parsed = new Date(isoDate);
	if (Number.isNaN(parsed.getTime())) return 'Unknown';
	return new Intl.DateTimeFormat('en-ZA', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	}).format(parsed);
}

export function getLanguageColor(language: string | null | undefined): string {
	if (!language) return '#6e6a63';
	return LANGUAGE_COLORS[language] ?? '#6e6a63';
}
