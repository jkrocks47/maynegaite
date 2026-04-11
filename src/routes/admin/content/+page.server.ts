import { fail } from '@sveltejs/kit';
import { getContentWithDefaults, upsertContent, getAllEntries } from '$lib/server/content';
import { getPageGroups } from '$lib/utils/content-registry';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const slugs = [...new Set(getAllEntries().map((e) => e.slug))];
	const contentBySlug: Record<string, Record<string, string>> = {};

	for (const slug of slugs) {
		contentBySlug[slug] = await getContentWithDefaults(slug);
	}

	return {
		contentBySlug,
		entries: getAllEntries(),
		pageGroups: getPageGroups()
	};
};

export const actions: Actions = {
	update: async ({ request, locals }) => {
		const formData = await request.formData();
		const slug = formData.get('slug') as string;
		const section = formData.get('section') as string;
		const body = formData.get('body') as string;

		if (!slug || !section) {
			return fail(400, { error: 'Slug and section are required.' });
		}

		await upsertContent(slug, section, { body }, locals.member!.id);
		return { success: true };
	}
};
