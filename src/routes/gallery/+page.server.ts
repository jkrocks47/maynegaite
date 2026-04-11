import { desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { galleryImages } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const images = await db
		.select()
		.from(galleryImages)
		.orderBy(desc(galleryImages.uploadDate))
		.limit(50);

	return { images };
};
