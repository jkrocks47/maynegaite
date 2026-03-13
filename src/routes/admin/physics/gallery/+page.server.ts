import { fail } from '@sveltejs/kit';
import { eq, desc, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { galleryImages } from '$lib/server/db/schema';
import { galleryImageSchema } from '$lib/utils/validation';
import { uploadImage, deleteImage } from '$lib/server/cloudinary';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const images = await db
		.select()
		.from(galleryImages)
		.where(eq(galleryImages.clubType, 'physics'))
		.orderBy(desc(galleryImages.uploadDate));

	return { images };
};

export const actions: Actions = {
	upload: async ({ request, locals }) => {
		const formData = await request.formData();
		const imageFile = formData.get('image') as File | null;

		if (!imageFile || imageFile.size === 0) {
			return fail(400, { error: 'Please select an image to upload.' });
		}

		const data = {
			caption: (formData.get('caption') as string) || undefined,
			photographer: (formData.get('photographer') as string) || undefined,
			clubType: 'physics' as const
		};

		const parsed = galleryImageSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: 'Invalid data.' });
		}

		let uploadResult;
		try {
			uploadResult = await uploadImage(imageFile, 'uicspacetime/physics/gallery');
		} catch {
			return fail(500, { error: 'Failed to upload image. Please try again.' });
		}

		await db.insert(galleryImages).values({
			url: uploadResult.url,
			publicId: uploadResult.publicId,
			caption: parsed.data.caption || null,
			clubType: 'physics',
			photographer: parsed.data.photographer || null,
			width: uploadResult.width,
			height: uploadResult.height,
			uploadedBy: locals.user?.id
		});

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Image ID is required.' });
		}

		const result = await db
			.select()
			.from(galleryImages)
			.where(and(eq(galleryImages.id, id), eq(galleryImages.clubType, 'physics')))
			.limit(1);

		if (result.length === 0) {
			return fail(404, { error: 'Image not found.' });
		}

		const image = result[0];

		try {
			await deleteImage(image.publicId);
		} catch {
			// Continue with deletion even if Cloudinary cleanup fails
		}

		await db
			.delete(galleryImages)
			.where(and(eq(galleryImages.id, id), eq(galleryImages.clubType, 'physics')));

		return { success: true };
	}
};
