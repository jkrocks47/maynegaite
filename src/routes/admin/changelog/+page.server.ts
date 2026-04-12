import { getAllLogs } from '$lib/server/db/audit';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 50;

export const load: PageServerLoad = async ({ url }) => {
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
	const entityType = url.searchParams.get('entityType') ?? undefined;
	const action = url.searchParams.get('action') ?? undefined;

	const { rows, total } = await getAllLogs({
		limit: PAGE_SIZE,
		offset: (page - 1) * PAGE_SIZE,
		entityType: entityType || undefined,
		action: (action as 'create' | 'update' | 'delete' | 'status_change' | 'review') || undefined
	});

	return {
		logs: rows,
		total,
		page,
		pageSize: PAGE_SIZE,
		entityType: entityType ?? '',
		action: action ?? ''
	};
};
