CREATE TABLE `cities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`timezone` text DEFAULT 'Asia/Almaty',
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cities_slug_unique` ON `cities` (`slug`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`reservation_id` text NOT NULL,
	`amount` integer NOT NULL,
	`status` text DEFAULT 'pending',
	`provider` text DEFAULT 'kaspi',
	`provider_ref` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_payments_reservation` ON `payments` (`reservation_id`);--> statement-breakpoint
CREATE TABLE `pricing_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`restaurant_id` text NOT NULL,
	`day_of_week` integer,
	`time_start` text NOT NULL,
	`time_end` text NOT NULL,
	`multiplier` real NOT NULL,
	`label` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_pricing_restaurant` ON `pricing_rules` (`restaurant_id`);--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`restaurant_id` text NOT NULL,
	`city_id` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`guests` integer NOT NULL,
	`status` text DEFAULT 'pending',
	`payment_required` integer DEFAULT false,
	`payment_status` text DEFAULT 'none',
	`total_price` integer DEFAULT 0,
	`note` text,
	`cancelled_at` text,
	`confirmed_at` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_reservations_restaurant_date` ON `reservations` (`restaurant_id`,`date`);--> statement-breakpoint
CREATE INDEX `idx_reservations_city` ON `reservations` (`city_id`);--> statement-breakpoint
CREATE INDEX `idx_reservations_user` ON `reservations` (`user_id`);--> statement-breakpoint
CREATE TABLE `restaurant_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`restaurant_id` text NOT NULL,
	`url` text NOT NULL,
	`alt` text,
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `restaurants` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text,
	`city_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`cuisine` text,
	`address` text NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`phone` text,
	`photo_url` text,
	`rating` real DEFAULT 4.5,
	`review_count` integer DEFAULT 0,
	`price_range` integer DEFAULT 2,
	`capacity_per_slot` integer DEFAULT 20,
	`deposit_amount` integer DEFAULT 0,
	`deposit_required` integer DEFAULT false,
	`refund_hours` integer DEFAULT 24,
	`is_active` integer DEFAULT true,
	`open_time` text DEFAULT '10:00',
	`close_time` text DEFAULT '23:00',
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_restaurants_city` ON `restaurants` (`city_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_restaurants_slug_city` ON `restaurants` (`city_id`,`slug`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`restaurant_id` text NOT NULL,
	`reservation_id` text,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_reviews_restaurant` ON `reviews` (`restaurant_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`name` text,
	`phone` text,
	`image` text,
	`role` text DEFAULT 'user',
	`city_id` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);