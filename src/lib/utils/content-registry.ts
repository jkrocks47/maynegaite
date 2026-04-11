export type FieldType = 'short' | 'long' | 'markdown' | 'list';

export interface ContentEntry {
	slug: string;
	section: string;
	label: string;
	fieldType: FieldType;
	defaultTitle?: string;
	defaultBody?: string;
	page: string;
	listSchema?: {
		fields: { key: string; label: string; type: 'text' | 'textarea' | 'image' | 'link' }[];
	};
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

	// ── Owner Resources Page ──
	{
		slug: 'owner-resources',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		defaultBody: 'Owner Resources',
		page: 'Owner Resources Page'
	},
	{
		slug: 'owner-resources',
		section: 'page-description',
		label: 'Description below title',
		fieldType: 'long',
		defaultBody: 'Essential tools, announcements, and information for Maynegaite homeowners.',
		page: 'Owner Resources Page'
	},
	{
		slug: 'owner-resources',
		section: 'board-title',
		label: 'Board section title',
		fieldType: 'short',
		defaultBody: 'MPOA Board — Newly Elected Officials',
		page: 'Owner Resources Page'
	},
	{
		slug: 'owner-resources',
		section: 'board-description',
		label: 'Board section description',
		fieldType: 'long',
		defaultBody: 'Meet your recently elected board directors.',
		page: 'Owner Resources Page'
	},
	{
		slug: 'owner-resources',
		section: 'faq-title',
		label: 'FAQ section title',
		fieldType: 'short',
		defaultBody: 'Frequently Asked Questions',
		page: 'Owner Resources Page'
	},
	{
		slug: 'owner-resources',
		section: 'faq-description',
		label: 'FAQ section description',
		fieldType: 'long',
		defaultBody: 'Common questions from Maynegaite homeowners.',
		page: 'Owner Resources Page'
	},
	{
		slug: 'owner-resources',
		section: 'resource-grid',
		label: 'Main Resource Grid Cards',
		fieldType: 'list',
		page: 'Owner Resources Page',
		listSchema: {
			fields: [
				{ key: 'title', label: 'Item Title', type: 'text' },
				{ key: 'description', label: 'Description', type: 'textarea' },
				{ key: 'link', label: 'Link URL', type: 'text' },
				{ key: 'linkText', label: 'Link CTA Text', type: 'text' },
				{ key: 'icon', label: 'Icon (star, warning, doc, emergency, house)', type: 'text' }
			]
		}
	},
	{
		slug: 'owner-resources',
		section: 'faq-list',
		label: 'FAQ Items',
		fieldType: 'list',
		page: 'Owner Resources Page',
		listSchema: {
			fields: [
				{ key: 'q', label: 'Question', type: 'text' },
				{ key: 'a', label: 'Answer (HTML supported)', type: 'textarea' }
			]
		}
	},
	{
		slug: 'owner-resources',
		section: 'village-resources',
		label: 'Village Resources Links',
		fieldType: 'list',
		page: 'Owner Resources Page',
		listSchema: {
			fields: [
				{ key: 'label', label: 'Resource Label', type: 'text' },
				{ key: 'url', label: 'Resource URL', type: 'text' },
				{ key: 'icon', label: 'Icon (globe, calendar, users, doc)', type: 'text' }
			]
		}
	},
	{
		slug: 'owner-resources',
		section: 'reminders',
		label: 'Community Reminders (Bulleted list)',
		fieldType: 'markdown',
		page: 'Owner Resources Page',
		defaultBody: '- "For Sale" signs are **not permitted** within the subdivision.\n- All exterior modifications require Architectural Committee approval.\n- The Village offers a **$2,000 annual grant**.\n- Keep your property maintained.'
	},
	{
		slug: 'owner-resources',
		section: 'additional-content',
		label: 'Additional Content (Bottom of page)',
		fieldType: 'markdown',
		page: 'Owner Resources Page',
		defaultBody: ''
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
