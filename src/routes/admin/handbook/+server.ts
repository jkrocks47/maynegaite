import { read } from '$app/server';
import handbookUrl from '$lib/server/assets/Maynegaite_Board_Member_Handbook.pdf?url';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const asset = read(handbookUrl);
	return new Response(asset.body, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline; filename="Maynegaite_Board_Member_Handbook.pdf"',
			'Cache-Control': 'private, no-store'
		}
	});
};
