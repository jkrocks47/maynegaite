import { fail } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members, properties } from '$lib/server/db/schema';
import { TOTAL_LOTS } from '$lib/utils/constants';
import type { Actions, PageServerLoad } from './$types';

interface ParsedPropertyInput {
	lotNumber: number;
	address: string | null;
	section: 'woods' | 'reserves' | null;
	propertyType: 'single_family' | 'townhome' | null;
	ownerId: string | null;
}

function parsePropertyInput(formData: FormData): { data?: ParsedPropertyInput; error?: string } {
	const lotNumberRaw = ((formData.get('lotNumber') as string) || '').trim();
	const lotNumber = Number(lotNumberRaw);
	if (!Number.isInteger(lotNumber) || lotNumber < 1 || lotNumber > TOTAL_LOTS) {
		return { error: `Lot number must be between 1 and ${TOTAL_LOTS}.` };
	}

	const sectionRaw = ((formData.get('section') as string) || '').trim();
	const section = sectionRaw === '' ? null : sectionRaw;
	if (section && section !== 'woods' && section !== 'reserves') {
		return { error: 'Invalid section.' };
	}

	const propertyTypeRaw = ((formData.get('propertyType') as string) || '').trim();
	const propertyType = propertyTypeRaw === '' ? null : propertyTypeRaw;
	if (propertyType && propertyType !== 'single_family' && propertyType !== 'townhome') {
		return { error: 'Invalid property type.' };
	}

	const ownerIdRaw = ((formData.get('ownerId') as string) || '').trim();

	return {
		data: {
			lotNumber,
			address: ((formData.get('address') as string) || '').trim() || null,
			section: section as 'woods' | 'reserves' | null,
			propertyType: propertyType as 'single_family' | 'townhome' | null,
			ownerId: ownerIdRaw || null
		}
	};
}

export const load: PageServerLoad = async () => {
	const lotRecords = await db
		.select({
			id: properties.id,
			lotNumber: properties.lotNumber,
			address: properties.address,
			section: properties.section,
			propertyType: properties.propertyType,
			ownerId: properties.ownerId,
			ownerFirstName: members.firstName,
			ownerLastName: members.lastName,
			ownerEmail: members.email,
			updatedAt: properties.updatedAt
		})
		.from(properties)
		.leftJoin(members, eq(properties.ownerId, members.id))
		.orderBy(asc(properties.lotNumber));

	const ownerOptions = await db
		.select({
			id: members.id,
			firstName: members.firstName,
			lastName: members.lastName,
			email: members.email,
			lotNumber: members.lotNumber
		})
		.from(members)
		.orderBy(asc(members.lastName), asc(members.firstName));

	return { lotRecords, ownerOptions };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const parsed = parsePropertyInput(formData);
		if (parsed.error || !parsed.data) {
			return fail(400, { error: parsed.error || 'Invalid property input.' });
		}

		try {
			await db.insert(properties).values(parsed.data);
		} catch (err) {
			console.error('[Properties:create]', err);
			return fail(400, { error: 'Failed to create property. Lot numbers must be unique.' });
		}

		return { success: true };
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) {
			return fail(400, { error: 'Property ID is required.' });
		}

		const parsed = parsePropertyInput(formData);
		if (parsed.error || !parsed.data) {
			return fail(400, { error: parsed.error || 'Invalid property input.' });
		}

		try {
			await db
				.update(properties)
				.set({ ...parsed.data, updatedAt: new Date() })
				.where(eq(properties.id, id));
		} catch (err) {
			console.error('[Properties:update]', err);
			return fail(400, { error: 'Failed to update property. Lot numbers must be unique.' });
		}

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) {
			return fail(400, { error: 'Property ID is required.' });
		}

		await db.delete(properties).where(eq(properties.id, id));
		return { success: true };
	}
};
