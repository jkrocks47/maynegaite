import { desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allDocs = await db
		.select()
		.from(documents)
		.orderBy(desc(documents.publishedAt));

	const categories = ['bylaws', 'covenant', 'minutes', 'newsletter', 'financial', 'other'] as const;
	const grouped: Record<string, typeof allDocs> = {};
	for (const cat of categories) {
		const docs = allDocs.filter((d) => d.category === cat);
		if (docs.length > 0) grouped[cat] = docs;
	}

	return { grouped };
};
