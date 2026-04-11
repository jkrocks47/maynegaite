import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { pageContent } from '$lib/server/db/schema';
import { logAction } from '$lib/server/db/audit';
import { contentEntries, type ContentEntry } from '$lib/utils/content-registry';

export interface ContentBlock {
	title?: string | null;
	body?: string | null;
	metadata?: Record<string, unknown> | null;
}

export async function getPageContent(
	slug: string
): Promise<Map<string, ContentBlock>> {
	const rows = await db
		.select({
			section: pageContent.section,
			title: pageContent.title,
			body: pageContent.body,
			metadata: pageContent.metadata
		})
		.from(pageContent)
		.where(eq(pageContent.slug, slug));

	const map = new Map<string, ContentBlock>();
	for (const row of rows) {
		map.set(row.section, { title: row.title, body: row.body, metadata: row.metadata });
	}
	return map;
}

export async function getContentWithDefaults(
	slug: string
): Promise<Record<string, string>> {
	const dbContent = await getPageContent(slug);
	const result: Record<string, string> = {};

	const entries = contentEntries.filter((e) => e.slug === slug);

	for (const entry of entries) {
		const dbBlock = dbContent.get(entry.section);
		if (dbBlock?.body) {
			result[entry.section] = dbBlock.body;
		} else {
			result[entry.section] = entry.defaultBody ?? '';
		}
	}

	return result;
}

export async function upsertContent(
	slug: string,
	section: string,
	data: { title?: string; body?: string },
	updatedBy: string
): Promise<void> {
	const values = {
		slug,
		section,
		title: data.title ?? null,
		body: data.body ?? null,
		updatedBy,
		updatedAt: new Date()
	};

	const [upserted] = await db
		.insert(pageContent)
		.values(values)
		.onConflictDoUpdate({
			target: [pageContent.slug, pageContent.section],
			set: {
				title: values.title,
				body: values.body,
				updatedBy: values.updatedBy,
				updatedAt: values.updatedAt
			}
		})
		.returning({ id: pageContent.id });

	// Log the action to the community audit log
	if (upserted?.id) {
		await logAction(
			'page_content',
			upserted.id,
			updatedBy,
			'update',
			`Updated ${section} for page /${slug === 'home' ? '' : slug}`
		);
	}
}

export function getAllEntries(): ContentEntry[] {
	return contentEntries;
}
