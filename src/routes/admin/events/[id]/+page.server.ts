import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { eventAnnouncementLogs, events } from '$lib/server/db/schema';
import {
	getAnnouncementRecipientCount,
	getAnnouncementRecipients,
	getCorrectionRecipients,
	getEventDetailForAdmin
} from '$lib/server/db/queries';
import {
	getBaseUrl,
	sendEventAnnouncementEmail,
	sendEventCorrectionEmail
} from '$lib/server/email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const result = await getEventDetailForAdmin(params.id);
	if (!result) {
		error(404, 'Event not found.');
	}

	const announcementRecipientCount = await getAnnouncementRecipientCount(params.id);

	return {
		event: result.event,
		rsvpList: result.rsvpList,
		stats: result.stats,
		historicalRate: result.historicalRate,
		announcementRecipientCount,
		announcementAlreadySent: !!result.event.announcementSentAt,
		checkinQuestions: result.event.checkinQuestions ?? [],
		checkinResponses: result.checkinResponses
	};
};

export const actions: Actions = {
	sendAnnouncement: async ({ params }) => {
		const [event] = await db.select().from(events).where(eq(events.id, params.id)).limit(1);
		if (!event) {
			return fail(404, { error: 'Event not found.' });
		}

		const recipients = await getAnnouncementRecipients(params.id);
		if (recipients.length === 0) {
			return fail(400, { error: 'No eligible recipients.' });
		}

		const eventUrl = `${getBaseUrl()}/events/${params.id}`;
		let sentCount = 0;

		for (const recipient of recipients) {
			try {
				await sendEventAnnouncementEmail(
					recipient.email,
					recipient.firstName,
					{
						title: event.title,
						date: event.date,
						time: event.time,
						location: event.location
					},
					eventUrl,
					recipient.unsubscribeToken
				);

				await db
					.insert(eventAnnouncementLogs)
					.values({
						eventId: params.id,
						memberId: recipient.id
					})
					.onConflictDoNothing();

				sentCount++;
			} catch (err) {
				console.error(`[Announcement] Failed to send to ${recipient.email}:`, err);
			}
		}

		if (sentCount > 0) {
			await db
				.update(events)
				.set({ announcementSentAt: new Date() })
				.where(eq(events.id, params.id));
		}

		return { success: true, sentCount };
	},

	sendCorrection: async ({ params }) => {
		const [event] = await db.select().from(events).where(eq(events.id, params.id)).limit(1);
		if (!event) {
			return fail(404, { error: 'Event not found.' });
		}

		if (!event.announcementSentAt) {
			return fail(400, { error: 'No announcement has been sent for this event yet.' });
		}

		const recipients = await getCorrectionRecipients(params.id);
		if (recipients.length === 0) {
			return fail(400, { error: 'No recipients to send correction to.' });
		}

		const eventUrl = `${getBaseUrl()}/events/${params.id}`;
		let sentCount = 0;

		for (const recipient of recipients) {
			try {
				await sendEventCorrectionEmail(
					recipient.email,
					recipient.firstName,
					{
						title: event.title,
						date: event.date,
						time: event.time,
						location: event.location
					},
					eventUrl,
					recipient.unsubscribeToken
				);
				sentCount++;
			} catch (err) {
				console.error(`[Correction] Failed to send to ${recipient.email}:`, err);
			}
		}

		return { success: true, sentCount };
	}
};
