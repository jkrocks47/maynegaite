import { eq, and, sql } from 'drizzle-orm';
import { db } from './db';
import { events, eventRsvps, members, reminderLogs } from './db/schema';
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';
import { SITE_NAME } from '$lib/utils/constants';
import { getBaseUrl } from './email';

const FROM_EMAIL = 'Maynegaite POA <noreply@maynegaite.com>';
const POLL_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

let intervalId: ReturnType<typeof setInterval> | null = null;
let isProcessing = false;

export function startReminderScheduler(): void {
	if (intervalId !== null) return;

	console.log('[Reminders] Scheduler started, polling every 15 minutes');

	processReminders().catch((err) => console.error('[Reminders] Error:', err));

	intervalId = setInterval(() => {
		processReminders().catch((err) => console.error('[Reminders] Error:', err));
	}, POLL_INTERVAL_MS);
}

export function stopReminderScheduler(): void {
	if (intervalId !== null) {
		clearInterval(intervalId);
		intervalId = null;
	}
}

function getChicagoDateString(daysFromNow: number): string {
	const date = new Date();
	date.setDate(date.getDate() + daysFromNow);
	const parts = date
		.toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })
		.split('-');
	return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
}

async function processReminders(): Promise<void> {
	if (isProcessing) return;
	isProcessing = true;

	try {
		const in7Days = getChicagoDateString(7);
		const in1Day = getChicagoDateString(1);
		const today = getChicagoDateString(0);

		await sendRemindersForDate(in7Days, '7_day');
		await sendRemindersForDate(in1Day, '1_day');
		await sendRemindersForDate(today, 'day_of');
	} finally {
		isProcessing = false;
	}
}

interface PendingReminder {
	eventId: string;
	eventTitle: string;
	eventDate: string;
	eventTime: string | null;
	eventLocation: string | null;
	memberId: string;
	memberEmail: string;
	memberFirstName: string;
	rsvpStatus: string;
	unsubscribeToken: string;
}

async function sendRemindersForDate(
	targetDate: string,
	reminderType: '7_day' | '1_day' | 'day_of'
): Promise<void> {
	const pendingReminders: PendingReminder[] = await db
		.select({
			eventId: events.id,
			eventTitle: events.title,
			eventDate: events.date,
			eventTime: events.time,
			eventLocation: events.location,
			memberId: members.id,
			memberEmail: members.email,
			memberFirstName: members.firstName,
			rsvpStatus: eventRsvps.status,
			unsubscribeToken: members.unsubscribeToken
		})
		.from(eventRsvps)
		.innerJoin(events, eq(eventRsvps.eventId, events.id))
		.innerJoin(members, eq(eventRsvps.memberId, members.id))
		.where(
			and(
				eq(events.date, targetDate),
				eq(events.isPublished, true),
				eq(members.emailVerified, true),
				eq(members.emailOptOut, false),
				sql`${eventRsvps.status} IN ('going', 'maybe')`,
				sql`NOT EXISTS (
					SELECT 1 FROM reminder_logs rl
					WHERE rl.event_id = ${eventRsvps.eventId}
						AND rl.member_id = ${eventRsvps.memberId}
						AND rl.reminder_type = ${reminderType}
				)`
			)
		);

	if (pendingReminders.length === 0) return;

	console.log(
		`[Reminders] Sending ${pendingReminders.length} ${reminderType} reminder(s)`
	);

	const resend = new Resend(env.RESEND_API_KEY);

	for (const reminder of pendingReminders) {
		try {
			const html = buildReminderEmail(reminder, reminderType);
			const subject =
				reminderType === '7_day'
					? `Reminder: ${reminder.eventTitle} is in one week`
					: reminderType === '1_day'
						? `Tomorrow: ${reminder.eventTitle}`
						: `Today: ${reminder.eventTitle}`;

			const baseUrl = getBaseUrl();
			const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${reminder.unsubscribeToken}`;

			await resend.emails.send({
				from: FROM_EMAIL,
				to: reminder.memberEmail,
				subject: `[${SITE_NAME}] ${subject}`,
				headers: {
					'List-Unsubscribe': `<${unsubscribeUrl}>`,
					'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
				},
				html
			});

			await db
				.insert(reminderLogs)
				.values({
					eventId: reminder.eventId,
					memberId: reminder.memberId,
					reminderType,
					rsvpStatus: reminder.rsvpStatus as 'going' | 'maybe' | 'not_going'
				})
				.onConflictDoNothing();

			console.log(
				`[Reminders] Sent ${reminderType} to ${reminder.memberEmail} for "${reminder.eventTitle}"`
			);
		} catch (err) {
			console.error(
				`[Reminders] Failed to send to ${reminder.memberEmail}:`,
				err
			);
		}
	}
}

function buildReminderEmail(
	data: PendingReminder,
	reminderType: '7_day' | '1_day' | 'day_of'
): string {
	const baseUrl = getBaseUrl();
	const timeframe =
		reminderType === '7_day'
			? 'in one week'
			: reminderType === '1_day'
				? 'tomorrow'
				: 'today';

	const dateFormatted = new Date(data.eventDate + 'T00:00:00').toLocaleDateString(
		'en-US',
		{
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}
	);

	const isMaybe = data.rsvpStatus === 'maybe';

	const mainMessage = isMaybe
		? `You marked "maybe" for <strong style="color: #1B4332;">${data.eventTitle}</strong>, which is happening ${timeframe}. We'd love to see you there! If you can make it, update your RSVP to confirm your spot.`
		: `Just a friendly reminder that <strong style="color: #1B4332;">${data.eventTitle}</strong> is ${timeframe}. We're looking forward to seeing you there!`;

	const ctaText = isMaybe ? 'Confirm Your RSVP' : 'View Event Details';

	return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #FAF7F2; color: #2D2A26; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; padding: 2rem; border: 1px solid #E8E0D4;">
    <h1 style="font-size: 1.5rem; color: #1B4332; margin-bottom: 0.5rem;">${SITE_NAME}</h1>
    <p style="color: #8C8278; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Event Reminder</p>
    <p>Hi ${data.memberFirstName},</p>
    <p>${mainMessage}</p>
    <div style="margin: 1rem 0; padding: 1rem; background: #FAF7F2; border-radius: 8px; border-left: 3px solid #1B4332;">
      <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #1B4332;">${data.eventTitle}</p>
      <p style="margin: 0 0 0.25rem 0; font-size: 0.9rem;">${dateFormatted}${data.eventTime ? ` at ${data.eventTime}` : ''}</p>
      ${data.eventLocation ? `<p style="margin: 0; font-size: 0.9rem;">${data.eventLocation}</p>` : ''}
    </div>
    <a href="${baseUrl}/dashboard/events" style="display: inline-block; background: #1B4332; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">${ctaText}</a>
    <p style="font-size: 0.85rem; color: #8C8278;">You're receiving this because you RSVP'd to this event on ${SITE_NAME}.</p>
    <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #E8E0D4;">
      <p style="font-size: 0.75rem; color: #8C8278; margin: 0;">
        Don't want to receive these emails? <a href="${baseUrl}/unsubscribe?token=${data.unsubscribeToken}" style="color: #1B4332; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}
