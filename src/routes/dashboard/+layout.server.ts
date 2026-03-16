import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.member) {
		throw redirect(303, '/login');
	}
	if (!locals.member.emailVerified) {
		throw redirect(303, '/verify-email');
	}
	return { member: locals.member };
};
