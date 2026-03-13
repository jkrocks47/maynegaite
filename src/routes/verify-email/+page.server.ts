import { redirect } from '@sveltejs/kit';
import { validateVerificationToken } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const token = url.searchParams.get('token');

	if (token) {
		const result = await validateVerificationToken(token);
		if (result) {
			// Token was valid, email is now verified
			return { verified: true, alreadyVerified: false };
		}
		return { verified: false, alreadyVerified: false, error: 'Invalid or expired verification link.' };
	}

	// No token — show "check your email" page
	if (locals.member?.emailVerified) {
		throw redirect(303, '/dashboard');
	}

	return { verified: false, alreadyVerified: false };
};
