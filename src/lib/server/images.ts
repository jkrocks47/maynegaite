import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { db } from '$lib/server/db';
import { images } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export interface UploadResult {
	url: string;
	thumbnailUrl: string;
	groupId: string;
	width: number;
	height: number;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_PIXEL_DIMENSION = 20000; // 20,000px per side
const BLOCKED_TYPES = [
	'application/pdf',
	'application/x-',
	'application/zip',
	'application/octet-stream',
	'text/',
	'video/',
	'audio/',
	'image/svg+xml'
];

export async function processAndStoreImage(file: File): Promise<UploadResult> {
	if (!(file instanceof File) || !file.name) {
		throw new Error('No valid file provided. Please select an image to upload.');
	}

	if (file.size === 0) {
		throw new Error('The selected file is empty. Please choose a different image.');
	}

	if (file.size > MAX_FILE_SIZE) {
		throw new Error(
			`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 25MB.`
		);
	}

	if (file.type && BLOCKED_TYPES.some((t) => file.type.startsWith(t))) {
		throw new Error(
			`"${file.name}" is not a supported image type (detected: ${file.type}). Please upload a JPEG, PNG, WebP, GIF, or TIFF file.`
		);
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	// Validate file content is a real image sharp can process
	let metadata;
	try {
		metadata = await sharp(buffer).metadata();
	} catch {
		throw new Error(
			`"${file.name}" could not be read as an image. The file may be corrupted or in an unsupported format. Supported formats: JPEG, PNG, WebP, GIF, TIFF.`
		);
	}

	if (!metadata.width || !metadata.height) {
		throw new Error(
			`"${file.name}" does not appear to be a valid image (missing dimensions).`
		);
	}

	if (metadata.width > MAX_PIXEL_DIMENSION || metadata.height > MAX_PIXEL_DIMENSION) {
		throw new Error(
			`"${file.name}" is too large (${metadata.width}x${metadata.height}px). Maximum dimension is ${MAX_PIXEL_DIMENSION}px per side. Please resize the image before uploading.`
		);
	}

	// Process full-size version
	let fullResult, thumbResult;
	try {
		fullResult = await sharp(buffer)
			.resize(2400, 2400, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 82, effort: 4 })
			.toBuffer({ resolveWithObject: true });

		// Process thumbnail version
		thumbResult = await sharp(buffer)
			.resize(600, 600, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 72, effort: 4 })
			.toBuffer({ resolveWithObject: true });
	} catch {
		throw new Error(
			`"${file.name}" could not be processed. The image may be corrupted. Please try re-saving it as a PNG or JPEG and uploading again.`
		);
	}

	const groupId = randomUUID();

	// Store both variants in a transaction
	await db.transaction(async (tx) => {
		await tx.insert(images).values({
			data: fullResult.data,
			mimeType: 'image/webp',
			variant: 'full',
			groupId,
			width: fullResult.info.width,
			height: fullResult.info.height,
			sizeBytes: fullResult.info.size
		});
		await tx.insert(images).values({
			data: thumbResult.data,
			mimeType: 'image/webp',
			variant: 'thumbnail',
			groupId,
			width: thumbResult.info.width,
			height: thumbResult.info.height,
			sizeBytes: thumbResult.info.size
		});
	});

	return {
		url: `/api/images/${groupId}`,
		thumbnailUrl: `/api/images/${groupId}?variant=thumbnail`,
		groupId,
		width: fullResult.info.width,
		height: fullResult.info.height
	};
}

export async function deleteImage(groupId: string): Promise<void> {
	await db.delete(images).where(eq(images.groupId, groupId));
}
