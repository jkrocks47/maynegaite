import { fail } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members, officers } from '$lib/server/db/schema';
import { officerSchema } from '$lib/utils/validation';
import type { Actions, PageServerLoad } from './$types';

async function getMemberProfileImage(memberId: string | null): Promise<string | null> {
	if (!memberId) return null;
	const [member] = await db
		.select({ profileImageUrl: members.profileImageUrl })
		.from(members)
		.where(eq(members.id, memberId))
		.limit(1);
	return member?.profileImageUrl || null;
}

export const load: PageServerLoad = async () => {
	const officersList = await db
		.select({
			id: officers.id,
			name: officers.name,
			position: officers.position,
			committeeType: officers.committeeType,
			bio: officers.bio,
			email: officers.email,
			imageUrl: officers.imageUrl,
			sortOrder: officers.sortOrder,
			memberId: officers.memberId,
			memberFirstName: members.firstName,
			memberLastName: members.lastName,
			memberEmail: members.email
		})
		.from(officers)
		.leftJoin(members, eq(officers.memberId, members.id))
		.orderBy(asc(officers.sortOrder));

	const memberOptions = await db
		.select({
			id: members.id,
			firstName: members.firstName,
			lastName: members.lastName,
			email: members.email,
			profileImageUrl: members.profileImageUrl
		})
		.from(members)
		.orderBy(asc(members.lastName), asc(members.firstName));

	return { officers: officersList, memberOptions };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const memberId = ((formData.get('memberId') as string) || '').trim();
		const imageUrlRaw = ((formData.get('imageUrl') as string) || '').trim();

		const parsed = officerSchema.safeParse({
			name: (formData.get('name') as string) ?? '',
			position: (formData.get('position') as string) ?? '',
			email: ((formData.get('email') as string) || '').trim(),
			bio: ((formData.get('bio') as string) || '').trim(),
			committeeType: ((formData.get('committeeType') as string) || 'board').trim(),
			sortOrder: Number((formData.get('sortOrder') as string) || 0),
			memberId
		});

		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message || 'Invalid officer data.'
			});
		}

		const memberImage = await getMemberProfileImage(parsed.data.memberId || null);
		const imageUrl = imageUrlRaw || memberImage;

		await db.insert(officers).values({
			name: parsed.data.name,
			position: parsed.data.position,
			committeeType: parsed.data.committeeType,
			email: parsed.data.email || null,
			bio: parsed.data.bio || null,
			sortOrder: parsed.data.sortOrder,
			memberId: parsed.data.memberId || null,
			imageUrl
		});

		return { success: true };
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) {
			return fail(400, { error: 'Officer ID is required.' });
		}

		const memberId = ((formData.get('memberId') as string) || '').trim();
		const imageUrlRaw = ((formData.get('imageUrl') as string) || '').trim();

		const parsed = officerSchema.safeParse({
			name: (formData.get('name') as string) ?? '',
			position: (formData.get('position') as string) ?? '',
			email: ((formData.get('email') as string) || '').trim(),
			bio: ((formData.get('bio') as string) || '').trim(),
			committeeType: ((formData.get('committeeType') as string) || 'board').trim(),
			sortOrder: Number((formData.get('sortOrder') as string) || 0),
			memberId
		});

		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message || 'Invalid officer data.'
			});
		}

		const memberImage = await getMemberProfileImage(parsed.data.memberId || null);
		const imageUrl = imageUrlRaw || memberImage;

		await db
			.update(officers)
			.set({
				name: parsed.data.name,
				position: parsed.data.position,
				committeeType: parsed.data.committeeType,
				email: parsed.data.email || null,
				bio: parsed.data.bio || null,
				sortOrder: parsed.data.sortOrder,
				memberId: parsed.data.memberId || null,
				imageUrl
			})
			.where(eq(officers.id, id));

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) {
			return fail(400, { error: 'Officer ID is required.' });
		}

		await db.delete(officers).where(eq(officers.id, id));
		return { success: true };
	}
};
