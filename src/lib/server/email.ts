import { Resend } from 'resend';
import { SITE_NAME } from '$lib/utils/constants';
import { env } from '$env/dynamic/private';

function getResend() {
	return new Resend(env.RESEND_API_KEY);
}

const FROM_EMAIL = 'UICSpacetime <noreply@uicspacetime.org>';

export async function sendVerificationEmail(email: string, token: string, name: string) {
	const resend = getResend();
	const verifyUrl = `${env.PUBLIC_BASE_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

	await resend.emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: `Verify your ${SITE_NAME} account`,
		html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #e5e7eb; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #191923; border-radius: 12px; padding: 2rem; border: 1px solid rgba(79,70,229,0.3);">
    <h1 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">${SITE_NAME}</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Email Verification</p>
    <p>Hi ${name},</p>
    <p>Welcome to ${SITE_NAME}! Please verify your email address to get started.</p>
    <a href="${verifyUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">Verify Email</a>
    <p style="font-size: 0.85rem; color: #9ca3af;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
  </div>
</body>
</html>`
	});
}

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
	const resend = getResend();
	const resetUrl = `${env.PUBLIC_BASE_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

	await resend.emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: `Reset your ${SITE_NAME} password`,
		html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #e5e7eb; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #191923; border-radius: 12px; padding: 2rem; border: 1px solid rgba(79,70,229,0.3);">
    <h1 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">${SITE_NAME}</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Password Reset</p>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to set a new password.</p>
    <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">Reset Password</a>
    <p style="font-size: 0.85rem; color: #9ca3af;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
  </div>
</body>
</html>`
	});
}
