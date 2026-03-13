import { eq, asc, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allEvents = await db
		.select()
		.from(events)
		.where(and(eq(events.clubType, 'astronomy'), eq(events.isPublished, true)))
		.orderBy(asc(events.date));

	return { events: allEvents };
};
