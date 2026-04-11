CREATE TYPE "public"."admin_role" AS ENUM('president', 'vice_president', 'treasurer', 'secretary', 'architectural_chair', 'board_member');--> statement-breakpoint
CREATE TYPE "public"."architectural_request_status" AS ENUM('submitted', 'under_review', 'approved', 'denied', 'revision_requested');--> statement-breakpoint
CREATE TYPE "public"."architectural_request_type" AS ENUM('modification', 'new_construction', 'fence', 'landscaping', 'paint', 'other');--> statement-breakpoint
CREATE TYPE "public"."document_category" AS ENUM('bylaws', 'minutes', 'newsletter', 'financial', 'covenant', 'other');--> statement-breakpoint
CREATE TYPE "public"."event_category" AS ENUM('community', 'board_meeting', 'village', 'social', 'maintenance');--> statement-breakpoint
CREATE TYPE "public"."image_variant" AS ENUM('full', 'thumbnail');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('member', 'board');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('single_family', 'townhome');--> statement-breakpoint
CREATE TYPE "public"."reminder_type" AS ENUM('7_day', '1_day', 'day_of');--> statement-breakpoint
CREATE TYPE "public"."rsvp_status" AS ENUM('going', 'maybe', 'not_going');--> statement-breakpoint
CREATE TYPE "public"."section_type" AS ENUM('woods', 'reserves');--> statement-breakpoint
CREATE TYPE "public"."violation_status" AS ENUM('reported', 'investigating', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."violation_type" AS ENUM('signage', 'architectural', 'maintenance', 'noise', 'other');--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"category" text,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"publish_at" timestamp,
	"expires_at" timestamp,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "architectural_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"property_id" uuid,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"request_type" "architectural_request_type" NOT NULL,
	"status" "architectural_request_status" DEFAULT 'submitted' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"reviewed_by" uuid,
	"review_notes" text,
	"attachments" jsonb
);
--> statement-breakpoint
CREATE TABLE "community_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"about_text" text,
	"meeting_info" text,
	"contact_email" text,
	"social_links" jsonb,
	"mailing_address" text,
	"phone" text,
	"emergency_contact" text,
	"payment_url" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" "document_category" NOT NULL,
	"file_group_id" text,
	"file_url" text,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"uploaded_by" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_verification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "email_verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "event_announcement_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_announcement_logs_event_id_member_id_unique" UNIQUE("event_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "event_checkins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"checked_in_at" timestamp DEFAULT now() NOT NULL,
	"question_responses" jsonb,
	CONSTRAINT "event_checkins_event_id_member_id_unique" UNIQUE("event_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "event_rsvps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"status" "rsvp_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "event_rsvps_event_id_member_id_unique" UNIQUE("event_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"date" date NOT NULL,
	"time" text,
	"location" text,
	"location_url" text,
	"event_category" "event_category" DEFAULT 'community' NOT NULL,
	"image_url" text,
	"image_public_id" text,
	"is_published" boolean DEFAULT true,
	"max_attendees" integer,
	"checkin_code" text,
	"checkin_questions" jsonb,
	"announcement_sent_at" timestamp,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "events_checkin_code_unique" UNIQUE("checkin_code")
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"public_id" text NOT NULL,
	"caption" text,
	"photographer" text,
	"width" integer,
	"height" integer,
	"event_id" uuid,
	"uploaded_by" uuid,
	"upload_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"data" "bytea" NOT NULL,
	"mime_type" text DEFAULT 'image/webp' NOT NULL,
	"variant" "image_variant" NOT NULL,
	"group_id" uuid NOT NULL,
	"width" integer,
	"height" integer,
	"size_bytes" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "member_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"display_name" text NOT NULL,
	"role" "member_role" DEFAULT 'member' NOT NULL,
	"admin_role" "admin_role",
	"email_verified" boolean DEFAULT false NOT NULL,
	"phone" text,
	"address" text,
	"lot_number" integer,
	"section" "section_type",
	"property_type" "property_type",
	"directory_opt_in" boolean DEFAULT false NOT NULL,
	"move_in_date" date,
	"email_opt_out" boolean DEFAULT false NOT NULL,
	"unsubscribe_token" text NOT NULL,
	"secondary_email" text,
	"profile_image_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "members_email_unique" UNIQUE("email"),
	CONSTRAINT "members_unsubscribe_token_unique" UNIQUE("unsubscribe_token")
);
--> statement-breakpoint
CREATE TABLE "officers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"committee_type" text DEFAULT 'board' NOT NULL,
	"image_url" text,
	"email" text,
	"bio" text,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "page_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"section" text NOT NULL,
	"title" text,
	"body" text,
	"metadata" jsonb,
	"sort_order" integer DEFAULT 0,
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "page_content_slug_section_unique" UNIQUE("slug","section")
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lot_number" integer NOT NULL,
	"address" text,
	"section" "section_type",
	"property_type" "property_type",
	"owner_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "properties_lot_number_unique" UNIQUE("lot_number")
);
--> statement-breakpoint
CREATE TABLE "reminder_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"reminder_type" "reminder_type" NOT NULL,
	"rsvp_status" "rsvp_status" NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reminder_logs_event_id_member_id_reminder_type_unique" UNIQUE("event_id","member_id","reminder_type")
);
--> statement-breakpoint
CREATE TABLE "violations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reported_by" uuid,
	"property_id" uuid,
	"description" text NOT NULL,
	"violation_type" "violation_type" NOT NULL,
	"status" "violation_status" DEFAULT 'reported' NOT NULL,
	"reported_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"resolved_by" uuid,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_members_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "architectural_requests" ADD CONSTRAINT "architectural_requests_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "architectural_requests" ADD CONSTRAINT "architectural_requests_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "architectural_requests" ADD CONSTRAINT "architectural_requests_reviewed_by_members_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_members_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_announcement_logs" ADD CONSTRAINT "event_announcement_logs_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_announcement_logs" ADD CONSTRAINT "event_announcement_logs_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_checkins" ADD CONSTRAINT "event_checkins_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_checkins" ADD CONSTRAINT "event_checkins_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_members_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_uploaded_by_members_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_sessions" ADD CONSTRAINT "member_sessions_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "officers" ADD CONSTRAINT "officers_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_content" ADD CONSTRAINT "page_content_updated_by_members_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_owner_id_members_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminder_logs" ADD CONSTRAINT "reminder_logs_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminder_logs" ADD CONSTRAINT "reminder_logs_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "violations" ADD CONSTRAINT "violations_reported_by_members_id_fk" FOREIGN KEY ("reported_by") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "violations" ADD CONSTRAINT "violations_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "violations" ADD CONSTRAINT "violations_resolved_by_members_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_images_group_id" ON "images" USING btree ("group_id");