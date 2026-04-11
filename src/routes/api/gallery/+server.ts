import { json } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { galleryImages } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const limit = parseInt(url.searchParams.get('limit') || '20');
	const offset = parseInt(url.searchParams.get('offset') || '0');

	const result = await db
		.select()
		.from(galleryImages)
		.orderBy(desc(galleryImages.uploadDate))
		.limit(Math.min(limit, 50))
		.offset(offset);

	return json(result);
};
