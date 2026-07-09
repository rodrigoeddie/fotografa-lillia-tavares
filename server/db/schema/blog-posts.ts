import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const blog_posts = sqliteTable('blog_posts', {
  id:                integer().primaryKey({ autoIncrement: true }),
  slug:              text().notNull().unique(),
  categoria:         text().notNull(),
  titulo:            text().notNull(),
  descricao:         text(),
  data:              text(),
  imagem_cf_id:      text(),
  conteudo:          text(),
  conteudo_imagens:  text(),                  // JSON
  album:             text(),                  // JSON
  ativo:             integer().notNull().default(1),
  seo_keywords:      text(),                  // JSON
  works:             text(),                  // slug de categoria do portfolio (seção "ensaios com esse tema")
  show_schedule:     integer().notNull().default(0),
  criado_em:         text().notNull().default(sql`(datetime('now'))`),
});

// Alias camelCase (compatibilidade com imports existentes do schema).
export const blogPosts = blog_posts;

export type BlogPost       = typeof blog_posts.$inferSelect;
export type BlogPostInsert = typeof blog_posts.$inferInsert;
