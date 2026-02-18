CREATE TABLE "knowledge_source" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_email" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"source_url" text NOT NULL,
	"content" text,
	"meta_data" text,
	"created_at" text DEFAULT now()
);
