CREATE TABLE `admin_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`salt` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_username_unique` ON `admin_users` (`username`);--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`categoria` text NOT NULL,
	`titulo` text NOT NULL,
	`descricao` text,
	`data` text,
	`imagem_cf_id` text,
	`conteudo` text,
	`conteudo_imagens` text,
	`album` text,
	`ativo` integer DEFAULT 1 NOT NULL,
	`seo_keywords` text,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `cenario_paginas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`titulo` text NOT NULL,
	`titulo_pre` text,
	`ordem` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cenario_paginas_slug_unique` ON `cenario_paginas` (`slug`);--> statement-breakpoint
CREATE TABLE `cenarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pagina_id` integer NOT NULL,
	`titulo` text NOT NULL,
	`descricao` text,
	`imagem_bg_cf_id` text,
	`imagem_exemplo_cf_id` text,
	`imagem_exemplo_alt` text,
	`imagem_exemplo_link` text,
	`imagem_exemplo_titulo` text,
	`imagem_exemplo_orientacao` text,
	`ordem` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`pagina_id`) REFERENCES `cenario_paginas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_cenarios_pagina` ON `cenarios` (`pagina_id`);--> statement-breakpoint
CREATE TABLE `clientes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`senha_hash` text NOT NULL,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	`bg_image` text,
	`celular` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clientes_email_unique` ON `clientes` (`email`);--> statement-breakpoint
CREATE TABLE `depoimentos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`foto_cf_id` text,
	`rating` integer DEFAULT 5 NOT NULL,
	`data` text,
	`texto` text NOT NULL,
	`link` text,
	`featured` integer DEFAULT 0 NOT NULL,
	`portfolio_link` text,
	`ordem` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `entrega_portfolio_fotos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entrega_id` integer NOT NULL,
	`cf_image_id` text NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`entrega_id`) REFERENCES `entregas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_entrega_portfolio_fotos` ON `entrega_portfolio_fotos` (`entrega_id`);--> statement-breakpoint
CREATE TABLE `entregas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sessao_id` integer NOT NULL,
	`lote_id` integer,
	`r2_key` text,
	`nome_arquivo` text,
	`bg_image_id` text,
	`mensagem` text,
	`ativo` integer DEFAULT 1 NOT NULL,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`sessao_id`) REFERENCES `sessoes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lote_id`) REFERENCES `selecao_lotes`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_entregas_sessao` ON `entregas` (`sessao_id`);--> statement-breakpoint
CREATE INDEX `idx_entregas_lote` ON `entregas` (`lote_id`);--> statement-breakpoint
CREATE TABLE `faq_categorias` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`slug` text NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `faq_categorias_slug_unique` ON `faq_categorias` (`slug`);--> statement-breakpoint
CREATE TABLE `faq_perguntas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`categoria_id` integer NOT NULL,
	`pergunta` text NOT NULL,
	`resposta` text NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`categoria_id`) REFERENCES `faq_categorias`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_faq_perguntas_cat` ON `faq_perguntas` (`categoria_id`);--> statement-breakpoint
CREATE TABLE `sessao_fotos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sessao_id` integer NOT NULL,
	`cloudflare_image_id` text NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	`entregue` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`sessao_id`) REFERENCES `sessoes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_sessao_fotos_sessao` ON `sessao_fotos` (`sessao_id`);--> statement-breakpoint
CREATE TABLE `sessoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cliente_id` integer NOT NULL,
	`nome_sessao` text NOT NULL,
	`produto_tipo` text NOT NULL,
	`pacote_index` integer DEFAULT 0 NOT NULL,
	`fotos_incluidas` integer DEFAULT 0 NOT NULL,
	`preco_foto_extra` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'aguardando_fotos' NOT NULL,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	`produto_id` integer,
	`prazo_selecao` text,
	FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_sessoes_cliente` ON `sessoes` (`cliente_id`);--> statement-breakpoint
CREATE TABLE `selecao_lotes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sessao_id` integer NOT NULL,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	`status` text DEFAULT 'aguardando_selecao' NOT NULL,
	FOREIGN KEY (`sessao_id`) REFERENCES `sessoes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_selecao_lotes_sessao` ON `selecao_lotes` (`sessao_id`);--> statement-breakpoint
CREATE TABLE `selecoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lote_id` integer NOT NULL,
	`foto_id` integer NOT NULL,
	`selecionada` integer DEFAULT 0 NOT NULL,
	`comentario` text,
	FOREIGN KEY (`lote_id`) REFERENCES `selecao_lotes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`foto_id`) REFERENCES `sessao_fotos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_selecoes_lote` ON `selecoes` (`lote_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_selecoes_lote_foto` ON `selecoes` (`lote_id`,`foto_id`);--> statement-breakpoint
CREATE TABLE `pacotes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`produto_id` integer NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`preco` real DEFAULT 0 NOT NULL,
	`num_parcelas` integer DEFAULT 1 NOT NULL,
	`preco_parcelas` real,
	`fotos_incluidas` integer DEFAULT 0 NOT NULL,
	`preco_foto_extra` real DEFAULT 0 NOT NULL,
	`features` text,
	`is_recommended` integer DEFAULT 0 NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_pacotes_produto` ON `pacotes` (`produto_id`);--> statement-breakpoint
CREATE TABLE `produtos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`icon` text,
	`title` text NOT NULL,
	`description` text,
	`lp_slug` text,
	`includes` text,
	`cta_title` text,
	`cta_description` text,
	`cta_whatsapp_msg` text,
	`active` integer DEFAULT 1 NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `produtos_slug_unique` ON `produtos` (`slug`);--> statement-breakpoint
CREATE TABLE `portfolio_fotos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`work_id` integer NOT NULL,
	`cf_image_id` text NOT NULL,
	`width` integer,
	`height` integer,
	`formato` text,
	`custom_class` text,
	`alt` text,
	`highlight` integer DEFAULT 0 NOT NULL,
	`can_be_thumb` integer DEFAULT 1 NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`work_id`) REFERENCES `portfolio_works`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_portfolio_fotos_work` ON `portfolio_fotos` (`work_id`);--> statement-breakpoint
CREATE TABLE `portfolio_works` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`categoria` text NOT NULL,
	`titulo` text,
	`data` text,
	`local` text,
	`depoimento_texto` text,
	`depoimento_avatar` text,
	`depoimento_link` text,
	`cor_destaque` text,
	`home` integer DEFAULT 0 NOT NULL,
	`home_order` integer DEFAULT 0 NOT NULL,
	`video` text,
	`instagram_uri` text,
	`instagram_title` text,
	`site` text,
	`ativo` integer DEFAULT 1 NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	`seo_keywords` text,
	`descricao` text,
	`artigo` text DEFAULT 'a'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portfolio_works_slug_unique` ON `portfolio_works` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_portfolio_works_cat` ON `portfolio_works` (`categoria`);--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`path` text NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notificacoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tipo` text NOT NULL,
	`destinatario_id` integer,
	`titulo` text NOT NULL,
	`mensagem` text,
	`lida` integer DEFAULT 0 NOT NULL,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_notificacoes_dest` ON `notificacoes` (`tipo`,`destinatario_id`);--> statement-breakpoint
CREATE TABLE `push_subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tipo` text NOT NULL,
	`destinatario_id` integer,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `push_subscriptions_endpoint_unique` ON `push_subscriptions` (`endpoint`);--> statement-breakpoint
CREATE INDEX `idx_push_subs_dest` ON `push_subscriptions` (`tipo`,`destinatario_id`);