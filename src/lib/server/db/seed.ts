import { randomBytes } from 'crypto';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { inArray } from 'drizzle-orm';
import { hashPassword } from '../auth';
import {
	members,
	communityInfo,
	pageContent,
	officers,
	properties,
	documents
} from './schema';
import { contentEntries } from '$lib/utils/content-registry';

interface BoardAccountSeed {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	adminRole: 'tech_admin' | 'president' | 'vice_president' | 'treasurer' | 'secretary' | 'architectural_chair';
	position: string;
	committeeType: 'board' | 'architectural';
	bio: string;
	sortOrder: number;
	section: 'woods' | 'reserves' | null;
}

function resolveEnv(primary: string, aliases: string[] = []): string | undefined {
	const keys = [primary, ...aliases];
	for (const key of keys) {
		const value = process.env[key];
		if (value && value.trim().length > 0) {
			return value.trim();
		}
	}
	return undefined;
}

function reportMissingAndExit(missing: string[]): never {
	console.error('Missing required seed environment variables:');
	for (const item of missing) {
		console.error(` - ${item}`);
	}
	process.exit(1);
}

async function seed() {
	const presidentEmail = resolveEnv('ADMIN_EMAIL', ['SEED_PRESIDENT_EMAIL']);
	const presidentPassword = resolveEnv('ADMIN_PASSWORD', ['SEED_PRESIDENT_PASSWORD']);
	const vpEmail = resolveEnv('SEED_VP_EMAIL');
	const vpPassword = resolveEnv('SEED_VP_PASSWORD');
	const treasurerEmail = resolveEnv('SEED_TREASURER_EMAIL');
	const treasurerPassword = resolveEnv('SEED_TREASURER_PASSWORD');
	const secretaryEmail = resolveEnv('SEED_SECRETARY_EMAIL');
	const secretaryPassword = resolveEnv('SEED_SECRETARY_PASSWORD');
	const archChairEmail = resolveEnv('SEED_ARCH_CHAIR_EMAIL');
	const archChairPassword = resolveEnv('SEED_ARCH_CHAIR_PASSWORD');

	const missing: string[] = [];
	if (!presidentEmail) missing.push('ADMIN_EMAIL (or SEED_PRESIDENT_EMAIL)');
	if (!presidentPassword) missing.push('ADMIN_PASSWORD (or SEED_PRESIDENT_PASSWORD)');
	if (!vpEmail) missing.push('SEED_VP_EMAIL');
	if (!vpPassword) missing.push('SEED_VP_PASSWORD');
	if (!treasurerEmail) missing.push('SEED_TREASURER_EMAIL');
	if (!treasurerPassword) missing.push('SEED_TREASURER_PASSWORD');
	if (!secretaryEmail) missing.push('SEED_SECRETARY_EMAIL');
	if (!secretaryPassword) missing.push('SEED_SECRETARY_PASSWORD');
	if (!archChairEmail) missing.push('SEED_ARCH_CHAIR_EMAIL');
	if (!archChairPassword) missing.push('SEED_ARCH_CHAIR_PASSWORD');

	if (missing.length > 0) {
		reportMissingAndExit(missing);
	}

	const boardAccounts: BoardAccountSeed[] = [
		{
			firstName: 'Shiree',
			lastName: 'Bush-Giblin',
			email: presidentEmail!.toLowerCase(),
			password: presidentPassword!,
			adminRole: 'president',
			position: 'President',
			committeeType: 'board',
			bio: 'A resident of Olympia Fields for 30 years, serving as MPOA President since 2018.',
			sortOrder: 1,
			section: 'woods'
		},
		{
			firstName: 'Cornell',
			lastName: 'Hughes',
			email: vpEmail!.toLowerCase(),
			password: vpPassword!,
			adminRole: 'vice_president',
			position: 'Vice President',
			committeeType: 'board',
			bio: 'A proud resident for over 30 years and owner of CBH Realty.',
			sortOrder: 2,
			section: 'woods'
		},
		{
			firstName: 'Joan',
			lastName: 'Archie',
			email: treasurerEmail!.toLowerCase(),
			password: treasurerPassword!,
			adminRole: 'treasurer',
			position: 'Treasurer',
			committeeType: 'board',
			bio: 'A longtime resident and active steward of community finances.',
			sortOrder: 3,
			section: 'reserves'
		},
		{
			firstName: 'Debbie',
			lastName: 'Alexander',
			email: secretaryEmail!.toLowerCase(),
			password: secretaryPassword!,
			adminRole: 'secretary',
			position: 'Secretary',
			committeeType: 'board',
			bio: 'Resident since 1996 and experienced community records coordinator.',
			sortOrder: 4,
			section: 'woods'
		},
		{
			firstName: 'Leonard',
			lastName: 'Holmes',
			email: archChairEmail!.toLowerCase(),
			password: archChairPassword!,
			adminRole: 'architectural_chair',
			position: 'Architectural Committee Chair',
			committeeType: 'architectural',
			bio: 'Retired railroad conductor bringing practical review experience.',
			sortOrder: 5,
			section: 'reserves'
		}
	];

	const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
	const db = drizzle(pool);

	try {
		for (const account of boardAccounts) {
			const passwordHash = await hashPassword(account.password);
			await db
				.insert(members)
				.values({
					email: account.email,
					passwordHash,
					firstName: account.firstName,
					lastName: account.lastName,
					displayName: `${account.firstName} ${account.lastName}`,
					role: 'board',
					adminRole: account.adminRole,
					emailVerified: true,
					section: account.section,
					unsubscribeToken: randomBytes(32).toString('hex')
				})
				.onConflictDoNothing();
		}

		const seededMembers = await db
			.select({
				id: members.id,
				email: members.email,
				displayName: members.displayName
			})
			.from(members)
			.where(inArray(members.email, boardAccounts.map((account) => account.email)));

		const memberIdByEmail = new Map(seededMembers.map((member) => [member.email, member.id]));
		const presidentId = memberIdByEmail.get(boardAccounts[0].email) ?? null;

		const existingCommunity = await db.select({ id: communityInfo.id }).from(communityInfo).limit(1);
		if (existingCommunity.length === 0) {
			await db.insert(communityInfo).values({
				aboutText:
					"Maynegaite is a premier residential subdivision in Olympia Fields, Illinois, governed by the Maynegaite Property Owners' Association (MPOA). Our community encompasses 197 residential lots across Maynegaite Woods and The Reserves.",
				meetingInfo:
					'Board meetings are typically held monthly. Check the events calendar for date and location updates.',
				contactEmail: 'info@maynegaite.com',
				mailingAddress: 'P.O. Box 214, Olympia Fields, IL 60461',
				phone: '',
				emergencyContact:
					'For emergencies, contact the Village of Olympia Fields at (708) 503-8000.',
				paymentUrl: '',
				socialLinks: {}
			});
		}

		const existingOfficers = await db.select({ id: officers.id }).from(officers).limit(1);
		if (existingOfficers.length === 0) {
			await db.insert(officers).values(
				boardAccounts.map((account) => ({
					memberId: memberIdByEmail.get(account.email) ?? null,
					name: `${account.firstName} ${account.lastName}`,
					position: account.position,
					committeeType: account.committeeType,
					email: account.email,
					bio: account.bio,
					sortOrder: account.sortOrder
				}))
			);
		}

		const propertyRows: {
			lotNumber: number;
			section: 'woods' | 'reserves';
			propertyType: 'single_family' | 'townhome';
		}[] = [];

		for (let lot = 1; lot <= 165; lot++) {
			propertyRows.push({
				lotNumber: lot,
				section: 'woods',
				propertyType: 'single_family'
			});
		}

		for (let lot = 166; lot <= 197; lot++) {
			propertyRows.push({
				lotNumber: lot,
				section: 'reserves',
				propertyType: 'townhome'
			});
		}

		await db.insert(properties).values(propertyRows).onConflictDoNothing();

		const contentRows: {
			slug: string;
			section: string;
			title: string | null;
			body: string | null;
		}[] = contentEntries.map((entry) => ({
			slug: entry.slug,
			section: entry.section,
			title: entry.defaultTitle ?? null,
			body: entry.defaultBody ?? null
		}));

		if (contentRows.length > 0) {
			await db.insert(pageContent).values(contentRows).onConflictDoNothing();
		}

		const existingDocuments = await db.select({ id: documents.id }).from(documents).limit(1);
		if (existingDocuments.length === 0) {
			await db.insert(documents).values([
				{
					title: 'MPOA Bylaws',
					description: 'Current bylaws governing MPOA operations and board procedures.',
					category: 'bylaws',
					fileUrl: 'https://maynegaite.com/documents/mpoa-bylaws.pdf',
					publishedAt: new Date('2025-01-15T12:00:00Z'),
					uploadedBy: presidentId
				},
				{
					title: 'Covenants and Restrictions',
					description: 'Recorded covenants, conditions, and restrictions for the subdivision.',
					category: 'covenant',
					fileUrl: 'https://maynegaite.com/documents/covenants.pdf',
					publishedAt: new Date('2025-01-15T12:00:00Z'),
					uploadedBy: presidentId
				},
				{
					title: 'Board Meeting Minutes - January 2026',
					description: 'Approved monthly board meeting minutes.',
					category: 'minutes',
					fileUrl: 'https://maynegaite.com/documents/minutes-2026-01.pdf',
					publishedAt: new Date('2026-01-31T18:00:00Z'),
					uploadedBy: presidentId
				}
			]);
		}

		console.log(
			`Seed complete: ${boardAccounts.length} board accounts, 197 properties, community info, page content, officers, and sample documents.`
		);
	} finally {
		await pool.end();
	}
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
