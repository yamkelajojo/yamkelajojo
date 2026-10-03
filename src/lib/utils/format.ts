const LANGUAGE_COLOR_TOKENS: Record<string, string> = {
	TypeScript: '--language-typescript',
	JavaScript: '--language-javascript',
	PHP: '--language-php',
	Blade: '--language-blade',
	Vue: '--language-vue',
	Python: '--language-python',
	'Jupyter Notebook': '--language-jupyter',
	Java: '--language-java',
	Dart: '--language-dart'
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
	const token = language ? LANGUAGE_COLOR_TOKENS[language] : undefined;
	return `var(${token ?? '--language-default'})`;
}
