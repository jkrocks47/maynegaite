import { json } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { galleryImages } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const club = url.searchParams.get('club');
	const limit = parseInt(url.searchParams.get('limit') || '20');
	const offset = parseInt(url.searchParams.get('offset') || '0');

	const conditions = [];

	if (club === 'astronomy' || club === 'physics') {
		conditions.push(eq(galleryImages.clubType, club));
	}

	const query = db.select().from(galleryImages);

	const result = conditions.length > 0
		? await query.where(conditions[0]).orderBy(desc(galleryImages.uploadDate)).limit(Math.min(limit, 50)).offset(offset)
		: await query.orderBy(desc(galleryImages.uploadDate)).limit(Math.min(limit, 50)).offset(offset);

	return json(result);
};
