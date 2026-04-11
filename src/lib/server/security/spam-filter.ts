import { fail } from '@sveltejs/kit';

/**
 * Spam keywords that have no legitimate place in an HOA contact form.
 * Grouped by category for maintainability.
 */
const SPAM_KEYWORDS: string[] = [
	// Commercial solicitation
	'seo services',
	'search engine optimization',
	'backlink',
	'rank your website',
	'rank your site',
	'digital marketing service',
	'web design service',
	'increase your traffic',
	'boost your ranking',
	'increase your sales',
	'we offer services',
	'our agency',
	'our company offers',
	// Financial spam
	'cryptocurrency',
	'bitcoin',
	'forex trading',
	'binary option',
	'investment opportunity',
	'make money fast',
	'earn money online',
	'passive income',
	'financial freedom',
	'work from home opportunity',
	// Pharma / adult
	'online pharmacy',
	'cheap meds',
	'buy viagra',
	'buy cialis',
	'weight loss pill',
	// Generic spam phrases
	'click here now',
	'limited time offer',
	'act now',
	'free trial',
	'special promotion',
	'you have been selected',
	'congratulations you',
	'online casino',
	'sports betting',
	'loan offer',
	'debt relief',
	'credit repair'
];

/**
 * Content-based spam filter for the contact form.
 *
 * Checks:
 * - Message is substantive (≥ 15 characters)
 * - Message is not excessively long (≤ 2,000 characters — prevents paste-bombing)
 * - No more than 1 URL in the message body
 * - No spam keywords in message, name, or email
 *
 * Returns fail(400) with a user-facing error if spam is detected, null if clean.
 */
export function checkSpamContent(formData: FormData) {
	const message = ((formData.get('message') as string) ?? '').trim();
	const name = ((formData.get('name') as string) ?? '').trim();

	// --- Length bounds ---
	if (message.length < 15) {
		return fail(400, { error: 'Please enter a more detailed message.' });
	}

	if (message.length > 2000) {
		return fail(400, { error: 'Message is too long. Please keep it under 2,000 characters.' });
	}

	// --- URL density ---
	const urls = message.match(/https?:\/\/\S+/gi) ?? [];
	if (urls.length > 1) {
		return fail(400, {
			error: 'Your message contains too many links and could not be delivered.'
		});
	}

	// --- Keyword scan (message + name combined, case-insensitive) ---
	const combined = `${message} ${name}`.toLowerCase();
	for (const keyword of SPAM_KEYWORDS) {
		if (combined.includes(keyword)) {
			return fail(400, {
				error: 'Your message was flagged as potential spam and could not be delivered.'
			});
		}
	}

	return null;
}
