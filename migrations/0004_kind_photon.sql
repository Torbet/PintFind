CREATE TABLE `followings` (
	`user_id` text NOT NULL,
	`place_id` text NOT NULL,
	PRIMARY KEY(`place_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE no action
);