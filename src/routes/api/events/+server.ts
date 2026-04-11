import { json } from '@sveltejs/kit';
import { eq, and, gte, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const category = url.searchParams.get('category');
	const limit = Math.max(1, Math.min(parseInt(url.searchParams.get('limit') || '20') || 20, 50));

	const conditions = [eq(events.isPublished, true), gte(events.date, new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' }))];

	if (category && ['community', 'board_meeting', 'village', 'social', 'maintenance'].includes(category)) {
		conditions.push(eq(events.eventCategory, category as 'community' | 'board_meeting' | 'village' | 'social' | 'maintenance'));
	}

	const result = await db
		.select()
		.from(events)
		.where(and(...conditions))
		.orderBy(asc(events.date))
		.limit(limit);

	return json(result);
};
