import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { randomUUID } from 'crypto';
import pg from 'pg';
import sharp from 'sharp';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { images, officers } from '../src/lib/server/db/schema';

interface BoardImport {
	name: string;
	position: string;
	committeeType: 'board' | 'architectural';
	sortOrder: number;
	bio: string;
	imageFile: string;
}

const SHIREE_BIO = `Shiree Bush-Giblin has been a resident of Olympia Fields for 30 years, where she raised six children — all alumni of Arcadia Elementary School. Her three oldest graduated from Rich Central High School (now Rich Township High School), with two going on to earn degrees from Florida A&M University. Her three youngest attended Southland College Preparatory High School and are now at the University of Illinois at Chicago.

Shiree joined the Holiday Dinner Dance Committee in 2006 and was elected Vice President of the Maynegaite Property Owners Association in 2011. The following year, she joined the Olympia Fields Mayor's Golf Committee under State Representative Debbie Meyers-Martin, helping bring revenue back to the Maynegaite subdivision.

In 2017, she founded The Olympia Fields Event Committee, a nonprofit that continues to host the Annual Holiday Dinner Dance and All-White Dinner Dance at the Olympia Fields Country Club. The organization has raised funds for Good Shepherd and Arcadia Elementary School, supplied hats and gloves to Wheels and Meals volunteers, hosted a luncheon for seniors at the Rich Township Senior Center, and contributed to Girls Evolving into Maturity Sisters (GEMS).

In 2018, she partnered with Mayor Sterling M. Burke on an ordinance change that exempted Olympia Fields homeowners installing underground sprinklers from a $6,500 Village Hall fee. That same year, she was first elected President of the Maynegaite Property Owners Association, where her board launched a back-dues campaign that recovered $10,000 in three months. She currently serves again as President of the MPOA, continuing that work.

Since 2021, she has also served with the Democratic Women of the Southland Region (DWSR), amplifying her voice in the fight for democracy. She has studied at Florida Memorial University, Prairie State College, and Westwood College — earning an Applied Science degree in Graphic Design and a Medical Assistant license — and is currently pursuing a Bachelor of Science in Nursing. Over the years, she has contributed to the campaign committees of Congresswoman Robin Kelly, Judge Linzey Jones, State Representative Debbie Meyers-Martin, and the late Tim Bradford.

Her passion is helping others and giving back to her community — and there is no stopping her now.`;

const CORNELL_BIO = `My name is Cornell Hughes, and I have been a proud resident of Olympia Fields for over 30 years. I previously served as MPOA Treasurer from 2021 to 2023 and currently serve as Vice President of the Maynegaite Property Owners Association. As the owner of CBH Realty, I bring 27 years of extensive experience in real estate management, encompassing both residential and commercial properties. Throughout my career, I have dedicated myself to providing exceptional service, leveraging my deep knowledge of the local market, and fostering strong relationships within the community. My commitment to excellence ensures that I meet the diverse needs of my clients, whether they are looking to buy, sell, or manage real estate investments.`;

const DEBBIE_BIO = `Debbie Reaux-Alexander has been a proud resident of Maynegaite since 1996, and loves her beautiful, quiet, quaint, and exclusive community. She currently serves as Secretary of the Maynegaite Property Owners Association.

After graduating in 1971, she embarked on an exciting and whimsical musical career that led to recording contracts with RCA and Atlantic Records. She was a singer, songwriter, and performer who traveled the country, married the drummer and leader of the band MERGE-82 (Randy), and had two sons. She is now the proud grandmother — also called "GG" — of five.

She retired at 48 with 30 years from AT&T, helped create Ran Express, a 22-truck, 18-wheeler logistics company, and became a real estate investor and landlord via the Alexander family business, Bud Mar Investment Group LLC, which rehabbed and rented multi-family, single-family, and commercial real estate properties. She also opened a 24,000 sq. ft. roller skating rink in Richton Park, IL, called Rich City Skate — featured in the Emmy-nominated documentary "United Skates."

Debbie now works with Congresswoman Robin Kelly, helping constituents in District IL-02 who are experiencing issues with Federal agencies. In love with writing, she sometimes shares her wisdom and advice at "Keep Living You'll Learn" on Facebook: https://www.facebook.com/profile.php?id=100002094642152 — or join her group at https://www.facebook.com/groups/403411199864059/`;

const LEONARD_BIO = `Leonard Holmes migrated to Chicago, IL, from Southern Mississippi after graduating in 1972. He worked for various companies before beginning his career with Illinois Central Railroad in 1978, where he held several positions until his retirement as a Railroad Conductor in 2015.

Leonard has lived in the south suburbs for the past 35 years and has always sought ways to serve the community. He previously served as a Community Service Officer in the Village of Country Club Hills. He was attracted to Olympia Fields and the Maynegaite Community by the quiet community, well-kept homes, and beautifully landscaped area. He currently serves on the MPOA's Architectural Committee.

Leonard is a strong family man, the proud father of four and grandfather of thirteen. His hobbies include all sporting activities, cross-country motorcycle riding, and tinkering around in the garage. He is also a skilled handyman who enjoys working on projects around his home.

Leonard and his wife have lived in Maynegaite for 2 years.`;

const BOARD: BoardImport[] = [
	{
		name: 'Shiree Bush-Giblin',
		position: 'President',
		committeeType: 'board',
		sortOrder: 1,
		bio: SHIREE_BIO,
		imageFile: 'shiree giblin profile.webp'
	},
	{
		name: 'Cornell Hughes',
		position: 'Vice President',
		committeeType: 'board',
		sortOrder: 2,
		bio: CORNELL_BIO,
		imageFile: 'cornell huges profile.webp'
	},
	{
		name: 'Debbie Reaux-Alexander',
		position: 'Secretary',
		committeeType: 'board',
		sortOrder: 3,
		bio: DEBBIE_BIO,
		imageFile: 'debbie alex.webp'
	},
	{
		name: 'Leonard Holmes',
		position: 'Architectural',
		committeeType: 'architectural',
		sortOrder: 4,
		bio: LEONARD_BIO,
		imageFile: 'Leonard Holmes.webp'
	}
];

async function storeImage(
	db: ReturnType<typeof drizzle>,
	filePath: string
): Promise<string> {
	const buffer = await readFile(filePath);
	const meta = await sharp(buffer).metadata();
	if (!meta.width || !meta.height) {
		throw new Error(`Invalid image: ${filePath}`);
	}

	const full = await sharp(buffer)
		.resize(2400, 2400, { fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 82, effort: 4 })
		.toBuffer({ resolveWithObject: true });

	const thumb = await sharp(buffer)
		.resize(600, 600, { fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 72, effort: 4 })
		.toBuffer({ resolveWithObject: true });

	const groupId = randomUUID();

	await db.transaction(async (tx) => {
		await tx.insert(images).values({
			data: full.data,
			mimeType: 'image/webp',
			variant: 'full',
			groupId,
			width: full.info.width,
			height: full.info.height,
			sizeBytes: full.info.size
		});
		await tx.insert(images).values({
			data: thumb.data,
			mimeType: 'image/webp',
			variant: 'thumbnail',
			groupId,
			width: thumb.info.width,
			height: thumb.info.height,
			sizeBytes: thumb.info.size
		});
	});

	return `/api/images/${groupId}`;
}

async function main() {
	if (!process.env.DATABASE_URL) {
		console.error('DATABASE_URL not set. Run with: node --env-file=.env ...');
		process.exit(1);
	}

	const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
	const db = drizzle(pool);

	const repoRoot = resolve(process.cwd());

	try {
		for (const entry of BOARD) {
			const filePath = resolve(repoRoot, entry.imageFile);
			console.log(`Processing ${entry.name}...`);

			const existing = await db
				.select({ id: officers.id, imageUrl: officers.imageUrl })
				.from(officers)
				.where(eq(officers.name, entry.name))
				.limit(1);

			const imageUrl = await storeImage(db, filePath);

			if (existing.length > 0) {
				const prev = existing[0];
				await db
					.update(officers)
					.set({
						position: entry.position,
						committeeType: entry.committeeType,
						sortOrder: entry.sortOrder,
						bio: entry.bio,
						imageUrl,
						email: null
					})
					.where(eq(officers.id, prev.id));
				console.log(`  updated existing officer ${prev.id} → ${imageUrl}`);
			} else {
				const [inserted] = await db
					.insert(officers)
					.values({
						name: entry.name,
						position: entry.position,
						committeeType: entry.committeeType,
						sortOrder: entry.sortOrder,
						bio: entry.bio,
						imageUrl,
						email: null
					})
					.returning({ id: officers.id });
				console.log(`  inserted officer ${inserted.id} → ${imageUrl}`);
			}
		}

		console.log('Done.');
	} finally {
		await pool.end();
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
