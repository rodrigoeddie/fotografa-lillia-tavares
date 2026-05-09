CREATE TABLE `landing_pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`rota` text NOT NULL,
	`titulo` text NOT NULL,
	`descricao` text,
	`lp_class` text,
	`ativo` integer DEFAULT 1 NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	`atualizado_em` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `landing_pages_slug_unique` ON `landing_pages` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_landing_pages_ativo` ON `landing_pages` (`ativo`);--> statement-breakpoint
CREATE TABLE `lp_blocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lp_id` integer NOT NULL,
	`tipo` text NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	`dados` text NOT NULL,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`lp_id`) REFERENCES `landing_pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_lp_blocks_lp` ON `lp_blocks` (`lp_id`);--> statement-breakpoint
CREATE INDEX `idx_lp_blocks_lp_ordem` ON `lp_blocks` (`lp_id`,`ordem`);--> statement-breakpoint
CREATE TABLE `page_seo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` integer,
	`route` text,
	`focus_keyword` text,
	`keywords` text,
	`meta_title` text,
	`meta_description` text,
	`og_image_cf_id` text,
	`og_image_alt` text,
	`twitter_image_cf_id` text,
	`canonical` text,
	`robots` text,
	`jsonld_type` text,
	`jsonld_data` text,
	`score` integer,
	`last_evaluated_at` text,
	`last_issues` text,
	`technical_audit` text,
	`last_audited_at` text,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	`atualizado_em` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_page_seo_entity` ON `page_seo` (`entity_type`,`entity_id`) WHERE "page_seo"."entity_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_page_seo_route` ON `page_seo` (`route`) WHERE "page_seo"."entity_type" = 'static' AND "page_seo"."route" IS NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_page_seo_score` ON `page_seo` (`score`);--> statement-breakpoint
CREATE INDEX `idx_page_seo_type` ON `page_seo` (`entity_type`);