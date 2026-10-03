import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getProfile } from '$lib/data/profile';
import { validateContactSubmission } from '$lib/utils/contact';

export const load: PageServerLoad = async () => {
	return {
		profile: getProfile()
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const submission = {
			name: String(formData.get('name') ?? ''),
			email: String(formData.get('email') ?? ''),
			subject: String(formData.get('subject') ?? ''),
			message: String(formData.get('message') ?? '')
		};

		const validation = validateContactSubmission(submission);

		if (!validation.valid || !validation.sanitized) {
			return fail(400, {
				success: false,
				errors: validation.errors,
				values: submission
			});
		}

		// This portfolio has no message-delivery or storage service. Preserve the
		// sanitized draft so the page can clearly report validation without
		// claiming that anything was sent or recorded.
		return {
			success: true,
			values: validation.sanitized,
			recipientName: validation.sanitized.name
		};
	}
};
