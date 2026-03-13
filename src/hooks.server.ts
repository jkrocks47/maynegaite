import { redirect, type Handle } from '@sveltejs/kit';
import { validateSession, validateMemberSession } from '$lib/server/auth';
import { canManageClub } from '$lib/utils/constants';
import type { ClubType } from '$lib/utils/constants';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	// Initialize locals
	event.locals.user = null;
	event.locals.member = null;

	// Admin session validation (only on /admin routes)
	const sessionToken = event.cookies.get('session');
	if (sessionToken && pathname.startsWith('/admin')) {
		try {
			event.locals.user = await validateSession(sessionToken);
		} catch {
			event.locals.user = null;
		}
	}

	// Member session validation (on dashboard, checkin, event detail, and member API routes)
	const memberToken = event.cookies.get('member_session');
	const needsMemberAuth =
		pathname.startsWith('/dashboard') ||
		pathname.startsWith('/checkin') ||
		pathname.startsWith('/api/member') ||
		pathname.match(/^\/(astronomy|physics)\/events\/[^/]+$/);

	if (memberToken && needsMemberAuth) {
		try {
			event.locals.member = await validateMemberSession(memberToken);
		} catch {
			event.locals.member = null;
		}
	}

	// Protect admin routes
	if (pathname.startsWith('/admin')) {
		// Allow the login page itself
		if (pathname === '/admin' && event.request.method === 'GET') {
			return resolve(event);
		}

		// POST to /admin is the login action — allow it
		if (pathname === '/admin' && event.request.method === 'POST') {
			return resolve(event);
		}

		// All other admin routes require auth
		if (!event.locals.user) {
			throw redirect(303, '/admin');
		}

		// Club-specific RBAC (skip for /admin/members and /admin/announcements)
		const clubMatch = pathname.match(/^\/admin\/(astronomy|physics)/);
		if (clubMatch) {
			const club = clubMatch[1] as ClubType;
			if (!canManageClub(event.locals.user.role, club)) {
				throw redirect(303, '/admin');
			}
		}
	}

	// Protect dashboard routes — require member login
	if (pathname.startsWith('/dashboard')) {
		if (!event.locals.member) {
			throw redirect(303, '/login');
		}

		// Require email verification for dashboard access
		if (!event.locals.member.emailVerified) {
			throw redirect(303, '/verify-email');
		}
	}

	return resolve(event);
};
