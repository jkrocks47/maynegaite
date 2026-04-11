import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { communityInfo } from '$lib/server/db/schema';
import { sendContactEmail } from '$lib/server/email';
import { getBoardEmails } from '$lib/server/db/queries';
import { checkHoneypot, checkRateLimit, checkSubmissionTiming } from '$lib/server/security';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const community = await db.select().from(communityInfo).limit(1);
	return { communityInfo: community[0] ?? null };
};

export const actions: Actions = {
	send: async (event) => {
		const rateLimited = checkRateLimit(event, 'contact');
		if (rateLimited) return rateLimited;

		const { request } = event;
		const formData = await request.formData();

		const honeypotFail = checkHoneypot(formData);
		if (honeypotFail) return honeypotFail;

		const timingFail = checkSubmissionTiming(formData);
		if (timingFail) return timingFail;

		const name = (formData.get('name') as string)?.trim();
		const email = (formData.get('email') as string)?.trim();
		const message = (formData.get('message') as string)?.trim();

		if (!name || !email || !message) {
			return fail(400, { error: 'All fields are required.' });
		}

		try {
			const recipients = await getBoardEmails();
			await sendContactEmail(name, email, message, recipients);
			return { success: true };
		} catch {
			return fail(500, { error: 'Failed to send message. Please try again.' });
		}
	}
};
