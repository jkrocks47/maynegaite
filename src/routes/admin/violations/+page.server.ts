import { fail } from '@sveltejs/kit';
import { asc, desc, eq, and, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members, properties, violations, auditLogs } from '$lib/server/db/schema';
import { logAction } from '$lib/server/db/audit';
import { violationReportSchema } from '$lib/utils/validation';
import type { Actions, PageServerLoad } from './$types';

const VIOLATION_TYPES = ['signage', 'architectural', 'maintenance', 'noise', 'other'] as const;
const VIOLATION_STATUSES = ['reported', 'investigating', 'resolved', 'dismissed'] as const;

type ViolationStatus = (typeof VIOLATION_STATUSES)[number];

const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseOptionalUuid(value: FormDataEntryValue | null): string | null {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	return UUID_REGEX.test(trimmed) ? trimmed : null;
}

function isViolationStatus(value: string): value is ViolationStatus {
	return VIOLATION_STATUSES.includes(value as ViolationStatus);
}

function shouldSetResolution(status: ViolationStatus): boolean {
	return status === 'resolved' || status === 'dismissed';
}

export const load: PageServerLoad = async () => {
	const violationRows = await db
		.select({
			id: violations.id,
			reportedBy: violations.reportedBy,
			propertyId: violations.propertyId,
			description: violations.description,
			violationType: violations.violationType,
			status: violations.status,
			reportedAt: violations.reportedAt,
			resolvedAt: violations.resolvedAt,
			resolvedBy: violations.resolvedBy,
			notes: violations.notes,
			lotNumber: properties.lotNumber,
			propertyAddress: properties.address,
			reporterFirstName: members.firstName,
			reporterLastName: members.lastName,
			reporterDisplayName: members.displayName,
			reporterEmail: members.email
		})
		.from(violations)
		.leftJoin(properties, eq(violations.propertyId, properties.id))
		.leftJoin(members, eq(violations.reportedBy, members.id))
		.orderBy(desc(violations.reportedAt));

	const recordIds = violationRows.map(r => r.id);
	const logsRows = recordIds.length > 0 ? await db
		.select({
			id: auditLogs.id,
			entityId: auditLogs.entityId,
			action: auditLogs.action,
			details: auditLogs.details,
			createdAt: auditLogs.createdAt,
			actorFirstName: members.firstName,
			actorLastName: members.lastName,
			actorDisplayName: members.displayName,
			actorEmail: members.email
		})
		.from(auditLogs)
		.leftJoin(members, eq(auditLogs.actorId, members.id))
		.where(
			and(
				eq(auditLogs.entityType, 'violation'),
				inArray(auditLogs.entityId, recordIds)
			)
		)
		.orderBy(desc(auditLogs.createdAt)) : [];

	const logsByEntityId = new Map<string, any[]>();
	for (const log of logsRows) {
		const logs = logsByEntityId.get(log.entityId) ?? [];
		const actorName =
			log.actorDisplayName ||
			`${log.actorFirstName ?? ''} ${log.actorLastName ?? ''}`.trim() ||
			log.actorEmail ||
			'System / Unknown';
		logs.push({ ...log, actorName });
		logsByEntityId.set(log.entityId, logs);
	}

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

	const records = violationRows.map((row) => {
		const reporterName =
			row.reporterDisplayName ||
			`${row.reporterFirstName ?? ''} ${row.reporterLastName ?? ''}`.trim() ||
			row.reporterEmail ||
			'Unknown reporter';

		return {
			...row,
			reporterName,
			resolverName: row.resolvedBy ? memberNameById.get(row.resolvedBy) ?? 'Unknown resolver' : null,
			logs: logsByEntityId.get(row.id) ?? []
		};
	});

	const statusCounts = {
		reported: records.filter((record) => record.status === 'reported').length,
		investigating: records.filter((record) => record.status === 'investigating').length,
		resolved: records.filter((record) => record.status === 'resolved').length,
		dismissed: records.filter((record) => record.status === 'dismissed').length
	};

	return {
		records,
		memberOptions,
		propertyOptions,
		violationTypes: VIOLATION_TYPES,
		statuses: VIOLATION_STATUSES,
		statusCounts
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const propertyId = parseOptionalUuid(formData.get('propertyId'));
		const reportedBy = parseOptionalUuid(formData.get('reportedBy')) ?? locals.member?.id ?? null;
		const statusRaw = ((formData.get('status') as string) || 'reported').trim();
		const notes = ((formData.get('notes') as string) || '').trim() || null;

		const parsed = violationReportSchema.safeParse({
			description: (formData.get('description') as string) ?? '',
			violationType: ((formData.get('violationType') as string) || 'other').trim(),
			lotNumber: undefined
		});

		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message || 'Invalid violation input.'
			});
		}
		if (!isViolationStatus(statusRaw)) {
			return fail(400, { error: 'Invalid violation status.' });
		}

		const resolvedNow = shouldSetResolution(statusRaw);
		const resolutionDate = resolvedNow ? new Date() : null;

		const inserted = await db.insert(violations).values({
			reportedBy,
			propertyId,
			description: parsed.data.description,
			violationType: parsed.data.violationType,
			status: statusRaw,
			notes,
			resolvedAt: resolutionDate,
			resolvedBy: resolvedNow ? (locals.member?.id ?? null) : null
		}).returning({ id: violations.id });

		if (inserted[0]) {
			await logAction('violation', inserted[0].id, locals.member?.id ?? null, 'create', 'Violation reported');
		}

		return { success: true };
	},

	update: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = parseOptionalUuid(formData.get('id'));
		const propertyId = parseOptionalUuid(formData.get('propertyId'));
		const reportedBy = parseOptionalUuid(formData.get('reportedBy'));
		const statusRaw = ((formData.get('status') as string) || 'reported').trim();
		const notes = ((formData.get('notes') as string) || '').trim() || null;

		if (!id) {
			return fail(400, { error: 'Violation ID is required.' });
		}
		if (!isViolationStatus(statusRaw)) {
			return fail(400, { error: 'Invalid violation status.' });
		}

		const parsed = violationReportSchema.safeParse({
			description: (formData.get('description') as string) ?? '',
			violationType: ((formData.get('violationType') as string) || 'other').trim(),
			lotNumber: undefined
		});

		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message || 'Invalid violation input.'
			});
		}

		const existingViolation = await db.select({ status: violations.status }).from(violations).where(eq(violations.id, id)).limit(1);

		const resolvedNow = shouldSetResolution(statusRaw);
		const resolutionDate = resolvedNow ? new Date() : null;

		await db
			.update(violations)
			.set({
				reportedBy,
				propertyId,
				description: parsed.data.description,
				violationType: parsed.data.violationType,
				status: statusRaw,
				notes,
				resolvedAt: resolutionDate,
				resolvedBy: resolvedNow ? (locals.member?.id ?? null) : null
			})
			.where(eq(violations.id, id));

		let details = 'Violation updated';
		let logActionType: 'update' | 'status_change' | 'review' = 'update';
		if (existingViolation[0]?.status !== statusRaw) {
			details = `Status changed to '${statusRaw}'`;
			logActionType = 'status_change';
		}
		await logAction('violation', id, locals.member?.id ?? null, logActionType, details);

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = parseOptionalUuid(formData.get('id'));
		if (!id) {
			return fail(400, { error: 'Violation ID is required.' });
		}

		await db.delete(violations).where(eq(violations.id, id));
		await logAction('violation', id, locals.member?.id ?? null, 'delete', 'Violation deleted');
		return { success: true };
	}
};
