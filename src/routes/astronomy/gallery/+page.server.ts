import { eq, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { galleryImages } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const images = await db
		.select()
		.from(galleryImages)
		.where(eq(galleryImages.clubType, 'astronomy'))
		.orderBy(desc(galleryImages.uploadDate));

	return { images };
};
