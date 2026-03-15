import { fail, redirect } from '@sveltejs/kit';
import { validateVerificationToken, generateVerificationToken } from '$lib/server/auth';
import { sendVerificationEmail } from '$lib/server/email';
import { db } from '$lib/server/db';
import { members } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const token = url.searchParams.get('token');

	if (token) {
		const result = await validateVerificationToken(token);
		if (result) {
			return { verified: true, alreadyVerified: false };
		}
		return { verified: false, alreadyVerified: false, error: 'Invalid or expired verification link.' };
	}

	if (locals.member?.emailVerified) {
		throw redirect(303, '/dashboard');
	}

	return { verified: false, alreadyVerified: false };
};

export const actions: Actions = {
	resend: async ({ locals }) => {
		if (!locals.member) {
			return fail(401, { resendError: 'You must be signed in to resend the verification email.' });
		}

		if (locals.member.emailVerified) {
			return fail(400, { resendError: 'Your email is already verified.' });
		}

		const member = await db
			.select({ id: members.id, email: members.email, firstName: members.firstName })
			.from(members)
			.where(eq(members.id, locals.member.id))
			.limit(1);

		if (member.length === 0) {
			return fail(400, { resendError: 'Account not found.' });
		}

		try {
			const token = await generateVerificationToken(member[0].id);
			await sendVerificationEmail(member[0].email, token, member[0].firstName);
		} catch {
			return fail(500, { resendError: 'Failed to send email. Please try again.' });
		}

		return { resent: true };
	}
};
