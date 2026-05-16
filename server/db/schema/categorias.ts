import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const blog_categorias = sqliteTable('blog_categorias', {
  id:          integer().primaryKey({ autoIncrement: true }),
  slug:        text().notNull().unique(),
  titulo:      text().notNull(),
  descricao:   text(),
  ordem:       integer().notNull().default(0),
  ativo:       integer().notNull().default(1),
  criado_em:   text().notNull().default(sql`(datetime('now'))`),
});

export const portfolio_categorias = sqliteTable('portfolio_categorias', {
  id:          integer().primaryKey({ autoIncrement: true }),
  slug:        text().notNull().unique(),
  titulo:      text().notNull(),
  descricao:   text(),
  ordem:       integer().notNull().default(0),
  ativo:       integer().notNull().default(1),
  criado_em:   text().notNull().default(sql`(datetime('now'))`),
});

// Aliases camelCase
export const blogCategorias      = blog_categorias;
export const portfolioCategorias = portfolio_categorias;

export type BlogCategoria            = typeof blog_categorias.$inferSelect;
export type BlogCategoriaInsert      = typeof blog_categorias.$inferInsert;
export type PortfolioCategoria       = typeof portfolio_categorias.$inferSelect;
export type PortfolioCategoriaInsert = typeof portfolio_categorias.$inferInsert;
