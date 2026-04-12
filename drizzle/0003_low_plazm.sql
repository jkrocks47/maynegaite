UPDATE "members" SET "section" = 'woods' WHERE "section" = 'reserves';--> statement-breakpoint
UPDATE "properties" SET "section" = 'woods' WHERE "section" = 'reserves';--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "section" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "section" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."section_type";--> statement-breakpoint
CREATE TYPE "public"."section_type" AS ENUM('woods');--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "section" SET DATA TYPE "public"."section_type" USING "section"::"public"."section_type";--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "section" SET DATA TYPE "public"."section_type" USING "section"::"public"."section_type";