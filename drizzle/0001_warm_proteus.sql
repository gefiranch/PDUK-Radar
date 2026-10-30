CREATE TABLE `login_attempts` (
	`key` text PRIMARY KEY NOT NULL,
	`failures` integer NOT NULL,
	`window_started_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `app_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `app_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `app_users` ADD `password_hash` text;