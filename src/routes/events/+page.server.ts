import { asc, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const allEvents = await db
		.select()
		.from(events)
		.where(sql`${events.isPublished} = true`)
		.orderBy(asc(events.date));

	return {
		events: allEvents,
		isLoggedIn: !!locals.member,
		isVerified: locals.member?.emailVerified ?? false
	};
};
