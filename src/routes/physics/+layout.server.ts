import type { LayoutServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { clubInfo } from '$lib/server/db/schema';
import { getContentWithDefaults } from '$lib/server/content';

export const load: LayoutServerLoad = async ({ locals }) => {
	const [clubInfoResult, footerContent] = await Promise.all([
		db.select().from(clubInfo).where(eq(clubInfo.clubType, 'physics')).limit(1),
		getContentWithDefaults('physics', 'footer')
	]);
	return { member: locals.member, clubInfo: clubInfoResult[0] ?? null, footerContent };
};
