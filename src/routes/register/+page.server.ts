import { randomBytes } from 'crypto';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members } from '$lib/server/db/schema';
import {
	hashPassword,
	createMemberSession,
	generateVerificationToken
} from '$lib/server/auth';
import { sendVerificationEmail } from '$lib/server/email';
import { registrationSchema } from '$lib/utils/validation';
import { checkHoneypot, checkRateLimit, checkSubmissionTiming, generateChallenge, checkProofOfWork } from '$lib/server/security';
import type { Actions, PageServerLoad } from './$types';

function safeRedirect(redirectTo: string | null): string {
	if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
		return redirectTo;
	}
	return '/dashboard';
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const redirectTo = url.searchParams.get('redirectTo');
	if (locals.member) {
		throw redirect(303, safeRedirect(redirectTo));
	}
	const pow = generateChallenge();
	return { redirectTo, challenge: pow.challenge, difficulty: pow.difficulty };
};

export const actions: Actions = {
	register: async (event) => {
		const rateLimited = checkRateLimit(event, 'auth-moderate');
		if (rateLimited) return rateLimited;

		const { request, cookies } = event;
		const formData = await request.formData();

		const honeypotFail = checkHoneypot(formData);
		if (honeypotFail) return honeypotFail;

		const timingFail = checkSubmissionTiming(formData);
		if (timingFail) return timingFail;

		const powFail = await checkProofOfWork(formData);
		if (powFail) return powFail;

		const redirectTo = formData.get('redirectTo') as string | null;

		const lotNumberRaw = formData.get('lotNumber') as string;

		const data = {
			email: (formData.get('email') as string)?.toLowerCase().trim(),
			password: formData.get('password') as string,
			firstName: (formData.get('firstName') as string)?.trim(),
			lastName: (formData.get('lastName') as string)?.trim(),
			phone: (formData.get('phone') as string)?.trim() || undefined,
			address: (formData.get('address') as string)?.trim() || undefined,
			lotNumber: lotNumberRaw ? parseInt(lotNumberRaw) : undefined,
			section: (formData.get('section') as string) || undefined
		};

		const parsed = registrationSchema.safeParse(data);
		if (!parsed.success) {
			const firstError = parsed.error.issues[0]?.message || 'Invalid input';
			return fail(400, { error: firstError, email: data.email, firstName: data.firstName, lastName: data.lastName });
		}

		const existing = await db
			.select({ id: members.id })
			.from(members)
			.where(eq(members.email, parsed.data.email))
			.limit(1);

		if (existing.length > 0) {
			return fail(400, { error: 'An account with this email already exists. Try logging in instead.', email: data.email });
		}

		const passwordHash = await hashPassword(parsed.data.password);
		const displayName = `${parsed.data.firstName} ${parsed.data.lastName}`;

		let member;
		try {
			[member] = await db
				.insert(members)
				.values({
					email: parsed.data.email,
					passwordHash,
					firstName: parsed.data.firstName,
					lastName: parsed.data.lastName,
					displayName,
					phone: parsed.data.phone || null,
					address: parsed.data.address || null,
					lotNumber: parsed.data.lotNumber || null,
					section: (parsed.data.section as 'woods') || null,
					unsubscribeToken: randomBytes(32).toString('hex')
				})
				.returning({ id: members.id });
		} catch (err) {
			console.error('[Register] INSERT failed:', err);
			return fail(500, { error: 'Registration failed. Please try again.', email: data.email, firstName: data.firstName, lastName: data.lastName });
		}

		if (!member) {
			console.error('[Register] INSERT returned no rows');
			return fail(500, { error: 'Registration failed. Please try again.', email: data.email, firstName: data.firstName, lastName: data.lastName });
		}

		const token = await generateVerificationToken(member.id);
		try {
			await sendVerificationEmail(parsed.data.email, token, parsed.data.firstName);
		} catch {
			// Don't fail registration if email fails
		}

		const sessionToken = await createMemberSession(member.id);
		cookies.set('member_session', sessionToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 30 * 24 * 60 * 60
		});

		throw redirect(303, safeRedirect(redirectTo));
	}
};
