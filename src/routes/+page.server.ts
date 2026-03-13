import type { PageServerLoad } from './$types';
import { eq, and, gte, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	try {
		const today = new Date().toISOString().split('T')[0];

		const upcomingEvents = await db
			.select({
				id: events.id,
				title: events.title,
				date: events.date,
				time: events.time,
				location: events.location,
				clubType: events.clubType,
				imageUrl: events.imageUrl
			})
			.from(events)
			.where(
				and(
					eq(events.isPublished, true),
					gte(events.date, today)
				)
			)
			.orderBy(asc(events.date))
			.limit(20);

		return { upcomingEvents };
	} catch (e) {
		console.error('Failed to load homepage events:', e);
		return { upcomingEvents: [] };
	}
};
