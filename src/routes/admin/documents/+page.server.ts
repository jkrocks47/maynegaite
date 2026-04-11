import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { documents, members } from '$lib/server/db/schema';
import { documentSchema } from '$lib/utils/validation';
import type { Actions, PageServerLoad } from './$types';

function parseDateTime(input: string | null): Date | null {
	if (!input) return null;
	const parsed = new Date(input);
	if (Number.isNaN(parsed.getTime())) return null;
	return parsed;
}

export const load: PageServerLoad = async () => {
	const docs = await db
		.select({
			id: documents.id,
			title: documents.title,
			description: documents.description,
			category: documents.category,
			fileUrl: documents.fileUrl,
			publishedAt: documents.publishedAt,
			createdAt: documents.createdAt,
			uploadedBy: documents.uploadedBy,
			uploaderName: members.displayName
		})
		.from(documents)
		.leftJoin(members, eq(documents.uploadedBy, members.id))
		.orderBy(desc(documents.publishedAt), desc(documents.createdAt));

	return { docs };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const publishedAt = parseDateTime(formData.get('publishedAt') as string | null);

		const parsed = documentSchema.safeParse({
			title: (formData.get('title') as string) ?? '',
			description: ((formData.get('description') as string) || '').trim() || undefined,
			category: (formData.get('category') as string) ?? 'other',
			fileUrl: ((formData.get('fileUrl') as string) || '').trim() || undefined
		});

		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message || 'Invalid document input.'
			});
		}

		await db.insert(documents).values({
			title: parsed.data.title,
			description: parsed.data.description || null,
			category: parsed.data.category,
			fileUrl: parsed.data.fileUrl || null,
			publishedAt: publishedAt || new Date(),
			uploadedBy: locals.member?.id
		});

		return { success: true };
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) {
			return fail(400, { error: 'Document ID is required.' });
		}

		const publishedAt = parseDateTime(formData.get('publishedAt') as string | null);
		const parsed = documentSchema.safeParse({
			title: (formData.get('title') as string) ?? '',
			description: ((formData.get('description') as string) || '').trim() || undefined,
			category: (formData.get('category') as string) ?? 'other',
			fileUrl: ((formData.get('fileUrl') as string) || '').trim() || undefined
		});

		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message || 'Invalid document input.'
			});
		}

		await db
			.update(documents)
			.set({
				title: parsed.data.title,
				description: parsed.data.description || null,
				category: parsed.data.category,
				fileUrl: parsed.data.fileUrl || null,
				publishedAt: publishedAt || new Date()
			})
			.where(eq(documents.id, id));

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) {
			return fail(400, { error: 'Document ID is required.' });
		}

		await db.delete(documents).where(eq(documents.id, id));
		return { success: true };
	}
};
