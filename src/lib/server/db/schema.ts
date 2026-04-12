import {
	pgTable,
	uuid,
	text,
	timestamp,
	boolean,
	integer,
	date,
	jsonb,
	pgEnum,
	unique,
	customType,
	index
} from 'drizzle-orm/pg-core';

const bytea = customType<{ data: Buffer }>({
	dataType() {
		return 'bytea';
	},
	fromDriver(value) {
		return value as Buffer;
	},
	toDriver(value) {
		return value;
	}
});

// --- Enums ---

export const imageVariantEnum = pgEnum('image_variant', ['full', 'thumbnail']);
export const adminRoleEnum = pgEnum('admin_role', [
	'tech_admin',
	'president',
	'vice_president',
	'treasurer',
	'secretary',
	'architectural_chair',
	'board_member'
]);
export const memberRoleEnum = pgEnum('member_role', ['member', 'board']);
export const rsvpStatusEnum = pgEnum('rsvp_status', ['going', 'maybe', 'not_going']);
export const reminderTypeEnum = pgEnum('reminder_type', ['7_day', '1_day', 'day_of']);
export const sectionEnum = pgEnum('section_type', ['woods']);
export const propertyTypeEnum = pgEnum('property_type', ['single_family', 'townhome']);
export const eventCategoryEnum = pgEnum('event_category', [
	'community',
	'board_meeting',
	'village',
	'social',
	'maintenance'
]);
export const architecturalRequestTypeEnum = pgEnum('architectural_request_type', [
	'modification',
	'new_construction',
	'fence',
	'landscaping',
	'paint',
	'other'
]);
export const architecturalRequestStatusEnum = pgEnum('architectural_request_status', [
	'submitted',
	'under_review',
	'approved',
	'denied',
	'revision_requested'
]);
export const violationTypeEnum = pgEnum('violation_type', [
	'signage',
	'architectural',
	'maintenance',
	'noise',
	'other'
]);
export const violationStatusEnum = pgEnum('violation_status', [
	'reported',
	'investigating',
	'resolved',
	'dismissed'
]);
export const documentCategoryEnum = pgEnum('document_category', [
	'bylaws',
	'minutes',
	'newsletter',
	'financial',
	'covenant',
	'other'
]);

export const auditLogActionEnum = pgEnum('audit_log_action', [
	'create',
	'update',
	'delete',
	'status_change',
	'review'
]);

// --- Members & Auth ---

export const members = pgTable('members', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	displayName: text('display_name').notNull(),
	role: memberRoleEnum('role').notNull().default('member'),
	adminRole: adminRoleEnum('admin_role'),
	emailVerified: boolean('email_verified').notNull().default(false),
	phone: text('phone'),
	address: text('address'),
	lotNumber: integer('lot_number'),
	section: sectionEnum('section'),
	propertyType: propertyTypeEnum('property_type'),
	directoryOptIn: boolean('directory_opt_in').notNull().default(false),
	moveInDate: date('move_in_date'),
	emailOptOut: boolean('email_opt_out').notNull().default(false),
	unsubscribeToken: text('unsubscribe_token').notNull().unique(),
	secondaryEmail: text('secondary_email'),
	profileImageUrl: text('profile_image_url'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const memberSessions = pgTable('member_sessions', {
	id: text('id').primaryKey(),
	memberId: uuid('member_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow()
});

export const emailVerificationTokens = pgTable('email_verification_tokens', {
	id: uuid('id').primaryKey().defaultRandom(),
	memberId: uuid('member_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	token: text('token').notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow()
});

export const passwordResetTokens = pgTable('password_reset_tokens', {
	id: uuid('id').primaryKey().defaultRandom(),
	memberId: uuid('member_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	token: text('token').notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	usedAt: timestamp('used_at'),
	createdAt: timestamp('created_at').defaultNow()
});

// --- Events & RSVPs ---

export const events = pgTable('events', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	description: text('description'),
	date: date('date').notNull(),
	time: text('time'),
	location: text('location'),
	locationUrl: text('location_url'),
	eventCategory: eventCategoryEnum('event_category').notNull().default('community'),
	imageUrl: text('image_url'),
	imageGroupId: text('image_public_id'),
	isPublished: boolean('is_published').default(true),
	maxAttendees: integer('max_attendees'),
	checkinCode: text('checkin_code').unique(),
	checkinQuestions: jsonb('checkin_questions').$type<CheckinQuestion[]>(),
	announcementSentAt: timestamp('announcement_sent_at'),
	createdBy: uuid('created_by').references(() => members.id),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const eventAnnouncementLogs = pgTable(
	'event_announcement_logs',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		eventId: uuid('event_id')
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		memberId: uuid('member_id')
			.notNull()
			.references(() => members.id, { onDelete: 'cascade' }),
		sentAt: timestamp('sent_at').notNull().defaultNow()
	},
	(t) => [unique().on(t.eventId, t.memberId)]
);

export const eventRsvps = pgTable(
	'event_rsvps',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		eventId: uuid('event_id')
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		memberId: uuid('member_id')
			.notNull()
			.references(() => members.id, { onDelete: 'cascade' }),
		status: rsvpStatusEnum('status').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(t) => [unique().on(t.eventId, t.memberId)]
);

export const eventCheckins = pgTable(
	'event_checkins',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		eventId: uuid('event_id')
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		memberId: uuid('member_id')
			.notNull()
			.references(() => members.id, { onDelete: 'cascade' }),
		checkedInAt: timestamp('checked_in_at').notNull().defaultNow(),
		questionResponses: jsonb('question_responses').$type<Record<string, string | string[]>>()
	},
	(t) => [unique().on(t.eventId, t.memberId)]
);

export const reminderLogs = pgTable(
	'reminder_logs',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		eventId: uuid('event_id')
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		memberId: uuid('member_id')
			.notNull()
			.references(() => members.id, { onDelete: 'cascade' }),
		reminderType: reminderTypeEnum('reminder_type').notNull(),
		rsvpStatus: rsvpStatusEnum('rsvp_status').notNull(),
		sentAt: timestamp('sent_at').notNull().defaultNow()
	},
	(t) => [unique().on(t.eventId, t.memberId, t.reminderType)]
);

// --- Announcements ---

export const announcements = pgTable('announcements', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	body: text('body').notNull(),
	category: text('category'),
	isPinned: boolean('is_pinned').notNull().default(false),
	publishAt: timestamp('publish_at'),
	expiresAt: timestamp('expires_at'),
	createdBy: uuid('created_by').references(() => members.id),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// --- Gallery ---

export const galleryImages = pgTable('gallery_images', {
	id: uuid('id').primaryKey().defaultRandom(),
	url: text('url').notNull(),
	thumbnailUrl: text('thumbnail_url'),
	imageGroupId: text('public_id').notNull(),
	caption: text('caption'),
	photographer: text('photographer'),
	width: integer('width'),
	height: integer('height'),
	eventId: uuid('event_id').references(() => events.id, { onDelete: 'set null' }),
	uploadedBy: uuid('uploaded_by').references(() => members.id),
	uploadDate: timestamp('upload_date').defaultNow()
});

// --- Page Content ---

export const pageContent = pgTable(
	'page_content',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		slug: text('slug').notNull(),
		section: text('section').notNull(),
		title: text('title'),
		body: text('body'),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
		sortOrder: integer('sort_order').default(0),
		updatedBy: uuid('updated_by').references(() => members.id),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(t) => [unique().on(t.slug, t.section)]
);

// --- Community Info ---

export const communityInfo = pgTable('community_info', {
	id: uuid('id').primaryKey().defaultRandom(),
	aboutText: text('about_text'),
	meetingInfo: text('meeting_info'),
	contactEmail: text('contact_email'),
	socialLinks: jsonb('social_links').$type<Record<string, string>>(),
	mailingAddress: text('mailing_address'),
	phone: text('phone'),
	emergencyContact: text('emergency_contact'),
	paymentUrl: text('payment_url'),
	updatedAt: timestamp('updated_at').defaultNow()
});

// --- Officers / Board Members ---

export const officers = pgTable('officers', {
	id: uuid('id').primaryKey().defaultRandom(),
	memberId: uuid('member_id').references(() => members.id, { onDelete: 'set null' }),
	name: text('name').notNull(),
	position: text('position').notNull(),
	committeeType: text('committee_type').notNull().default('board'),
	imageUrl: text('image_url'),
	email: text('email'),
	bio: text('bio'),
	sortOrder: integer('sort_order').default(0)
});

// --- Properties ---

export const properties = pgTable('properties', {
	id: uuid('id').primaryKey().defaultRandom(),
	lotNumber: integer('lot_number').notNull().unique(),
	address: text('address'),
	section: sectionEnum('section'),
	propertyType: propertyTypeEnum('property_type'),
	ownerId: uuid('owner_id').references(() => members.id, { onDelete: 'set null' }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// --- Architectural Requests ---

export const architecturalRequests = pgTable('architectural_requests', {
	id: uuid('id').primaryKey().defaultRandom(),
	memberId: uuid('member_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'set null' }),
	title: text('title').notNull(),
	description: text('description').notNull(),
	requestType: architecturalRequestTypeEnum('request_type').notNull(),
	status: architecturalRequestStatusEnum('status').notNull().default('submitted'),
	submittedAt: timestamp('submitted_at').notNull().defaultNow(),
	reviewedAt: timestamp('reviewed_at'),
	reviewedBy: uuid('reviewed_by').references(() => members.id),
	reviewNotes: text('review_notes'),
	attachments: jsonb('attachments').$type<string[]>()
});

// --- Violations ---

export const violations = pgTable('violations', {
	id: uuid('id').primaryKey().defaultRandom(),
	reportedBy: uuid('reported_by').references(() => members.id, { onDelete: 'set null' }),
	propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'set null' }),
	description: text('description').notNull(),
	violationType: violationTypeEnum('violation_type').notNull(),
	status: violationStatusEnum('status').notNull().default('reported'),
	reportedAt: timestamp('reported_at').notNull().defaultNow(),
	resolvedAt: timestamp('resolved_at'),
	resolvedBy: uuid('resolved_by').references(() => members.id),
	notes: text('notes')
});

// --- Documents ---

export const documents = pgTable('documents', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	description: text('description'),
	category: documentCategoryEnum('category').notNull(),
	fileGroupId: text('file_group_id'),
	fileUrl: text('file_url'),
	publishedAt: timestamp('published_at').notNull().defaultNow(),
	uploadedBy: uuid('uploaded_by').references(() => members.id),
	createdAt: timestamp('created_at').defaultNow()
});

// --- Check-in Question Types ---

export interface CheckinQuestion {
	id: string;
	question: string;
	type: 'text' | 'select' | 'checkbox';
	options?: string[];
	required?: boolean;
}

// --- Images (binary storage) ---

export const images = pgTable(
	'images',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		data: bytea('data').notNull(),
		mimeType: text('mime_type').notNull().default('image/webp'),
		variant: imageVariantEnum('variant').notNull(),
		groupId: uuid('group_id').notNull(),
		width: integer('width'),
		height: integer('height'),
		sizeBytes: integer('size_bytes'),
		createdAt: timestamp('created_at').defaultNow()
	},
	(t) => [index('idx_images_group_id').on(t.groupId)]
);

// --- Audit Logs ---

export const auditLogs = pgTable(
	'audit_logs',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		entityType: text('entity_type').notNull(),
		entityId: uuid('entity_id').notNull(),
		actorId: uuid('actor_id').references(() => members.id, { onDelete: 'set null' }),
		action: auditLogActionEnum('action').notNull(),
		details: text('details'),
		createdAt: timestamp('created_at').defaultNow()
	},
	(t) => [index('idx_audit_logs_entity').on(t.entityType, t.entityId)]
);

