import { eq, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { officers } from '$lib/server/db/schema';
import { getContentWithDefaults } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [officersList, content] = await Promise.all([
		db.select().from(officers).where(eq(officers.clubType, 'physics')).orderBy(asc(officers.sortOrder)),
		getContentWithDefaults('physics', 'about')
	]);

	return {
		officers: officersList,
		content
	};
};
