import { eq, and, gte, desc, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, eventRsvps, eventCheckins, communityInfo } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const member = locals.member!;
	const now = new Date().toISOString().split('T')[0];

	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

	const [attendedResult] = await db
		.select({ count: sql<number>`count(*)` })
		.from(eventCheckins)
		.where(
			and(
				eq(eventCheckins.memberId, member.id),
				gte(eventCheckins.checkedInAt, sixMonthsAgo)
			)
		);
	const eventsAttended = Number(attendedResult?.count ?? 0);

	const upcomingRsvps = await db
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
				gte(events.date, now),
				sql`${events.isPublished} = true`
			)
		)
		.orderBy(events.date)
		.limit(5);

	const recentCheckins = await db
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
		.orderBy(desc(eventCheckins.checkedInAt))
		.limit(5);

	const community = await db.select().from(communityInfo).limit(1);

	return {
		member,
		eventsAttended,
		upcomingRsvps,
		recentCheckins,
		communityInfo: community[0] ?? null,
		isVerified: member.emailVerified
	};
};
