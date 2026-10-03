export type ContactFormInput = {
	name: string;
	email: string;
	subject: string;
	message: string;
};

export type ContactValidationResult = {
	valid: boolean;
	errors: Partial<Record<keyof ContactFormInput, string>>;
	sanitized: ContactFormInput | null;
};

export function sanitizeText(value: unknown): string {
	if (typeof value !== 'string') return '';
	const withoutTags = value.replace(/<[^>]*>/g, '');
	let cleaned = '';
	for (let i = 0; i < withoutTags.length; i += 1) {
		const code = withoutTags.charCodeAt(i);
		cleaned += code <= 31 || code === 127 ? ' ' : withoutTags[i];
	}
	return cleaned.replace(/\s+/g, ' ').trim();
}

export function validateContactSubmission(input: ContactFormInput): ContactValidationResult {
	const name = sanitizeText(input.name);
	const email = sanitizeText(input.email).toLowerCase();
	const subject = sanitizeText(input.subject);
	const message = sanitizeText(input.message);

	const errors: Partial<Record<keyof ContactFormInput, string>> = {};

	if (name.length < 2 || name.length > 80) {
		errors.name = 'Please enter your name (between 2 and 80 characters).';
	}
	if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		errors.email = 'Please enter a valid email address.';
	}
	if (subject.length < 3 || subject.length > 120) {
		errors.subject = 'Please provide a brief subject (between 3 and 120 characters).';
	}
	if (message.length < 15 || message.length > 2000) {
		errors.message = 'Please share a bit more detail (between 15 and 2,000 characters).';
	}

	const valid = Object.keys(errors).length === 0;
	return {
		valid,
		errors,
		sanitized: valid ? { name, email, subject, message } : null
	};
}
