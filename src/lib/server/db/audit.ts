import { db } from './index';
import { auditLogs, members } from './schema';
import { desc, eq, and } from 'drizzle-orm';

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
