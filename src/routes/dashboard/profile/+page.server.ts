import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members } from '$lib/server/db/schema';
import { profileUpdateSchema } from '$lib/utils/validation';
import { processAndStoreImage, deleteImage } from '$lib/server/images';
import type { Actions, PageServerLoad } from './$types';

export const config = { body: { maxSize: '25mb' } };

export const load: PageServerLoad = async ({ locals }) => {
	const member = locals.member!;

	const result = await db
		.select({
			firstName: members.firstName,
			lastName: members.lastName,
			email: members.email,
			secondaryEmail: members.secondaryEmail,
			phone: members.phone,
			address: members.address,
			lotNumber: members.lotNumber,
			section: members.section,
			directoryOptIn: members.directoryOptIn,
			emailOptOut: members.emailOptOut,
			profileImageUrl: members.profileImageUrl,
			role: members.role
		})
		.from(members)
		.where(eq(members.id, member.id))
		.limit(1);

	if (result.length === 0) {
		error(404, 'Profile not found');
	}

	return { profile: result[0] };
};

export const actions: Actions = {
	update: async ({ request, locals }) => {
		const member = locals.member!;
		const formData = await request.formData();

		const lotNumberRaw = formData.get('lotNumber') as string;

		const data = {
			firstName: (formData.get('firstName') as string)?.trim(),
			lastName: (formData.get('lastName') as string)?.trim(),
			secondaryEmail: (formData.get('secondaryEmail') as string)?.trim() || undefined,
			phone: (formData.get('phone') as string)?.trim() || undefined,
			address: (formData.get('address') as string)?.trim() || undefined,
			lotNumber: lotNumberRaw ? parseInt(lotNumberRaw) : undefined,
			section: (formData.get('section') as string) || undefined,
			directoryOptIn: formData.get('directoryOptIn') === 'on',
			emailOptOut: formData.get('emailOptOut') === 'on'
		};

		const parsed = profileUpdateSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: parsed.error.issues[0]?.message || 'Invalid input' });
		}

		await db
			.update(members)
			.set({
				firstName: parsed.data.firstName,
				lastName: parsed.data.lastName,
				displayName: `${parsed.data.firstName} ${parsed.data.lastName}`,
				secondaryEmail: parsed.data.secondaryEmail || null,
				phone: parsed.data.phone || null,
				address: parsed.data.address || null,
				lotNumber: parsed.data.lotNumber || null,
				section: (parsed.data.section as 'woods' | 'reserves') || null,
				directoryOptIn: parsed.data.directoryOptIn ?? false,
				emailOptOut: parsed.data.emailOptOut ?? false,
				updatedAt: new Date()
			})
			.where(eq(members.id, member.id));

		return { success: true };
	},

	uploadPhoto: async ({ request, locals }) => {
		const member = locals.member!;
		const formData = await request.formData();
		const file = formData.get('photo');

		if (!file || !(file instanceof File) || file.size === 0) {
			return fail(400, { photoError: 'Please select an image to upload.' });
		}

		try {
			const current = await db
				.select({ profileImageUrl: members.profileImageUrl })
				.from(members)
				.where(eq(members.id, member.id))
				.limit(1);

			if (current[0]?.profileImageUrl) {
				const oldGroupId = current[0].profileImageUrl.replace('/api/images/', '').split('?')[0];
				await deleteImage(oldGroupId);
			}

			const result = await processAndStoreImage(file);

			await db
				.update(members)
				.set({
					profileImageUrl: result.url,
					updatedAt: new Date()
				})
				.where(eq(members.id, member.id));

			return { photoSuccess: true };
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to upload image.';
			return fail(400, { photoError: message });
		}
	},

	removePhoto: async ({ locals }) => {
		const member = locals.member!;

		const current = await db
			.select({ profileImageUrl: members.profileImageUrl })
			.from(members)
			.where(eq(members.id, member.id))
			.limit(1);

		if (current[0]?.profileImageUrl) {
			const groupId = current[0].profileImageUrl.replace('/api/images/', '').split('?')[0];
			await deleteImage(groupId);
		}

		await db
			.update(members)
			.set({
				profileImageUrl: null,
				updatedAt: new Date()
			})
			.where(eq(members.id, member.id));

		return { photoRemoved: true };
	}
};
