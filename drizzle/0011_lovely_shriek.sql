CREATE TABLE "interest_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "interest_options_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "event_checkins" ADD COLUMN "question_responses" jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "checkin_questions" jsonb;--> statement-breakpoint
INSERT INTO "interest_options" ("name", "sort_order") VALUES
  ('Stargazing', 0),
  ('Lectures', 1),
  ('Workshops', 2),
  ('Social Events', 3),
  ('Field Trips', 4),
  ('Study Groups', 5),
  ('Research', 6),
  ('Outreach', 7);