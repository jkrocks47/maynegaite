import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { verifyPassword, createSession, destroySession } from '$lib/server/auth';
import { loginSchema } from '$lib/utils/validation';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { user: locals.user };
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const parsed = loginSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: 'Invalid email or password' });
		}

		const { email, password } = parsed.data;

		const result = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (result.length === 0) {
			return fail(400, { error: 'Invalid email or password' });
		}

		const user = result[0];
		const valid = await verifyPassword(password, user.passwordHash);

		if (!valid) {
			return fail(400, { error: 'Invalid email or password' });
		}

		const token = await createSession(user.id);

		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60
		});

		throw redirect(303, '/admin');
	},

	logout: async ({ cookies }) => {
		const token = cookies.get('session');
		if (token) {
			await destroySession(token);
			cookies.delete('session', { path: '/' });
		}
		throw redirect(303, '/admin');
	}
};
