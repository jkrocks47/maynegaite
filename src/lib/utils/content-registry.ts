export type FieldType = 'short' | 'long' | 'markdown';

export interface ContentEntry {
	slug: string;
	section: string;
	label: string;
	fieldType: FieldType;
	defaultTitle?: string;
	defaultBody?: string;
	page: string;
}

export const contentEntries: ContentEntry[] = [
	// ── Homepage ──
	{
		slug: 'home',
		section: 'hero-title',
		label: 'Hero title on the homepage',
		fieldType: 'short',
		defaultBody: 'Welcome to Maynegaite',
		page: 'Homepage'
	},
	{
		slug: 'home',
		section: 'hero-subtitle',
		label: 'Hero subtitle / description text',
		fieldType: 'long',
		defaultBody:
			'An established residential community in Olympia Fields, Illinois — where neighbors become family.',
		page: 'Homepage'
	},
	{
		slug: 'home',
		section: 'hero-cta',
		label: 'Hero call-to-action button text',
		fieldType: 'short',
		defaultBody: 'View Events',
		page: 'Homepage'
	},
	{
		slug: 'home',
		section: 'events-title',
		label: 'Events section title',
		fieldType: 'short',
		defaultBody: 'Upcoming Events',
		page: 'Homepage'
	},
	{
		slug: 'home',
		section: 'about-title',
		label: 'About section title',
		fieldType: 'short',
		defaultBody: 'About Our Community',
		page: 'Homepage'
	},
	{
		slug: 'home',
		section: 'about-body',
		label: 'About section body text',
		fieldType: 'long',
		defaultBody:
			'Maynegaite is a premier residential subdivision in Olympia Fields, Illinois, governed by the Maynegaite Property Owners\' Association (MPOA). Our community encompasses 197 residential lots across Maynegaite Woods and The Reserves, offering a blend of spacious single-family estates and modern luxury townhomes.',
		page: 'Homepage'
	},
	{
		slug: 'home',
		section: 'quick-links-title',
		label: 'Quick links section title',
		fieldType: 'short',
		defaultBody: 'Homeowner Resources',
		page: 'Homepage'
	},

	// ── About Page ──
	{
		slug: 'about',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		defaultBody: 'About Maynegaite',
		page: 'About Page'
	},
	{
		slug: 'about',
		section: 'page-description',
		label: 'Short description below title',
		fieldType: 'long',
		defaultBody:
			'Discover the history and character of the Maynegaite community in Olympia Fields.',
		page: 'About Page'
	},
	{
		slug: 'about',
		section: 'history-body',
		label: 'History section text',
		fieldType: 'markdown',
		defaultBody:
			'The Maynegaite subdivision was developed in the late 1970s by Concord Homes, situated within the prestigious Village of Olympia Fields — one of the wealthiest and most highly educated majority African-American communities in the United States. Over the decades, Maynegaite has evolved from its original tract of single-family homes into a diverse residential matrix, adding The Reserves townhome community to serve a broader range of homeowners.',
		page: 'About Page'
	},
	{
		slug: 'about',
		section: 'amenities-title',
		label: 'Amenities section title',
		fieldType: 'short',
		defaultBody: 'Community Amenities',
		page: 'About Page'
	},
	{
		slug: 'about',
		section: 'amenities-body',
		label: 'Amenities section body',
		fieldType: 'markdown',
		defaultBody:
			'Maynegaite Park spans 4.2 acres of neighborhood green space at 21048 London Drive, featuring a picnic area, soccer field, and playground. Residents also enjoy proximity to Sgt. Means Park, Bicentennial Park, and the Olympia Fields Country Club.',
		page: 'About Page'
	},

	// ── Board Page ──
	{
		slug: 'board',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		defaultBody: 'Board of Directors',
		page: 'Board Page'
	},
	{
		slug: 'board',
		section: 'page-description',
		label: 'Description below title',
		fieldType: 'long',
		defaultBody:
			'Meet the dedicated professionals who govern the Maynegaite Property Owners\' Association.',
		page: 'Board Page'
	},

	// ── Events Page ──
	{
		slug: 'events',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		defaultBody: 'Community Events',
		page: 'Events Page'
	},

	// ── Gallery Page ──
	{
		slug: 'gallery',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		defaultBody: 'Photo Gallery',
		page: 'Gallery Page'
	},

	// ── Documents Page ──
	{
		slug: 'documents',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		defaultBody: 'Community Documents',
		page: 'Documents Page'
	},
	{
		slug: 'documents',
		section: 'page-description',
		label: 'Description below title',
		fieldType: 'long',
		defaultBody:
			'Access important community documents including bylaws, covenants, meeting minutes, and newsletters.',
		page: 'Documents Page'
	},

	// ── Contact Page ──
	{
		slug: 'contact',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		defaultBody: 'Contact Us',
		page: 'Contact Page'
	},
	{
		slug: 'contact',
		section: 'contact-heading',
		label: '"Get in Touch" heading',
		fieldType: 'short',
		defaultBody: 'Get in Touch',
		page: 'Contact Page'
	},
	{
		slug: 'contact',
		section: 'form-heading',
		label: '"Send a Message" form heading',
		fieldType: 'short',
		defaultBody: 'Send a Message',
		page: 'Contact Page'
	},

	// ── Footer ──
	{
		slug: 'footer',
		section: 'org-name',
		label: 'Organization name in footer',
		fieldType: 'short',
		defaultBody: 'Maynegaite Property Owners\' Association',
		page: 'Footer'
	},
	{
		slug: 'footer',
		section: 'tagline',
		label: 'Footer tagline',
		fieldType: 'short',
		defaultBody: 'Where neighbors become family.',
		page: 'Footer'
	},
	{
		slug: 'footer',
		section: 'address',
		label: 'Mailing address',
		fieldType: 'short',
		defaultBody: 'P.O. Box 214, Olympia Fields, IL 60461',
		page: 'Footer'
	}
];

export function getDefault(
	slug: string,
	section: string
): { title?: string; body?: string } {
	const entry = contentEntries.find((e) => e.slug === slug && e.section === section);
	return {
		title: entry?.defaultTitle,
		body: entry?.defaultBody
	};
}

export function getEntriesByPage(page: string): ContentEntry[] {
	return contentEntries.filter((e) => e.page === page);
}

export function getPageGroups(): string[] {
	const seen = new Set<string>();
	const result: string[] = [];
	for (const entry of contentEntries) {
		if (!seen.has(entry.page)) {
			seen.add(entry.page);
			result.push(entry.page);
		}
	}
	return result;
}
