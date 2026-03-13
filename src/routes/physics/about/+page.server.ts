import { eq, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { clubInfo, officers } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const infoResult = await db
		.select()
		.from(clubInfo)
		.where(eq(clubInfo.clubType, 'physics'))
		.limit(1);

	const officersList = await db
		.select()
		.from(officers)
		.where(eq(officers.clubType, 'physics'))
		.orderBy(asc(officers.sortOrder));

	return {
		clubInfo: infoResult[0] ?? null,
		officers: officersList
	};
};
