export const ADMIN_ROLES = [
	'president',
	'vice_president',
	'treasurer',
	'secretary',
	'architectural_chair',
	'board_member'
] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const MEMBER_ROLES = ['member', 'board'] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export const RSVP_STATUSES = ['going', 'maybe', 'not_going'] as const;
export type RsvpStatus = (typeof RSVP_STATUSES)[number];

export const SECTIONS = ['woods', 'reserves'] as const;
export type Section = (typeof SECTIONS)[number];

export const PROPERTY_TYPES = ['single_family', 'townhome'] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const EVENT_CATEGORIES = [
	'community',
	'board_meeting',
	'village',
	'social',
	'maintenance'
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const TOTAL_LOTS = 197;

export const SITE_NAME = 'Maynegaite POA';
export const SITE_DESCRIPTION =
	'Maynegaite Property Owners\' Association — Olympia Fields, Illinois';

export const OLYMPIA_FIELDS_COORDINATES = {
	lat: 41.5131,
	lng: -87.6834,
	display: '41.5131° N, 87.6834° W'
};

export const CONTACT_EMAIL = 'info@maynegaite.com';

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
	community: 'Community',
	board_meeting: 'Board Meeting',
	village: 'Village',
	social: 'Social',
	maintenance: 'Maintenance'
};

export const SECTION_LABELS: Record<Section, string> = {
	woods: 'Maynegaite Woods',
	reserves: 'The Reserves'
};

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
	president: 'President',
	vice_president: 'Vice President',
	treasurer: 'Treasurer',
	secretary: 'Secretary',
	architectural_chair: 'Architectural Chair',
	board_member: 'Board Member'
};

export function canManageAdmin(role: AdminRole | null): boolean {
	if (!role) return false;
	return true;
}

export function isExecutiveRole(role: AdminRole | null): boolean {
	if (!role) return false;
	return role === 'president' || role === 'vice_president';
}

export function canManageArchitectural(role: AdminRole | null): boolean {
	if (!role) return false;
	return role === 'president' || role === 'architectural_chair';
}

export function canManageFinances(role: AdminRole | null): boolean {
	if (!role) return false;
	return role === 'president' || role === 'treasurer';
}
