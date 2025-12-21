CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"token" varchar NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"token" varchar NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"token" varchar NOT NULL,
	"type" varchar NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "image" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_hash" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;