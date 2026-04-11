import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, galleryImages, members } from '$lib/server/db/schema';
import { processAndStoreImage, deleteImage } from '$lib/server/images';
import { galleryImageSchema } from '$lib/utils/validation';
import type { Actions, PageServerLoad } from './$types';

export const config = { body: { maxSize: '25mb' } };

export const load: PageServerLoad = async () => {
	const images = await db
		.select({
			id: galleryImages.id,
			url: galleryImages.url,
			thumbnailUrl: galleryImages.thumbnailUrl,
			caption: galleryImages.caption,
			photographer: galleryImages.photographer,
			uploadDate: galleryImages.uploadDate,
			imageGroupId: galleryImages.imageGroupId,
			eventId: galleryImages.eventId,
			eventTitle: events.title,
			uploadedByName: members.displayName
		})
		.from(galleryImages)
		.leftJoin(members, eq(galleryImages.uploadedBy, members.id))
		.leftJoin(events, eq(galleryImages.eventId, events.id))
		.orderBy(desc(galleryImages.uploadDate));

	const eventOptions = await db
		.select({ id: events.id, title: events.title, date: events.date })
		.from(events)
		.orderBy(desc(events.date));

	return { images, eventOptions };
};

export const actions: Actions = {
	upload: async ({ request, locals }) => {
		const formData = await request.formData();
		const imageFile = formData.get('image');

		if (!(imageFile instanceof File) || imageFile.size === 0) {
			return fail(400, { error: 'Please select an image to upload.' });
		}

		const parsed = galleryImageSchema.safeParse({
			caption: ((formData.get('caption') as string) || '').trim() || undefined,
			photographer: ((formData.get('photographer') as string) || '').trim() || undefined,
			eventId: ((formData.get('eventId') as string) || '').trim() || undefined
		});

		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message || 'Invalid gallery input.'
			});
		}

		let upload;
		try {
			upload = await processAndStoreImage(imageFile);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Image upload failed.';
			return fail(400, { error: message });
		}

		await db.insert(galleryImages).values({
			url: upload.url,
			thumbnailUrl: upload.thumbnailUrl,
			imageGroupId: upload.groupId,
			caption: parsed.data.caption || null,
			photographer: parsed.data.photographer || null,
			eventId: parsed.data.eventId || null,
			width: upload.width,
			height: upload.height,
			uploadedBy: locals.member?.id
		});

		return { success: true };
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) {
			return fail(400, { error: 'Image ID is required.' });
		}

		const parsed = galleryImageSchema.safeParse({
			caption: ((formData.get('caption') as string) || '').trim() || undefined,
			photographer: ((formData.get('photographer') as string) || '').trim() || undefined,
			eventId: ((formData.get('eventId') as string) || '').trim() || undefined
		});

		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message || 'Invalid gallery input.'
			});
		}

		await db
			.update(galleryImages)
			.set({
				caption: parsed.data.caption || null,
				photographer: parsed.data.photographer || null,
				eventId: parsed.data.eventId || null
			})
			.where(eq(galleryImages.id, id));

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) {
			return fail(400, { error: 'Image ID is required.' });
		}

		const [image] = await db
			.select({ imageGroupId: galleryImages.imageGroupId })
			.from(galleryImages)
			.where(eq(galleryImages.id, id))
			.limit(1);

		if (!image) {
			return fail(404, { error: 'Image not found.' });
		}

		await deleteImage(image.imageGroupId);
		await db.delete(galleryImages).where(eq(galleryImages.id, id));
		return { success: true };
	}
};
