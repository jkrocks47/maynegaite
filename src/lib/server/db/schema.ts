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
	unique
} from 'drizzle-orm/pg-core';

export const clubTypeEnum = pgEnum('club_type', ['astronomy', 'physics']);
export const roleEnum = pgEnum('role', ['super_admin', 'astronomy_admin', 'physics_admin']);
export const memberRoleEnum = pgEnum('member_role', ['member', 'board']);
export const rsvpStatusEnum = pgEnum('rsvp_status', ['going', 'maybe', 'not_going']);

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	name: text('name').notNull(),
	role: roleEnum('role').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow()
});

// Members (public registration, separate from admin users)
export const members = pgTable('members', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	displayName: text('display_name').notNull(),
	role: memberRoleEnum('role').notNull().default('member'),
	emailVerified: boolean('email_verified').notNull().default(false),
	year: text('year'),
	major: text('major'),
	astronomyMember: boolean('astronomy_member').notNull().default(false),
	physicsMember: boolean('physics_member').notNull().default(false),
	eventPreferences: jsonb('event_preferences').$type<string[]>(),
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

export const events = pgTable('events', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	description: text('description'),
	date: date('date').notNull(),
	time: text('time'),
	location: text('location'),
	locationUrl: text('location_url'),
	clubType: clubTypeEnum('club_type').notNull(),
	imageUrl: text('image_url'),
	imagePublicId: text('image_public_id'),
	isPublished: boolean('is_published').default(true),
	maxAttendees: integer('max_attendees'),
	checkinCode: text('checkin_code').unique(),
	createdBy: uuid('created_by').references(() => users.id),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

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
		checkedInAt: timestamp('checked_in_at').notNull().defaultNow()
	},
	(t) => [unique().on(t.eventId, t.memberId)]
);

export const announcements = pgTable('announcements', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	body: text('body').notNull(),
	clubType: clubTypeEnum('club_type'),
	isPinned: boolean('is_pinned').notNull().default(false),
	publishAt: timestamp('publish_at'),
	expiresAt: timestamp('expires_at'),
	createdBy: uuid('created_by').references(() => users.id),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const galleryImages = pgTable('gallery_images', {
	id: uuid('id').primaryKey().defaultRandom(),
	url: text('url').notNull(),
	publicId: text('public_id').notNull(),
	caption: text('caption'),
	clubType: clubTypeEnum('club_type').notNull(),
	photographer: text('photographer'),
	width: integer('width'),
	height: integer('height'),
	uploadedBy: uuid('uploaded_by').references(() => users.id),
	uploadDate: timestamp('upload_date').defaultNow()
});

export const pageContent = pgTable('page_content', {
	id: uuid('id').primaryKey().defaultRandom(),
	slug: text('slug').notNull(),
	clubType: clubTypeEnum('club_type').notNull(),
	section: text('section').notNull(),
	title: text('title'),
	body: text('body'),
	metadata: jsonb('metadata').$type<Record<string, unknown>>(),
	sortOrder: integer('sort_order').default(0),
	updatedBy: uuid('updated_by').references(() => users.id),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const clubInfo = pgTable('club_info', {
	id: uuid('id').primaryKey().defaultRandom(),
	clubType: clubTypeEnum('club_type').notNull().unique(),
	aboutText: text('about_text'),
	meetingInfo: text('meeting_info'),
	contactEmail: text('contact_email'),
	socialLinks: jsonb('social_links').$type<Record<string, string>>(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const officers = pgTable('officers', {
	id: uuid('id').primaryKey().defaultRandom(),
	clubType: clubTypeEnum('club_type').notNull(),
	name: text('name').notNull(),
	position: text('position').notNull(),
	imageUrl: text('image_url'),
	email: text('email'),
	bio: text('bio'),
	sortOrder: integer('sort_order').default(0),
	academicYear: text('academic_year')
});
