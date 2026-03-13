import { error, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, eventCheckins } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, locals }) => {
	if (!locals.member) {
		throw redirect(303, `/login?redirect=/checkin/${params.eventId}?code=${url.searchParams.get('code') || ''}`);
	}

	if (!locals.member.emailVerified) {
		throw redirect(303, '/verify-email');
	}

	const code = url.searchParams.get('code');
	if (!code) {
		error(400, 'Missing check-in code.');
	}

	// Find the event by ID and verify checkin code
	const eventResult = await db
		.select({
			id: events.id,
			title: events.title,
			date: events.date,
			clubType: events.clubType,
			checkinCode: events.checkinCode
		})
		.from(events)
		.where(and(eq(events.id, params.eventId), eq(events.isPublished, true)))
		.limit(1);

	if (eventResult.length === 0) {
		error(404, 'Event not found.');
	}

	const event = eventResult[0];

	if (event.checkinCode !== code) {
		error(400, 'Invalid check-in code.');
	}

	// Check if already checked in
	const existing = await db
		.select({ id: eventCheckins.id })
		.from(eventCheckins)
		.where(
			and(
				eq(eventCheckins.eventId, event.id),
				eq(eventCheckins.memberId, locals.member.id)
			)
		)
		.limit(1);

	if (existing.length > 0) {
		return { event, alreadyCheckedIn: true, success: false };
	}

	// Record check-in
	await db.insert(eventCheckins).values({
		eventId: event.id,
		memberId: locals.member.id
	});

	return { event, alreadyCheckedIn: false, success: true };
};
