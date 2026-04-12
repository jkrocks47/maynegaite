import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.member) {
		throw redirect(303, '/login');
	}
	return { member: locals.member };
};
