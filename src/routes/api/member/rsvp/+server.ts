import { json, error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { eventRsvps, events } from '$lib/server/db/schema';
import { rsvpSchema } from '$lib/utils/validation';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.member) {
		error(401, 'You must be logged in to RSVP.');
	}

	if (!locals.member.emailVerified) {
		error(403, 'Please verify your email before RSVPing.');
	}

	const body = await request.json();
	const parsed = rsvpSchema.safeParse(body);

	if (!parsed.success) {
		error(400, 'Invalid RSVP data.');
	}

	// Verify event exists and is published
	const eventResult = await db
		.select({ id: events.id })
		.from(events)
		.where(and(eq(events.id, parsed.data.eventId), eq(events.isPublished, true)))
		.limit(1);

	if (eventResult.length === 0) {
		error(404, 'Event not found.');
	}

	// Upsert RSVP
	const existing = await db
		.select({ id: eventRsvps.id })
		.from(eventRsvps)
		.where(
			and(
				eq(eventRsvps.eventId, parsed.data.eventId),
				eq(eventRsvps.memberId, locals.member.id)
			)
		)
		.limit(1);

	if (existing.length > 0) {
		await db
			.update(eventRsvps)
			.set({ status: parsed.data.status, updatedAt: new Date() })
			.where(eq(eventRsvps.id, existing[0].id));
	} else {
		await db.insert(eventRsvps).values({
			eventId: parsed.data.eventId,
			memberId: locals.member.id,
			status: parsed.data.status
		});
	}

	return json({ success: true, status: parsed.data.status });
};
