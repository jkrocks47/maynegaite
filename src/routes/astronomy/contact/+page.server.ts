import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { sendContactEmail } from '$lib/server/email';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString()?.trim();
		const email = data.get('email')?.toString()?.trim();
		const message = data.get('message')?.toString()?.trim();

		if (!name || !email || !message) {
			return fail(400, { error: 'All fields are required.' });
		}

		try {
			await sendContactEmail(name, email, message);
			return { success: true };
		} catch (err) {
			console.error('Failed to send contact email:', err);
			return fail(500, { error: 'Failed to send message. Please try again later.' });
		}
	}
};
