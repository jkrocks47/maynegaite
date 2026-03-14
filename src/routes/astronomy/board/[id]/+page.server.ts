import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { officers, members } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const result = await db
		.select({
			id: officers.id,
			name: officers.name,
			position: officers.position,
			bio: officers.bio,
			imageUrl: officers.imageUrl,
			email: officers.email,
			academicYear: officers.academicYear,
			memberId: officers.memberId,
			memberFirstName: members.firstName,
			memberLastName: members.lastName,
			memberProfileImage: members.profileImageUrl,
			memberYear: members.year,
			memberMajor: members.major
		})
		.from(officers)
		.leftJoin(members, eq(officers.memberId, members.id))
		.where(eq(officers.id, params.id))
		.limit(1);

	const member = result[0];

	if (!member || !member.id) {
		throw error(404, 'Board member not found');
	}

	return { member };
};
