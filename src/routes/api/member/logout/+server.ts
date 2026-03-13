import { redirect } from '@sveltejs/kit';
import { destroyMemberSession } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('member_session');
	if (token) {
		await destroyMemberSession(token);
		cookies.delete('member_session', { path: '/' });
	}
	throw redirect(303, '/login');
};
