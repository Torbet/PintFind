ALTER TABLE `users` RENAME COLUMN `paying` TO `verified`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `unsubscribed`;