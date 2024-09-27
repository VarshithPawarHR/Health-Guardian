CREATE TABLE `chat` (
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`is_bot` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
