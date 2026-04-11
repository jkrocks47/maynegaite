import { fail } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { eventCheckins, eventRsvps, events } from '$lib/server/db/schema';
import { getBatchEstimatedTurnout, getHistoricalTurnoutRate } from '$lib/server/db/queries';
import { processAndStoreImage, deleteImage } from '$lib/server/images';
import { checkinQuestionsArraySchema, eventSchema } from '$lib/utils/validation';
import type { Actions, PageServerLoad } from './$types';

export const config = { body: { maxSize: '25mb' } };

function generateCheckinCode(): string {
	return randomBytes(3).toString('hex').toUpperCase();
}

export const load: PageServerLoad = async () => {
	const allEvents = await db.select().from(events).orderBy(desc(events.date));
	const eventIds = allEvents.map((event) => event.id);

	const rsvpCounts =
		eventIds.length > 0
			? await db
					.select({
						eventId: eventRsvps.eventId,
						status: eventRsvps.status,
						count: sql<number>`count(*)::int`
					})
					.from(eventRsvps)
					.where(inArray(eventRsvps.eventId, eventIds))
					.groupBy(eventRsvps.eventId, eventRsvps.status)
			: [];

	const checkinCounts =
		eventIds.length > 0
			? await db
					.select({
						eventId: eventCheckins.eventId,
						count: sql<number>`count(*)::int`
					})
					.from(eventCheckins)
					.where(inArray(eventCheckins.eventId, eventIds))
					.groupBy(eventCheckins.eventId)
			: [];

	const rsvpMap: Record<
		string,
		{ going: number; maybe: number; not_going: number }
	> = {};
	for (const row of rsvpCounts) {
		if (!rsvpMap[row.eventId]) {
			rsvpMap[row.eventId] = { going: 0, maybe: 0, not_going: 0 };
		}
		rsvpMap[row.eventId][row.status] = row.count;
	}

	const checkinMap: Record<string, number> = {};
	for (const row of checkinCounts) {
		checkinMap[row.eventId] = row.count;
	}

	const turnoutMap = await getBatchEstimatedTurnout(eventIds);
	const historicalRate = await getHistoricalTurnoutRate();

	const eventsWithStats = allEvents.map((event) => ({
		...event,
		rsvpCounts: rsvpMap[event.id] ?? { going: 0, maybe: 0, not_going: 0 },
		attendanceCount: checkinMap[event.id] ?? 0,
		estimatedTurnout: turnoutMap.get(event.id) ?? 0
	}));

	return {
		events: eventsWithStats,
		historicalRate
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();

		const maxAttendeesRaw = (formData.get('maxAttendees') as string) || '';
		const maxAttendees = maxAttendeesRaw ? Number(maxAttendeesRaw) : undefined;

		const parsed = eventSchema.safeParse({
			title: (formData.get('title') as string) ?? '',
			description: ((formData.get('description') as string) || '').trim() || undefined,
			date: (formData.get('date') as string) ?? '',
			time: ((formData.get('time') as string) || '').trim() || undefined,
			location: ((formData.get('location') as string) || '').trim() || undefined,
			locationUrl: ((formData.get('locationUrl') as string) || '').trim() || undefined,
			eventCategory: (formData.get('eventCategory') as string) ?? 'community',
			isPublished: formData.get('isPublished') === 'on',
			maxAttendees
		});

		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message || 'Invalid event data.'
			});
		}

		let imageUrl: string | null = null;
		let imageGroupId: string | null = null;

		const imageFile = formData.get('image');
		if (imageFile instanceof File && imageFile.size > 0) {
			try {
				const upload = await processAndStoreImage(imageFile);
				imageUrl = upload.url;
				imageGroupId = upload.groupId;
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Image upload failed.';
				return fail(400, { error: message });
			}
		}

		let checkinQuestions: unknown = null;
		const checkinQuestionsRaw = formData.get('checkinQuestions');
		if (typeof checkinQuestionsRaw === 'string' && checkinQuestionsRaw.length > 0) {
			try {
				const parsedQuestions = checkinQuestionsArraySchema.safeParse(
					JSON.parse(checkinQuestionsRaw)
				);
				if (!parsedQuestions.success) {
					return fail(400, { error: 'Invalid check-in questions.' });
				}
				checkinQuestions =
					parsedQuestions.data.length > 0 ? parsedQuestions.data : null;
			} catch {
				return fail(400, { error: 'Invalid check-in questions payload.' });
			}
		}

		await db.insert(events).values({
			title: parsed.data.title,
			description: parsed.data.description || null,
			date: parsed.data.date,
			time: parsed.data.time || null,
			location: parsed.data.location || null,
			locationUrl: parsed.data.locationUrl || null,
			eventCategory: parsed.data.eventCategory,
			imageUrl,
			imageGroupId,
			isPublished: parsed.data.isPublished,
			maxAttendees: parsed.data.maxAttendees || null,
			checkinCode: generateCheckinCode(),
			checkinQuestions: checkinQuestions as any,
			createdBy: locals.member?.id
		});

		return { success: true };
	},

	edit: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Event ID is required.' });
		}

		const [existing] = await db.select().from(events).where(eq(events.id, id)).limit(1);
		if (!existing) {
			return fail(404, { error: 'Event not found.' });
		}

		const maxAttendeesRaw = (formData.get('maxAttendees') as string) || '';
		const maxAttendees = maxAttendeesRaw ? Number(maxAttendeesRaw) : undefined;

		const parsed = eventSchema.safeParse({
			title: (formData.get('title') as string) ?? '',
			description: ((formData.get('description') as string) || '').trim() || undefined,
			date: (formData.get('date') as string) ?? '',
			time: ((formData.get('time') as string) || '').trim() || undefined,
			location: ((formData.get('location') as string) || '').trim() || undefined,
			locationUrl: ((formData.get('locationUrl') as string) || '').trim() || undefined,
			eventCategory: (formData.get('eventCategory') as string) ?? 'community',
			isPublished: formData.get('isPublished') === 'on',
			maxAttendees
		});

		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message || 'Invalid event data.'
			});
		}

		let nextImageUrl: string | null | undefined = undefined;
		let nextImageGroupId: string | null | undefined = undefined;

		const imageFile = formData.get('image');
		if (imageFile instanceof File && imageFile.size > 0) {
			try {
				const upload = await processAndStoreImage(imageFile);
				nextImageUrl = upload.url;
				nextImageGroupId = upload.groupId;
				if (existing.imageGroupId) {
					await deleteImage(existing.imageGroupId);
				}
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Image upload failed.';
				return fail(400, { error: message });
			}
		} else if (formData.get('removeImage') === 'on' && existing.imageGroupId) {
			await deleteImage(existing.imageGroupId);
			nextImageUrl = null;
			nextImageGroupId = null;
		}

		let checkinQuestions: unknown = undefined;
		const checkinQuestionsRaw = formData.get('checkinQuestions');
		if (typeof checkinQuestionsRaw === 'string') {
			try {
				const parsedQuestions = checkinQuestionsArraySchema.safeParse(
					JSON.parse(checkinQuestionsRaw)
				);
				if (!parsedQuestions.success) {
					return fail(400, { error: 'Invalid check-in questions.' });
				}
				checkinQuestions =
					parsedQuestions.data.length > 0 ? parsedQuestions.data : null;
			} catch {
				return fail(400, { error: 'Invalid check-in questions payload.' });
			}
		}

		await db
			.update(events)
			.set({
				title: parsed.data.title,
				description: parsed.data.description || null,
				date: parsed.data.date,
				time: parsed.data.time || null,
				location: parsed.data.location || null,
				locationUrl: parsed.data.locationUrl || null,
				eventCategory: parsed.data.eventCategory,
				isPublished: parsed.data.isPublished,
				maxAttendees: parsed.data.maxAttendees || null,
				imageUrl: nextImageUrl,
				imageGroupId: nextImageGroupId,
				checkinQuestions: checkinQuestions as any,
				updatedAt: new Date()
			})
			.where(eq(events.id, id));

		return { success: true };
	},

	togglePublish: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) {
			return fail(400, { error: 'Event ID is required.' });
		}

		const [event] = await db
			.select({ isPublished: events.isPublished })
			.from(events)
			.where(eq(events.id, id))
			.limit(1);

		if (!event) {
			return fail(404, { error: 'Event not found.' });
		}

		await db
			.update(events)
			.set({ isPublished: !event.isPublished, updatedAt: new Date() })
			.where(eq(events.id, id));

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) {
			return fail(400, { error: 'Event ID is required.' });
		}

		const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
		if (!event) {
			return fail(404, { error: 'Event not found.' });
		}

		if (event.imageGroupId) {
			await deleteImage(event.imageGroupId);
		}

		await db.delete(events).where(eq(events.id, id));
		return { success: true };
	}
};
