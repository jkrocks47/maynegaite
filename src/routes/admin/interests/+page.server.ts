import { error, fail } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { interestOptions } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.member?.adminRole !== 'super_admin') {
		error(403, 'Only super admins can manage interests.');
	}

	const interests = await db
		.select()
		.from(interestOptions)
		.orderBy(interestOptions.sortOrder);

	return { interests };
};

export const actions: Actions = {
	add: async ({ request, locals }) => {
		if (locals.member?.adminRole !== 'super_admin') {
			return fail(403, { error: 'Only super admins can manage interests.' });
		}

		const formData = await request.formData();
		const name = (formData.get('name') as string)?.trim();

		if (!name || name.length === 0) {
			return fail(400, { error: 'Interest name is required.' });
		}

		if (name.length > 100) {
			return fail(400, { error: 'Interest name must be 100 characters or less.' });
		}

		// Get max sort order
		const maxResult = await db
			.select({ max: sql<number>`COALESCE(MAX(${interestOptions.sortOrder}), -1)` })
			.from(interestOptions);
		const nextOrder = (maxResult[0]?.max ?? -1) + 1;

		try {
			await db.insert(interestOptions).values({ name, sortOrder: nextOrder });
		} catch (err: any) {
			if (err?.code === '23505') {
				return fail(400, { error: 'An interest with that name already exists.' });
			}
			return fail(500, { error: 'Failed to add interest.' });
		}

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (locals.member?.adminRole !== 'super_admin') {
			return fail(403, { error: 'Only super admins can manage interests.' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Interest ID is required.' });
		}

		await db.delete(interestOptions).where(eq(interestOptions.id, id));

		return { success: true };
	}
};
