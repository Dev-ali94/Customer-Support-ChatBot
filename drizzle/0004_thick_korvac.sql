CREATE TABLE "chatbot_data" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_email" text NOT NULL,
	"color" text DEFAULT '#4f39f6',
	"welcome_message" text DEFAULT 'Hi there,How can i help you.',
	"created_at" text DEFAULT now()
);
