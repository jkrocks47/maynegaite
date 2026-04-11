import type { PageServerLoad } from './$types';
import { and, gte, asc, desc, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, announcements, communityInfo } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });

		const [upcomingEvents, recentAnnouncements, community] = await Promise.all([
			db
				.select({
					id: events.id,
					title: events.title,
					description: events.description,
					date: events.date,
					time: events.time,
					location: events.location,
					eventCategory: events.eventCategory,
					imageUrl: events.imageUrl
				})
				.from(events)
				.where(and(sql`${events.isPublished} = true`, gte(events.date, today)))
				.orderBy(asc(events.date))
				.limit(6),
			db
				.select()
				.from(announcements)
				.where(
					sql`(${announcements.publishAt} IS NULL OR ${announcements.publishAt} <= NOW()) AND (${announcements.expiresAt} IS NULL OR ${announcements.expiresAt} > NOW())`
				)
				.orderBy(desc(announcements.isPinned), desc(announcements.createdAt))
				.limit(3),
			db.select().from(communityInfo).limit(1)
		]);

		return {
			upcomingEvents,
			recentAnnouncements,
			communityInfo: community[0] ?? null,
			isLoggedIn: !!locals.member,
			isVerified: locals.member?.emailVerified ?? false,
			member: locals.member
		};
	} catch (e) {
		console.error('Failed to load homepage data:', e);
		return {
			upcomingEvents: [],
			recentAnnouncements: [],
			communityInfo: null,
			isLoggedIn: false,
			isVerified: false,
			member: null
		};
	}
};
