import { eq, and, sql, inArray } from 'drizzle-orm';
import { db } from './index';
import {
	officers,
	events,
	eventRsvps,
	eventCheckins,
	members,
	eventAnnouncementLogs,
	communityInfo
} from './schema';
import { CONTACT_EMAIL } from '$lib/utils/constants';

export async function getBoardEmails(): Promise<string[]> {
	const [boardOfficers, communityResult] = await Promise.all([
		db.select({ email: officers.email }).from(officers),
		db
			.select({ contactEmail: communityInfo.contactEmail })
			.from(communityInfo)
			.limit(1)
	]);

	const officerEmails = boardOfficers
		.map((o) => o.email)
		.filter((e): e is string => !!e);

	const contactEmail = communityResult[0]?.contactEmail;
	const baseEmails = contactEmail ? [contactEmail] : [CONTACT_EMAIL];

	return [...new Set([...baseEmails, ...officerEmails])];
}

// --- Event Analytics Queries ---

export interface RsvpMemberDetail {
	memberId: string;
	firstName: string;
	lastName: string;
	email: string;
	status: string;
	checkedIn: boolean;
	reliabilityScore: number | null;
}

export interface EventStats {
	going: number;
	maybe: number;
	notGoing: number;
	checkedIn: number;
	estimatedTurnout: number;
}

export async function getEventRsvpList(eventId: string): Promise<RsvpMemberDetail[]> {
	const rsvps = await db
		.select({
			memberId: eventRsvps.memberId,
			firstName: members.firstName,
			lastName: members.lastName,
			email: members.email,
			status: eventRsvps.status,
			checkinId: eventCheckins.id
		})
		.from(eventRsvps)
		.innerJoin(members, eq(eventRsvps.memberId, members.id))
		.leftJoin(
			eventCheckins,
			and(
				eq(eventRsvps.eventId, eventCheckins.eventId),
				eq(eventRsvps.memberId, eventCheckins.memberId)
			)
		)
		.where(eq(eventRsvps.eventId, eventId));

	if (rsvps.length === 0) return [];

	const memberIds = rsvps.map((r) => r.memberId);
	const scores = await getMemberReliabilityScores(memberIds);

	return rsvps.map((r) => ({
		memberId: r.memberId,
		firstName: r.firstName,
		lastName: r.lastName,
		email: r.email,
		status: r.status,
		checkedIn: r.checkinId !== null,
		reliabilityScore: scores.get(r.memberId) ?? null
	}));
}

export async function getMemberReliabilityScores(
	memberIds: string[]
): Promise<Map<string, number>> {
	if (memberIds.length === 0) return new Map();

	const rows = await db
		.select({
			memberId: eventRsvps.memberId,
			totalGoing: sql<number>`count(*)::int`,
			actualCheckins: sql<number>`count(${eventCheckins.id})::int`
		})
		.from(eventRsvps)
		.innerJoin(events, eq(eventRsvps.eventId, events.id))
		.leftJoin(
			eventCheckins,
			and(
				eq(eventRsvps.eventId, eventCheckins.eventId),
				eq(eventRsvps.memberId, eventCheckins.memberId)
			)
		)
		.where(
			and(
				inArray(eventRsvps.memberId, memberIds),
				eq(eventRsvps.status, 'going'),
				sql`${events.date} < CURRENT_DATE`
			)
		)
		.groupBy(eventRsvps.memberId);

	const scoreMap = new Map<string, number>();
	for (const row of rows) {
		if (row.totalGoing > 0) {
			scoreMap.set(row.memberId, row.actualCheckins / row.totalGoing);
		}
	}
	return scoreMap;
}

export async function getEstimatedTurnout(eventId: string): Promise<number> {
	const rsvps = await db
		.select({
			memberId: eventRsvps.memberId,
			status: eventRsvps.status
		})
		.from(eventRsvps)
		.where(
			and(eq(eventRsvps.eventId, eventId), sql`${eventRsvps.status} IN ('going', 'maybe')`)
		);

	if (rsvps.length === 0) return 0;

	const memberIds = rsvps.map((r) => r.memberId);
	const scores = await getMemberReliabilityScores(memberIds);

	const DEFAULT_RELIABILITY = 0.5;
	const MAYBE_WEIGHT = 0.3;

	let estimated = 0;
	for (const rsvp of rsvps) {
		const reliability = scores.get(rsvp.memberId) ?? DEFAULT_RELIABILITY;
		if (rsvp.status === 'going') {
			estimated += reliability;
		} else if (rsvp.status === 'maybe') {
			estimated += reliability * MAYBE_WEIGHT;
		}
	}

	return Math.round(estimated * 10) / 10;
}

export async function getHistoricalTurnoutRate(): Promise<number | null> {
	const rows = await db
		.select({
			eventId: events.id,
			goingCount: sql<number>`(SELECT count(*) FROM event_rsvps WHERE event_id = ${events.id} AND status = 'going')::int`,
			checkinCount: sql<number>`(SELECT count(*) FROM event_checkins WHERE event_id = ${events.id})::int`
		})
		.from(events)
		.where(sql`${events.date} < CURRENT_DATE`);

	const eventsWithGoingRsvps = rows.filter((r) => r.goingCount > 0);
	if (eventsWithGoingRsvps.length === 0) return null;

	const totalRate = eventsWithGoingRsvps.reduce(
		(sum, r) => sum + r.checkinCount / r.goingCount,
		0
	);
	return Math.round((totalRate / eventsWithGoingRsvps.length) * 100);
}

export async function getEventDetailForAdmin(eventId: string) {
	const eventResult = await db
		.select()
		.from(events)
		.where(eq(events.id, eventId))
		.limit(1);

	if (eventResult.length === 0) return null;

	const event = eventResult[0];
	const rsvpList = await getEventRsvpList(eventId);
	const estimatedTurnout = await getEstimatedTurnout(eventId);
	const historicalRate = await getHistoricalTurnoutRate();

	const checkins = await db
		.select({
			memberId: eventCheckins.memberId,
			firstName: members.firstName,
			lastName: members.lastName,
			responses: eventCheckins.questionResponses,
			checkedInAt: eventCheckins.checkedInAt
		})
		.from(eventCheckins)
		.innerJoin(members, eq(eventCheckins.memberId, members.id))
		.where(eq(eventCheckins.eventId, eventId));

	const stats: EventStats = {
		going: rsvpList.filter((r) => r.status === 'going').length,
		maybe: rsvpList.filter((r) => r.status === 'maybe').length,
		notGoing: rsvpList.filter((r) => r.status === 'not_going').length,
		checkedIn: checkins.length,
		estimatedTurnout
	};

	return { event, rsvpList, stats, historicalRate, checkinResponses: checkins };
}

export async function getBatchEstimatedTurnout(
	eventIds: string[]
): Promise<Map<string, number>> {
	if (eventIds.length === 0) return new Map();

	const rsvps = await db
		.select({
			eventId: eventRsvps.eventId,
			memberId: eventRsvps.memberId,
			status: eventRsvps.status
		})
		.from(eventRsvps)
		.where(
			and(
				inArray(eventRsvps.eventId, eventIds),
				sql`${eventRsvps.status} IN ('going', 'maybe')`
			)
		);

	if (rsvps.length === 0) return new Map();

	const allMemberIds = [...new Set(rsvps.map((r) => r.memberId))];
	const scores = await getMemberReliabilityScores(allMemberIds);

	const DEFAULT_RELIABILITY = 0.5;
	const MAYBE_WEIGHT = 0.3;
	const turnoutMap = new Map<string, number>();

	for (const rsvp of rsvps) {
		const reliability = scores.get(rsvp.memberId) ?? DEFAULT_RELIABILITY;
		const contribution =
			rsvp.status === 'going' ? reliability : reliability * MAYBE_WEIGHT;
		turnoutMap.set(rsvp.eventId, (turnoutMap.get(rsvp.eventId) ?? 0) + contribution);
	}

	for (const [key, val] of turnoutMap) {
		turnoutMap.set(key, Math.round(val * 10) / 10);
	}

	return turnoutMap;
}

// --- Membership Stats ---

export interface MembershipStats {
	totalMembers: number;
	woodsMembers: number;
	reservesMembers: number;
	verifiedMembers: number;
}

export async function getMembershipStats(): Promise<MembershipStats> {
	const rows = await db
		.select({
			totalMembers: sql<number>`count(*)::int`,
			woodsMembers: sql<number>`count(*) FILTER (WHERE ${members.section} = 'woods')::int`,
			reservesMembers: sql<number>`count(*) FILTER (WHERE ${members.section} = 'reserves')::int`,
			verifiedMembers: sql<number>`count(*) FILTER (WHERE ${members.emailVerified} = true)::int`
		})
		.from(members);

	const r = rows[0];
	return {
		totalMembers: r.totalMembers,
		woodsMembers: r.woodsMembers,
		reservesMembers: r.reservesMembers,
		verifiedMembers: r.verifiedMembers
	};
}

// --- Event Announcement Queries ---

export async function getAnnouncementRecipients(
	eventId: string
): Promise<{ id: string; email: string; firstName: string; unsubscribeToken: string }[]> {
	return db
		.select({
			id: members.id,
			email: members.email,
			firstName: members.firstName,
			unsubscribeToken: members.unsubscribeToken
		})
		.from(members)
		.where(
			and(
				eq(members.emailVerified, true),
				eq(members.emailOptOut, false),
				sql`NOT EXISTS (
					SELECT 1 FROM event_announcement_logs eal
					WHERE eal.event_id = ${eventId}
						AND eal.member_id = ${members.id}
				)`
			)
		);
}

export async function getAnnouncementRecipientCount(
	eventId: string
): Promise<number> {
	const result = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(members)
		.where(
			and(
				eq(members.emailVerified, true),
				eq(members.emailOptOut, false),
				sql`NOT EXISTS (
					SELECT 1 FROM event_announcement_logs eal
					WHERE eal.event_id = ${eventId}
						AND eal.member_id = ${members.id}
				)`
			)
		);

	return result[0]?.count ?? 0;
}

export async function getCorrectionRecipients(
	eventId: string
): Promise<{ id: string; email: string; firstName: string; unsubscribeToken: string }[]> {
	return db
		.select({
			id: members.id,
			email: members.email,
			firstName: members.firstName,
			unsubscribeToken: members.unsubscribeToken
		})
		.from(eventAnnouncementLogs)
		.innerJoin(members, eq(eventAnnouncementLogs.memberId, members.id))
		.where(
			and(
				eq(eventAnnouncementLogs.eventId, eventId),
				eq(members.emailOptOut, false)
			)
		);
}
