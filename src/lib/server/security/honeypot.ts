import { fail } from '@sveltejs/kit';

/**
 * Checks hidden honeypot fields that real users never fill.
 * Bots auto-filling by field name will populate these, revealing themselves.
 * Returns fail(400) if bot detected, null if clean.
 */
export function checkHoneypot(formData: FormData) {
	const name = formData.get('_hp_n');
	const emailConfirm = formData.get('_hp_ec');

	if ((name && String(name).length > 0) || (emailConfirm && String(emailConfirm).length > 0)) {
		return fail(400, { error: 'Something went wrong. Please try again.' });
	}

	return null;
}
