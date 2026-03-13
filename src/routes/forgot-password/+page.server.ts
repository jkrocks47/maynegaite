import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members } from '$lib/server/db/schema';
import { generatePasswordResetToken } from '$lib/server/auth';
import { sendPasswordResetEmail } from '$lib/server/email';
import { passwordResetRequestSchema } from '$lib/utils/validation';
import type { Actions } from './$types';

export const actions: Actions = {
	request: async ({ request }) => {
		const formData = await request.formData();
		const data = { email: (formData.get('email') as string)?.toLowerCase().trim() };

		const parsed = passwordResetRequestSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: 'Please enter a valid email address.' });
		}

		// Always return success to prevent email enumeration
		const result = await db
			.select({ id: members.id, firstName: members.firstName })
			.from(members)
			.where(eq(members.email, parsed.data.email))
			.limit(1);

		if (result.length > 0) {
			const member = result[0];
			const token = await generatePasswordResetToken(member.id);
			try {
				await sendPasswordResetEmail(parsed.data.email, token, member.firstName);
			} catch {
				// Silently fail to prevent enumeration
			}
		}

		return { success: true };
	}
};
