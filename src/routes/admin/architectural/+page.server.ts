import { fail } from '@sveltejs/kit';
import { asc, desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { architecturalRequests, members, properties } from '$lib/server/db/schema';
import { architecturalRequestSchema } from '$lib/utils/validation';
import type { Actions, PageServerLoad } from './$types';

const REQUEST_TYPES = [
	'modification',
	'new_construction',
	'fence',
	'landscaping',
	'paint',
	'other'
] as const;
const REQUEST_STATUSES = [
	'submitted',
	'under_review',
	'approved',
	'denied',
	'revision_requested'
] as const;

type RequestStatus = (typeof REQUEST_STATUSES)[number];

const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseOptionalUuid(value: FormDataEntryValue | null): string | null {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	return UUID_REGEX.test(trimmed) ? trimmed : null;
}

function parseAttachments(raw: FormDataEntryValue | null): string[] | null {
	if (typeof raw !== 'string') return null;
	const attachments = raw
		.split(/\r?\n|,/)
		.map((item) => item.trim())
		.filter(Boolean);
	return attachments.length > 0 ? attachments : null;
}

function isRequestStatus(value: string): value is RequestStatus {
	return REQUEST_STATUSES.includes(value as RequestStatus);
}

export const load: PageServerLoad = async () => {
	const requestRows = await db
		.select({
			id: architecturalRequests.id,
			memberId: architecturalRequests.memberId,
			propertyId: architecturalRequests.propertyId,
			title: architecturalRequests.title,
			description: architecturalRequests.description,
			requestType: architecturalRequests.requestType,
			status: architecturalRequests.status,
			submittedAt: architecturalRequests.submittedAt,
			reviewedAt: architecturalRequests.reviewedAt,
			reviewedBy: architecturalRequests.reviewedBy,
			reviewNotes: architecturalRequests.reviewNotes,
			attachments: architecturalRequests.attachments,
			requesterFirstName: members.firstName,
			requesterLastName: members.lastName,
			requesterDisplayName: members.displayName,
			requesterEmail: members.email,
			lotNumber: properties.lotNumber,
			propertyAddress: properties.address
		})
		.from(architecturalRequests)
		.leftJoin(members, eq(architecturalRequests.memberId, members.id))
		.leftJoin(properties, eq(architecturalRequests.propertyId, properties.id))
		.orderBy(desc(architecturalRequests.submittedAt));

	const memberRows = await db
		.select({
			id: members.id,
			firstName: members.firstName,
			lastName: members.lastName,
			displayName: members.displayName,
			email: members.email
		})
		.from(members)
		.orderBy(asc(members.lastName), asc(members.firstName));

	const memberOptions = memberRows.map((member) => ({
		...member,
		label: member.displayName || `${member.firstName} ${member.lastName}`.trim()
	}));

	const memberNameById = new Map(memberOptions.map((member) => [member.id, member.label]));

	const propertyOptions = await db
		.select({
			id: properties.id,
			lotNumber: properties.lotNumber,
			address: properties.address
		})
		.from(properties)
		.orderBy(asc(properties.lotNumber));

	const requests = requestRows.map((row) => {
		const requesterName =
			row.requesterDisplayName ||
			`${row.requesterFirstName ?? ''} ${row.requesterLastName ?? ''}`.trim() ||
			row.requesterEmail ||
			'Unknown member';

		return {
			...row,
			requesterName,
			reviewerName: row.reviewedBy ? memberNameById.get(row.reviewedBy) ?? 'Unknown reviewer' : null
		};
	});

	const statusCounts = {
		submitted: requests.filter((request) => request.status === 'submitted').length,
		under_review: requests.filter((request) => request.status === 'under_review').length,
		approved: requests.filter((request) => request.status === 'approved').length,
		denied: requests.filter((request) => request.status === 'denied').length,
		revision_requested: requests.filter((request) => request.status === 'revision_requested').length
	};

	return {
		requests,
		memberOptions,
		propertyOptions,
		requestTypes: REQUEST_TYPES,
		statuses: REQUEST_STATUSES,
		statusCounts
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const memberId = parseOptionalUuid(formData.get('memberId'));
		const propertyId = parseOptionalUuid(formData.get('propertyId'));

		if (!memberId) {
			return fail(400, { error: 'A valid requester is required.' });
		}

		const parsed = architecturalRequestSchema.safeParse({
			title: (formData.get('title') as string) ?? '',
			description: (formData.get('description') as string) ?? '',
			requestType: ((formData.get('requestType') as string) || 'other').trim()
		});

		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message || 'Invalid architectural request input.'
			});
		}

		await db.insert(architecturalRequests).values({
			memberId,
			propertyId,
			title: parsed.data.title,
			description: parsed.data.description,
			requestType: parsed.data.requestType,
			status: 'submitted',
			attachments: parseAttachments(formData.get('attachments'))
		});

		return { success: true };
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = parseOptionalUuid(formData.get('id'));
		const memberId = parseOptionalUuid(formData.get('memberId'));
		const propertyId = parseOptionalUuid(formData.get('propertyId'));

		if (!id) {
			return fail(400, { error: 'Request ID is required.' });
		}
		if (!memberId) {
			return fail(400, { error: 'A valid requester is required.' });
		}

		const parsed = architecturalRequestSchema.safeParse({
			title: (formData.get('title') as string) ?? '',
			description: (formData.get('description') as string) ?? '',
			requestType: ((formData.get('requestType') as string) || 'other').trim()
		});

		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message || 'Invalid architectural request input.'
			});
		}

		await db
			.update(architecturalRequests)
			.set({
				memberId,
				propertyId,
				title: parsed.data.title,
				description: parsed.data.description,
				requestType: parsed.data.requestType,
				attachments: parseAttachments(formData.get('attachments'))
			})
			.where(eq(architecturalRequests.id, id));

		return { success: true };
	},

	review: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = parseOptionalUuid(formData.get('id'));
		const statusRaw = ((formData.get('status') as string) || '').trim();
		const reviewNotes = ((formData.get('reviewNotes') as string) || '').trim() || null;

		if (!id) {
			return fail(400, { error: 'Request ID is required.' });
		}
		if (!isRequestStatus(statusRaw)) {
			return fail(400, { error: 'Invalid request status.' });
		}

		const shouldClearReview = statusRaw === 'submitted';
		const reviewerId = shouldClearReview ? null : (locals.member?.id ?? null);
		const reviewedAt = shouldClearReview ? null : new Date();

		await db
			.update(architecturalRequests)
			.set({
				status: statusRaw,
				reviewNotes,
				reviewedBy: reviewerId,
				reviewedAt
			})
			.where(eq(architecturalRequests.id, id));

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = parseOptionalUuid(formData.get('id'));
		if (!id) {
			return fail(400, { error: 'Request ID is required.' });
		}

		await db.delete(architecturalRequests).where(eq(architecturalRequests.id, id));
		return { success: true };
	}
};
