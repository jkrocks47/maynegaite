import { redirect, type Handle } from '@sveltejs/kit';
import { validateMemberSession } from '$lib/server/auth';
import { canManageAdmin } from '$lib/utils/constants';
import {
	startReminderScheduler,
	stopReminderScheduler
} from '$lib/server/reminder-scheduler';
import {
	startRateLimitCleanup,
	stopRateLimitCleanup
} from '$lib/server/security';

// Start the reminder scheduler once when the server boots
startReminderScheduler();

// Start periodic cleanup of expired rate limit entries
startRateLimitCleanup();

// Clean up on HMR in dev
if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		stopReminderScheduler();
		stopRateLimitCleanup();
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	// Initialize locals
	event.locals.member = null;

	// Member session validation
	const memberToken = event.cookies.get('member_session');

	if (memberToken) {
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

		// All other admin routes require auth + admin role
		if (!event.locals.member?.adminRole || !canManageAdmin(event.locals.member.adminRole)) {
			throw redirect(303, '/admin');
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
