import { db } from '$lib/server/db';
import { officers, communityInfo } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

const POSITION_RANK: Record<string, number> = {
	president: 1,
	'vice president': 2,
	vp: 2,
	treasurer: 3,
	secretary: 4,
	'architectural chair': 5,
	architectural: 5,
	'board member': 6
};

function rankFor(position: string | null): number {
	if (!position) return 99;
	const key = position
		.trim()
		.toLowerCase()
		.replace(/[^\w\s]/g, '');
	return POSITION_RANK[key] ?? 99;
}

export const load: PageServerLoad = async () => {
	const [boardMembers, community] = await Promise.all([
		db.select().from(officers),
		db.select().from(communityInfo).limit(1)
	]);

	const sorted = boardMembers.sort((a, b) => {
		const rankDiff = rankFor(a.position) - rankFor(b.position);
		if (rankDiff !== 0) return rankDiff;
		return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
	});

	return {
		officers: sorted,
		communityInfo: community[0] ?? null
	};
};
