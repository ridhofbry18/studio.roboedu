CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `asset` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`link` text NOT NULL,
	`size` text,
	`createdAt` integer
);
--> statement-breakpoint
CREATE TABLE `event_metric` (
	`id` text PRIMARY KEY NOT NULL,
	`eventName` text NOT NULL,
	`registrants` integer NOT NULL,
	`conversionRate` integer NOT NULL,
	`locationName` text,
	`lat` text,
	`lng` text,
	`createdBy` text NOT NULL,
	`createdAt` integer,
	FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `inventory_log` (
	`id` text PRIMARY KEY NOT NULL,
	`itemName` text NOT NULL,
	`category` text NOT NULL,
	`qty` integer NOT NULL,
	`actionType` text NOT NULL,
	`locationName` text NOT NULL,
	`lat` text,
	`lng` text,
	`notes` text,
	`createdBy` text NOT NULL,
	`createdAt` integer,
	FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`content` text NOT NULL,
	`category` text DEFAULT 'Umum',
	`createdAt` integer
);
--> statement-breakpoint
CREATE TABLE `pending_user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`passwordHash` text,
	`city` text,
	`school` text,
	`photoUrl` text,
	`targetTeam` text,
	`createdAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pending_user_email_unique` ON `pending_user` (`email`);--> statement-breakpoint
CREATE TABLE `project` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`isBigProject` integer DEFAULT false,
	`teamId` text NOT NULL,
	`creatorId` text NOT NULL,
	`deadline` integer,
	`status` text DEFAULT 'Planning',
	`progress` integer DEFAULT 0,
	`isApproved` integer DEFAULT false,
	`previewImages` text,
	`completedTasks` text,
	`equipment` text,
	`script` text,
	`feedback` text,
	`finalLink` text,
	`previewLink` text,
	`proposalStatus` text,
	`createdAt` integer,
	`completedAt` integer,
	FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rnd_library` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`version` text NOT NULL,
	`description` text,
	`fileLink` text NOT NULL,
	`fileType` text NOT NULL,
	`createdBy` text NOT NULL,
	`createdAt` integer,
	FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`emailVerified` integer,
	`image` text,
	`role` text DEFAULT 'creator',
	`teamId` text,
	`city` text,
	`school` text,
	`bio` text,
	`isProfileComplete` integer DEFAULT false,
	`nameChangeCount` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
