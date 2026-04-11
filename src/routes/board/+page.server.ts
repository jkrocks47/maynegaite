import { asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { officers, communityInfo } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [boardMembers, community] = await Promise.all([
		db.select().from(officers).orderBy(asc(officers.sortOrder)),
		db.select().from(communityInfo).limit(1)
	]);

	return {
		officers: boardMembers,
		communityInfo: community[0] ?? null
	};
};
