import { Resend } from 'resend';
import { SITE_NAME } from '$lib/utils/constants';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

function escapeHtml(str: string | null | undefined): string {
	if (!str) return '';
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function getResend() {
	return new Resend(env.RESEND_API_KEY);
}

const FROM_EMAIL = 'Maynegaite POA <noreply@maynegaite.com>';

export function getBaseUrl() {
	return publicEnv.PUBLIC_BASE_URL || 'https://maynegaite.com';
}

function buildUnsubscribeFooter(unsubscribeToken: string): string {
	const unsubscribeUrl = `${getBaseUrl()}/unsubscribe?token=${unsubscribeToken}`;
	return `
    <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #E8E0D4;">
      <p style="font-size: 0.75rem; color: #8C8278; margin: 0;">
        Don't want to receive these emails? <a href="${unsubscribeUrl}" style="color: #1B4332; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>`;
}

function getUnsubscribeHeaders(unsubscribeToken: string) {
	const unsubscribeUrl = `${getBaseUrl()}/unsubscribe?token=${unsubscribeToken}`;
	return {
		'List-Unsubscribe': `<${unsubscribeUrl}>`,
		'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
	};
}

function emailWrapper(content: string): string {
	return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #FAF7F2; color: #2D2A26; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; padding: 2rem; border: 1px solid #E8E0D4;">
    <h1 style="font-size: 1.5rem; color: #1B4332; margin-bottom: 0.5rem;">${SITE_NAME}</h1>
    ${content}
  </div>
</body>
</html>`;
}

export async function sendVerificationEmail(email: string, token: string, name: string) {
	const resend = getResend();
	const verifyUrl = `${getBaseUrl()}/verify-email?token=${token}`;

	await resend.emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: `Verify your ${SITE_NAME} account`,
		html: emailWrapper(`
    <p style="color: #8C8278; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Email Verification</p>
    <p>Hi ${escapeHtml(name)},</p>
    <p>Welcome to ${SITE_NAME}! Please verify your email address to access your homeowner portal.</p>
    <a href="${verifyUrl}" style="display: inline-block; background: #1B4332; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">Verify Email</a>
    <p style="font-size: 0.85rem; color: #8C8278;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>`)
	});
}

export async function sendContactEmail(
	senderName: string,
	senderEmail: string,
	message: string,
	recipientEmails: string[]
) {
	const resend = getResend();

	await resend.emails.send({
		from: FROM_EMAIL,
		to: recipientEmails,
		replyTo: senderEmail,
		subject: `[${SITE_NAME}] New message from ${senderName}`,
		html: emailWrapper(`
    <p style="color: #8C8278; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Contact Form Submission</p>
    <p><strong style="color: #1B4332;">From:</strong> ${escapeHtml(senderName)} (${escapeHtml(senderEmail)})</p>
    <div style="margin: 1rem 0; padding: 1rem; background: #FAF7F2; border-radius: 8px; border-left: 3px solid #C9A84C;">
      <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(message)}</p>
    </div>
    <p style="font-size: 0.85rem; color: #8C8278;">Reply directly to this email to respond to ${escapeHtml(senderName)}.</p>`)
	});
}

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
	const resend = getResend();
	const resetUrl = `${getBaseUrl()}/reset-password?token=${token}`;

	await resend.emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: `Reset your ${SITE_NAME} password`,
		html: emailWrapper(`
    <p style="color: #8C8278; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Password Reset</p>
    <p>Hi ${escapeHtml(name)},</p>
    <p>We received a request to reset your password. Click the button below to set a new password.</p>
    <a href="${resetUrl}" style="display: inline-block; background: #1B4332; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">Reset Password</a>
    <p style="font-size: 0.85rem; color: #8C8278;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>`)
	});
}

export async function sendEventCorrectionEmail(
	email: string,
	firstName: string,
	event: {
		title: string;
		date: string;
		time: string | null;
		location: string | null;
	},
	eventUrl: string,
	unsubscribeToken: string
) {
	const resend = getResend();
	const dateFormatted = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	await resend.emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: `[${SITE_NAME}] Correction: ${event.title}`,
		headers: getUnsubscribeHeaders(unsubscribeToken),
		html: emailWrapper(`
    <p style="color: #8C8278; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Event Correction</p>
    <p>Hi ${escapeHtml(firstName)},</p>
    <p>We sent you incorrect details for an upcoming event. Here are the <strong style="color: #1B4332;">corrected</strong> details:</p>
    <div style="margin: 1rem 0; padding: 1rem; background: #FAF7F2; border-radius: 8px; border-left: 3px solid #B8860B;">
      <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #1B4332;">${escapeHtml(event.title)}</p>
      <p style="margin: 0 0 0.25rem 0; font-size: 0.9rem;">${dateFormatted}${event.time ? ` at ${escapeHtml(event.time)}` : ''}</p>
      ${event.location ? `<p style="margin: 0; font-size: 0.9rem;">${escapeHtml(event.location)}</p>` : ''}
    </div>
    <p style="font-size: 0.85rem; color: #B8860B;">Please disregard the previous email with incorrect information.</p>
    <a href="${eventUrl}" style="display: inline-block; background: #1B4332; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">View Event &amp; RSVP</a>
    <p style="font-size: 0.85rem; color: #8C8278;">You're receiving this because you're a member of ${SITE_NAME}.</p>
    ${buildUnsubscribeFooter(unsubscribeToken)}`)
	});
}

export async function sendEventAnnouncementEmail(
	email: string,
	firstName: string,
	event: {
		title: string;
		date: string;
		time: string | null;
		location: string | null;
	},
	eventUrl: string,
	unsubscribeToken: string
) {
	const resend = getResend();
	const dateFormatted = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	await resend.emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: `[${SITE_NAME}] ${event.title}`,
		headers: getUnsubscribeHeaders(unsubscribeToken),
		html: emailWrapper(`
    <p style="color: #8C8278; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Community Event</p>
    <p>Hi ${escapeHtml(firstName)},</p>
    <p>We have an upcoming community event!</p>
    <div style="margin: 1rem 0; padding: 1rem; background: #FAF7F2; border-radius: 8px; border-left: 3px solid #1B4332;">
      <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #1B4332;">${escapeHtml(event.title)}</p>
      <p style="margin: 0 0 0.25rem 0; font-size: 0.9rem;">${dateFormatted}${event.time ? ` at ${escapeHtml(event.time)}` : ''}</p>
      ${event.location ? `<p style="margin: 0; font-size: 0.9rem;">${escapeHtml(event.location)}</p>` : ''}
    </div>
    <a href="${eventUrl}" style="display: inline-block; background: #1B4332; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">View Event &amp; RSVP</a>
    <p style="font-size: 0.85rem; color: #8C8278;">You're receiving this because you're a member of ${SITE_NAME}.</p>
    ${buildUnsubscribeFooter(unsubscribeToken)}`)
	});
}
