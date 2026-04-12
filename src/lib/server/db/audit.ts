import { db } from './index';
import { auditLogs, members } from './schema';
import { desc, eq, and, sql } from 'drizzle-orm';

type AuditLogAction = 'create' | 'update' | 'delete' | 'status_change' | 'review';

export async function logAction(
	entityType: string,
	entityId: string,
	actorId: string | null,
	action: AuditLogAction,
	details?: string
): Promise<void> {
	await db.insert(auditLogs).values({
		entityType,
		entityId,
		actorId,
		action,
		details
	});
}

export async function getAllLogs(options: {
	limit?: number;
	offset?: number;
	entityType?: string;
	action?: AuditLogAction;
} = {}) {
	const { limit = 50, offset = 0, entityType, action } = options;

	const conditions = [];
	if (entityType) conditions.push(eq(auditLogs.entityType, entityType));
	if (action) conditions.push(eq(auditLogs.action, action));

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const [rows, countResult] = await Promise.all([
		db
			.select({
				id: auditLogs.id,
				entityType: auditLogs.entityType,
				entityId: auditLogs.entityId,
				actorId: auditLogs.actorId,
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
			.where(whereClause)
			.orderBy(desc(auditLogs.createdAt))
			.limit(limit)
			.offset(offset),
		db
			.select({ count: sql<number>`count(*)::int` })
			.from(auditLogs)
			.where(whereClause)
	]);

	return { rows, total: countResult[0]?.count ?? 0 };
}

export async function getEntityLogs(entityType: string, entityId: string) {
	return db
		.select({
			id: auditLogs.id,
			actorId: auditLogs.actorId,
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
			and(eq(auditLogs.entityType, entityType), eq(auditLogs.entityId, entityId))
		)
		.orderBy(desc(auditLogs.createdAt));
}
