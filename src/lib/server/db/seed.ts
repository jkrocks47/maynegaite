import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { hashPassword } from '../auth';
import { users, clubInfo } from './schema';

async function seed() {
	const email = process.env.ADMIN_EMAIL;
	const password = process.env.ADMIN_PASSWORD;

	if (!email || !password) {
		console.error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
		process.exit(1);
	}

	const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
	const db = drizzle(pool);

	const passwordHash = await hashPassword(password);

	await db
		.insert(users)
		.values({
			email,
			passwordHash,
			name: 'Admin',
			role: 'super_admin'
		})
		.onConflictDoNothing();

	// Seed club info
	await db
		.insert(clubInfo)
		.values([
			{
				clubType: 'astronomy',
				aboutText: 'UIC Astronomy Club — Exploring the universe from the urban canopy since 2010.',
				meetingInfo: 'Meetings every Thursday at 6 PM in SES 238',
				contactEmail: 'astro@uic.edu',
				socialLinks: { instagram: 'UICAstronomyClub', twitter: 'UICAstronomyClub' }
			},
			{
				clubType: 'physics',
				aboutText: 'UIC Physics Club — Advancing physics education and community at UIC.',
				meetingInfo: 'Meetings every Tuesday at 5 PM in SES 238',
				contactEmail: 'sps@uic.edu',
				socialLinks: { instagram: 'UICPhysicsClub' }
			}
		])
		.onConflictDoNothing();

	console.log('Seed complete: admin user and club info created.');
	await pool.end();
}

seed().catch(console.error);
