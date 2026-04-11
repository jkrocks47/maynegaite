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
		const actorRole = locals.member?.adminRole ?? null;

		if (!actorRole || (actorRole !== 'tech_admin' && actorRole !== 'president')) {
			return fail(403, { error: 'Only the president or tech admin can manage admin roles.' });
		}

		const formData = await request.formData();
		const adminRoleRaw = formData.get('adminRole') as string;

		if (adminRoleRaw && !ADMIN_ROLES.includes(adminRoleRaw as any)) {
			return fail(400, { error: 'Invalid admin role.' });
		}

		const newRole = adminRoleRaw ? (adminRoleRaw as (typeof ADMIN_ROLES)[number]) : null;

		// Self-protection: can't remove your own privileged role
		if (params.id === locals.member!.id) {
			if (actorRole === 'tech_admin' && newRole !== 'tech_admin') {
				return fail(400, { error: 'You cannot remove your own tech admin role.' });
			}
			if (actorRole === 'president' && newRole !== 'president') {
				return fail(400, { error: 'You cannot remove your own president role.' });
			}
		}

		// Fetch target's current role to enforce protection
		const [target] = await db
			.select({ adminRole: members.adminRole })
			.from(members)
			.where(eq(members.id, params.id))
			.limit(1);

		if (!target) {
			return fail(404, { error: 'Member not found.' });
		}

		// President cannot touch tech_admin accounts
		if (target.adminRole === 'tech_admin' && actorRole !== 'tech_admin') {
			return fail(403, { error: 'Only a tech admin can modify tech admin accounts.' });
		}

		// Only tech_admin can assign the tech_admin role
		if (newRole === 'tech_admin' && actorRole !== 'tech_admin') {
			return fail(403, { error: 'Only a tech admin can assign the tech admin role.' });
		}

		await db
			.update(members)
			.set({ adminRole: newRole, updatedAt: new Date() })
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
		const actorRole = locals.member?.adminRole ?? null;

		if (!actorRole || (actorRole !== 'tech_admin' && actorRole !== 'president')) {
			return fail(403, { error: 'Only the president or tech admin can delete members.' });
		}

		if (params.id === locals.member!.id) {
			return fail(400, { error: 'You cannot delete your own account.' });
		}

		// Fetch target to check if they're a tech_admin
		const [target] = await db
			.select({ adminRole: members.adminRole })
			.from(members)
			.where(eq(members.id, params.id))
			.limit(1);

		if (!target) {
			return fail(404, { error: 'Member not found.' });
		}

		// President cannot delete tech_admin accounts
		if (target.adminRole === 'tech_admin' && actorRole !== 'tech_admin') {
			return fail(403, { error: 'Only a tech admin can delete tech admin accounts.' });
		}

		await db.delete(members).where(eq(members.id, params.id));

		redirect(303, '/admin/members');
	}
};
