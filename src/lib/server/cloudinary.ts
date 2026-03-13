import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

let configured = false;

function ensureConfigured() {
	if (!configured) {
		cloudinary.config({
			cloud_name: env.CLOUDINARY_CLOUD_NAME,
			api_key: env.CLOUDINARY_API_KEY,
			api_secret: env.CLOUDINARY_API_SECRET
		});
		configured = true;
	}
}

export interface UploadResult {
	url: string;
	publicId: string;
	width: number;
	height: number;
}

export async function uploadImage(
	file: File,
	folder: string = 'uicspacetime'
): Promise<UploadResult> {
	ensureConfigured();
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder,
				resource_type: 'image',
				transformation: [{ quality: 'auto', fetch_format: 'auto' }]
			},
			(error, result) => {
				if (error || !result) {
					reject(error || new Error('Upload failed'));
					return;
				}
				resolve({
					url: result.secure_url,
					publicId: result.public_id,
					width: result.width,
					height: result.height
				});
			}
		);
		stream.end(buffer);
	});
}

export async function deleteImage(publicId: string): Promise<void> {
	ensureConfigured();
	await cloudinary.uploader.destroy(publicId);
}
