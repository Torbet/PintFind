CREATE TABLE `drinks` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`paying` integer DEFAULT false,
	`name` text NOT NULL,
	`description` text,
	`image` text,
	`abv` real,
	`ibu` real,
	`glass` text,
	`serving_temperature` text,
	`food_pairings` text,
	`style_id` text NOT NULL,
	`user_id` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`style_id`) REFERENCES `styles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `features` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `features_to_reviews` (
	`feature_id` text NOT NULL,
	`review_id` text NOT NULL,
	PRIMARY KEY(`feature_id`, `review_id`),
	FOREIGN KEY (`feature_id`) REFERENCES `features`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `places` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`image` text,
	`description` text,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`street` text NOT NULL,
	`postcode` text NOT NULL,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`phone` text,
	`website` text,
	`facebook` text,
	`twitter` text,
	`instagram` text,
	`opening_hours` text,
	`external_ids` text,
	`paying` integer DEFAULT false,
	`mapbox_id` text NOT NULL,
	`user_id` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`rating` integer NOT NULL,
	`price` real,
	`currency` text,
	`student_discount` integer,
	`comment` text,
	`place_id` text NOT NULL,
	`drinks_id` text,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`drinks_id`) REFERENCES `drinks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `styles` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`short_name` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`abv_min` real,
	`abv_max` real,
	`ibu_min` real,
	`ibu_max` real,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`avatar` text,
	`bio` text,
	`hashed_password` text,
	`paying` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `drinks_slug_unique` ON `drinks` (`slug`);--> statement-breakpoint
CREATE INDEX `drinks_name_idx` ON `drinks` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `places_slug_unique` ON `places` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `places_mapbox_id_unique` ON `places` (`mapbox_id`);--> statement-breakpoint
CREATE INDEX `places_name_idx` ON `places` (`name`);--> statement-breakpoint
CREATE INDEX `places_city_idx` ON `places` (`city`);--> statement-breakpoint
CREATE UNIQUE INDEX `styles_slug_unique` ON `styles` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);