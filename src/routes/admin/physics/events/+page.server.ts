import { fail } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { eq, desc, and, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, eventRsvps, eventCheckins } from '$lib/server/db/schema';
import { eventSchema } from '$lib/utils/validation';
import { uploadImage, deleteImage } from '$lib/server/cloudinary';
import type { Actions, PageServerLoad } from './$types';

function generateCheckinCode(): string {
	return randomBytes(3).toString('hex').toUpperCase();
}

export const load: PageServerLoad = async () => {
	const allEvents = await db
		.select()
		.from(events)
		.where(eq(events.clubType, 'physics'))
		.orderBy(desc(events.date));

	const eventIds = allEvents.map((e) => e.id);

	const rsvpCounts =
		eventIds.length > 0
			? await db
					.select({
						eventId: eventRsvps.eventId,
						status: eventRsvps.status,
						count: sql<number>`count(*)`
					})
					.from(eventRsvps)
					.where(sql`${eventRsvps.eventId} IN ${eventIds}`)
					.groupBy(eventRsvps.eventId, eventRsvps.status)
			: [];

	const checkinCounts =
		eventIds.length > 0
			? await db
					.select({
						eventId: eventCheckins.eventId,
						count: sql<number>`count(*)`
					})
					.from(eventCheckins)
					.where(sql`${eventCheckins.eventId} IN ${eventIds}`)
					.groupBy(eventCheckins.eventId)
			: [];

	const rsvpMap: Record<string, { going: number; maybe: number; not_going: number }> = {};
	for (const row of rsvpCounts) {
		if (!rsvpMap[row.eventId]) rsvpMap[row.eventId] = { going: 0, maybe: 0, not_going: 0 };
		rsvpMap[row.eventId][row.status] = Number(row.count);
	}

	const checkinMap: Record<string, number> = {};
	for (const row of checkinCounts) {
		checkinMap[row.eventId] = Number(row.count);
	}

	const eventsWithStats = allEvents.map((e) => ({
		...e,
		rsvpCounts: rsvpMap[e.id] || { going: 0, maybe: 0, not_going: 0 },
		attendanceCount: checkinMap[e.id] || 0
	}));

	return { events: eventsWithStats };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();

		const data = {
			title: formData.get('title') as string,
			description: formData.get('description') as string,
			date: formData.get('date') as string,
			time: formData.get('time') as string,
			location: formData.get('location') as string,
			locationUrl: formData.get('locationUrl') as string,
			clubType: 'physics' as const,
			isPublished: formData.get('isPublished') === 'on',
			maxAttendees: formData.get('maxAttendees')
				? Number(formData.get('maxAttendees'))
				: undefined
		};

		const parsed = eventSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: 'Invalid event data. Please check all required fields.' });
		}

		let imageUrl: string | null = null;
		let imagePublicId: string | null = null;

		const imageFile = formData.get('image') as File | null;
		if (imageFile && imageFile.size > 0) {
			try {
				const result = await uploadImage(imageFile, 'uicspacetime/physics/events');
				imageUrl = result.url;
				imagePublicId = result.publicId;
			} catch {
				return fail(500, { error: 'Failed to upload image. Please try again.' });
			}
		}

		await db.insert(events).values({
			title: parsed.data.title,
			description: parsed.data.description || null,
			date: parsed.data.date,
			time: parsed.data.time || null,
			location: parsed.data.location || null,
			locationUrl: parsed.data.locationUrl || null,
			clubType: 'physics',
			imageUrl,
			imagePublicId,
			isPublished: parsed.data.isPublished,
			maxAttendees: parsed.data.maxAttendees || null,
			checkinCode: generateCheckinCode(),
			createdBy: locals.user?.id
		});

		return { success: true };
	},

	edit: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'Event ID is required.' });

		const data = {
			title: formData.get('title') as string,
			description: formData.get('description') as string,
			date: formData.get('date') as string,
			time: formData.get('time') as string,
			location: formData.get('location') as string,
			locationUrl: formData.get('locationUrl') as string,
			clubType: 'physics' as const,
			isPublished: formData.get('isPublished') === 'on',
			maxAttendees: formData.get('maxAttendees')
				? Number(formData.get('maxAttendees'))
				: undefined
		};

		const parsed = eventSchema.safeParse(data);
		if (!parsed.success) return fail(400, { error: 'Invalid event data.' });

		await db
			.update(events)
			.set({
				title: parsed.data.title,
				description: parsed.data.description || null,
				date: parsed.data.date,
				time: parsed.data.time || null,
				location: parsed.data.location || null,
				locationUrl: parsed.data.locationUrl || null,
				isPublished: parsed.data.isPublished,
				maxAttendees: parsed.data.maxAttendees || null,
				updatedAt: new Date()
			})
			.where(and(eq(events.id, id), eq(events.clubType, 'physics')));

		return { success: true };
	},

	togglePublish: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'Event ID is required.' });

		const result = await db
			.select({ isPublished: events.isPublished })
			.from(events)
			.where(and(eq(events.id, id), eq(events.clubType, 'physics')))
			.limit(1);

		if (result.length === 0) return fail(404, { error: 'Event not found.' });

		await db
			.update(events)
			.set({ isPublished: !result[0].isPublished, updatedAt: new Date() })
			.where(eq(events.id, id));

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'Event ID is required.' });

		const result = await db
			.select()
			.from(events)
			.where(and(eq(events.id, id), eq(events.clubType, 'physics')))
			.limit(1);

		if (result.length === 0) return fail(404, { error: 'Event not found.' });

		if (result[0].imagePublicId) {
			try {
				await deleteImage(result[0].imagePublicId);
			} catch {
				// Continue
			}
		}

		await db
			.delete(events)
			.where(and(eq(events.id, id), eq(events.clubType, 'physics')));

		return { success: true };
	}
};
