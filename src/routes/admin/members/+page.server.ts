import { fail } from '@sveltejs/kit';
import { eq, desc, sql, ilike, or } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members, eventCheckins } from '$lib/server/db/schema';
import { ADMIN_ROLES } from '$lib/utils/constants';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const search = url.searchParams.get('search') || '';
	const sectionFilter = url.searchParams.get('section') || '';
	const roleFilter = url.searchParams.get('role') || '';

	let query = db.select().from(members).orderBy(desc(members.createdAt)).$dynamic();

	if (search) {
		query = query.where(
			or(
				ilike(members.email, `%${search}%`),
				ilike(members.firstName, `%${search}%`),
				ilike(members.lastName, `%${search}%`)
			)
		);
	}

	const allMembers = await query;

	let filtered = allMembers;
	if (sectionFilter === 'woods') filtered = filtered.filter((m) => m.section === 'woods');
	if (sectionFilter === 'reserves') filtered = filtered.filter((m) => m.section === 'reserves');
	if (roleFilter) filtered = filtered.filter((m) => m.role === roleFilter);

	const checkinCounts = await db
		.select({
			memberId: eventCheckins.memberId,
			count: sql<number>`count(*)`
		})
		.from(eventCheckins)
		.groupBy(eventCheckins.memberId);

	const checkinMap: Record<string, number> = {};
	for (const row of checkinCounts) {
		checkinMap[row.memberId] = Number(row.count);
	}

	const membersWithStats = filtered.map((m) => ({
		...m,
		eventsAttended: checkinMap[m.id] || 0
	}));

	return {
		members: membersWithStats,
		search,
		sectionFilter,
		roleFilter,
		totalCount: allMembers.length,
		currentUserRole: locals.member?.adminRole ?? null
	};
};

export const actions: Actions = {
	updateRole: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const role = formData.get('role') as 'member' | 'board';

		if (!id || !['member', 'board'].includes(role)) {
			return fail(400, { error: 'Invalid input.' });
		}

		await db.update(members).set({ role, updatedAt: new Date() }).where(eq(members.id, id));

		return { success: true };
	},

	updateAdminRole: async ({ request, locals }) => {
		if (!locals.member?.adminRole || locals.member.adminRole !== 'president') {
			return fail(403, { error: 'Only the president can manage admin roles.' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const adminRoleRaw = formData.get('adminRole') as string;

		if (!id) {
			return fail(400, { error: 'Invalid input.' });
		}

		if (adminRoleRaw && !ADMIN_ROLES.includes(adminRoleRaw as any)) {
			return fail(400, { error: 'Invalid admin role.' });
		}

		if (id === locals.member.id && adminRoleRaw !== 'president') {
			return fail(400, { error: 'You cannot remove your own president role.' });
		}

		const adminRole = adminRoleRaw
			? (adminRoleRaw as (typeof ADMIN_ROLES)[number])
			: null;

		await db
			.update(members)
			.set({ adminRole, updatedAt: new Date() })
			.where(eq(members.id, id));

		return { success: true };
	},

	exportCsv: async () => {
		const allMembers = await db.select().from(members).orderBy(members.lastName);

		const header =
			'First Name,Last Name,Email,Role,Verified,Lot Number,Section,Address,Phone,Joined';
		const rows = allMembers.map((m) =>
			[
				m.firstName,
				m.lastName,
				m.email,
				m.role,
				m.emailVerified ? 'Yes' : 'No',
				m.lotNumber || '',
				m.section || '',
				`"${m.address || ''}"`,
				m.phone || '',
				m.createdAt?.toISOString().split('T')[0] || ''
			].join(',')
		);

		return { csv: [header, ...rows].join('\n') };
	}
};
