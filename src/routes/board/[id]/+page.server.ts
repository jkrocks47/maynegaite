import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { officers } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const load: PageServerLoad = async ({ params }) => {
	if (!UUID_RE.test(params.id)) {
		error(404, 'Officer not found');
	}

	const result = await db.select().from(officers).where(eq(officers.id, params.id)).limit(1);

	if (result.length === 0) {
		error(404, 'Officer not found');
	}

	return { officer: result[0] };
};
