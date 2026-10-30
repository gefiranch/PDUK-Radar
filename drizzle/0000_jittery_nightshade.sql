CREATE TABLE `account_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text NOT NULL,
	`target_id` text NOT NULL,
	`action` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `app_users` (
	`id` text PRIMARY KEY NOT NULL,
	`identity_id` text,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`status` text NOT NULL,
	`created_by` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`last_login_at` text,
	CONSTRAINT "user_role_check" CHECK("app_users"."role" IN ('admin','user')),
	CONSTRAINT "user_status_check" CHECK("app_users"."status" IN ('active','inactive'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_users_identity_id_unique` ON `app_users` (`identity_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `app_users_email_unique` ON `app_users` (`email`);