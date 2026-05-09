import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const landing_pages = sqliteTable('landing_pages', {
  id:             integer().primaryKey({ autoIncrement: true }),
  slug:           text().notNull().unique(),
  rota:           text().notNull(),
  titulo:         text().notNull(),
  descricao:      text(),
  lp_class:       text(),
  ativo:          integer().notNull().default(1),
  ordem:          integer().notNull().default(0),
  criado_em:      text().notNull().default(sql`(datetime('now'))`),
  atualizado_em:  text().notNull().default(sql`(datetime('now'))`),
}, (t) => ({
  ativoIdx: index('idx_landing_pages_ativo').on(t.ativo),
}));

export const lp_blocks = sqliteTable('lp_blocks', {
  id:         integer().primaryKey({ autoIncrement: true }),
  lp_id:      integer().notNull().references(() => landing_pages.id, { onDelete: 'cascade' }),
  tipo:       text().notNull(),
  ordem:      integer().notNull().default(0),
  dados:      text().notNull(),                  // JSON validado app-level via Zod
  criado_em:  text().notNull().default(sql`(datetime('now'))`),
}, (t) => ({
  lpIdx:      index('idx_lp_blocks_lp').on(t.lp_id),
  lpOrdemIdx: index('idx_lp_blocks_lp_ordem').on(t.lp_id, t.ordem),
}));

// Aliases camelCase (compatibilidade com nomenclatura JS)
export const landingPages = landing_pages;
export const lpBlocks     = lp_blocks;

export type LandingPage       = typeof landing_pages.$inferSelect;
export type LandingPageInsert = typeof landing_pages.$inferInsert;
export type LpBlockRow        = typeof lp_blocks.$inferSelect;
export type LpBlockInsert     = typeof lp_blocks.$inferInsert;
