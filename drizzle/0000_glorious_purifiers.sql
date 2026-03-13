CREATE TYPE "public"."club_type" AS ENUM('astronomy', 'physics');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('super_admin', 'astronomy_admin', 'physics_admin');--> statement-breakpoint
CREATE TABLE "club_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_type" "club_type" NOT NULL,
	"about_text" text,
	"meeting_info" text,
	"contact_email" text,
	"social_links" jsonb,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "club_info_club_type_unique" UNIQUE("club_type")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"date" date NOT NULL,
	"time" text,
	"location" text,
	"club_type" "club_type" NOT NULL,
	"image_url" text,
	"image_public_id" text,
	"is_published" boolean DEFAULT true,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"public_id" text NOT NULL,
	"caption" text,
	"club_type" "club_type" NOT NULL,
	"photographer" text,
	"width" integer,
	"height" integer,
	"uploaded_by" uuid,
	"upload_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "officers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_type" "club_type" NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"image_url" text,
	"email" text,
	"bio" text,
	"sort_order" integer DEFAULT 0,
	"academic_year" text
);
--> statement-breakpoint
CREATE TABLE "page_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"club_type" "club_type" NOT NULL,
	"section" text NOT NULL,
	"title" text,
	"body" text,
	"metadata" jsonb,
	"sort_order" integer DEFAULT 0,
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_content" ADD CONSTRAINT "page_content_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;