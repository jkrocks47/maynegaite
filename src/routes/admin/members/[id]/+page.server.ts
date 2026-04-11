import { error, fail, redirect } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members, eventCheckins, eventRsvps, events } from '$lib/server/db/schema';
import { ADMIN_ROLES } from '$lib/utils/constants';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const result = await db.select().from(members).where(eq(members.id, params.id)).limit(1);

	if (result.length === 0) {
		error(404, 'Member not found');
	}

	const member = result[0];

	const attended = await db
		.select({
			eventId: events.id,
			title: events.title,
			date: events.date,
			eventCategory: events.eventCategory,
			checkedInAt: eventCheckins.checkedInAt
		})
		.from(eventCheckins)
		.innerJoin(events, eq(eventCheckins.eventId, events.id))
		.where(eq(eventCheckins.memberId, member.id))
		.orderBy(desc(eventCheckins.checkedInAt));

	const rsvps = await db
		.select({
			eventId: events.id,
			title: events.title,
			date: events.date,
			eventCategory: events.eventCategory,
			status: eventRsvps.status
		})
		.from(eventRsvps)
		.innerJoin(events, eq(eventRsvps.eventId, events.id))
		.where(eq(eventRsvps.memberId, member.id))
		.orderBy(desc(events.date));

	return { member, attended, rsvps, currentUserRole: locals.member?.adminRole ?? null };
};

export const actions: Actions = {
	updateAdminRole: async ({ request, params, locals }) => {
		if (!locals.member?.adminRole || locals.member.adminRole !== 'president') {
			return fail(403, { error: 'Only the president can manage admin roles.' });
		}

		const formData = await request.formData();
		const adminRoleRaw = formData.get('adminRole') as string;

		if (adminRoleRaw && !ADMIN_ROLES.includes(adminRoleRaw as any)) {
			return fail(400, { error: 'Invalid admin role.' });
		}

		if (params.id === locals.member.id && adminRoleRaw !== 'president') {
			return fail(400, { error: 'You cannot remove your own president role.' });
		}

		const adminRole = adminRoleRaw
			? (adminRoleRaw as (typeof ADMIN_ROLES)[number])
			: null;

		await db
			.update(members)
			.set({ adminRole, updatedAt: new Date() })
			.where(eq(members.id, params.id));

		return { success: true };
	},

	updateRole: async ({ request, params }) => {
		const formData = await request.formData();
		const role = formData.get('role') as 'member' | 'board';

		if (!['member', 'board'].includes(role)) {
			return fail(400, { error: 'Invalid role.' });
		}

		await db
			.update(members)
			.set({ role, updatedAt: new Date() })
			.where(eq(members.id, params.id));

		return { success: true };
	},

	deleteMember: async ({ params, locals }) => {
		if (!locals.member?.adminRole || locals.member.adminRole !== 'president') {
			return fail(403, { error: 'Only the president can delete members.' });
		}

		if (params.id === locals.member.id) {
			return fail(400, { error: 'You cannot delete your own account.' });
		}

		await db.delete(members).where(eq(members.id, params.id));

		redirect(303, '/admin/members');
	}
};
