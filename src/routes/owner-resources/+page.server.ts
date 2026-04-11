import { asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { officers } from '$lib/server/db/schema';
import { getContentWithDefaults } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	// ensure they don't stay for very long once added
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=60'
	});

	const [boardMembers, content] = await Promise.all([
		db.select().from(officers).orderBy(asc(officers.sortOrder)),
		getContentWithDefaults('owner-resources')
	]);

	return {
		officers: boardMembers,
		content
	};
};
