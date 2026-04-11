import { eq, and, gte, lt, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, eventRsvps, eventCheckins } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const member = locals.member!;
	const today = new Date().toISOString().split('T')[0];

	// Upcoming RSVP'd events
	const upcoming = await db
		.select({
			eventId: events.id,
			title: events.title,
			date: events.date,
			time: events.time,
			location: events.location,
			eventCategory: events.eventCategory,
			rsvpStatus: eventRsvps.status
		})
		.from(eventRsvps)
		.innerJoin(events, eq(eventRsvps.eventId, events.id))
		.where(
			and(
				eq(eventRsvps.memberId, member.id),
				gte(events.date, today),
				eq(events.isPublished, true)
			)
		)
		.orderBy(events.date);

	// Past events attended (check-ins)
	const attended = await db
		.select({
			eventId: events.id,
			title: events.title,
			date: events.date,
			eventCategory: events.eventCategory,
			checkedInAt: eventCheckins.checkedInAt
		})
		.from(eventCheckins)
		.innerJoin(events, eq(eventCheckins.eventId, events.id))
		.where(eq(eventCheckins.memberId, member.id))
		.orderBy(desc(eventCheckins.checkedInAt));

	return { upcoming, attended };
};
