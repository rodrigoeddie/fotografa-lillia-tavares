import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Linktree — hub público (/links) alimentado pelos dados do site.
 * `linktree_profile` é uma linha única (id=1) com o cabeçalho;
 * `linktree_items` são os blocos ordenáveis (config JSON validado por Zod).
 */

export const linktree_profile = sqliteTable('linktree_profile', {
  id:            integer().primaryKey({ autoIncrement: true }),
  avatar_cf_id:  text(),
  nome:          text().notNull().default(''),
  headline:      text(),
  tema:          text().notNull().default('claro'),
  atualizado_em: text().notNull().default(sql`(datetime('now'))`),
});

export const linktree_items = sqliteTable('linktree_items', {
  id:     integer().primaryKey({ autoIncrement: true }),
  ordem:  integer().notNull().default(0),
  ativo:  integer({ mode: 'boolean' }).notNull().default(true),
  tipo:   text().notNull(),
  config: text().notNull(),                 // JSON validado por LinktreeItemSchema
});

/** Contador de cliques por bloco, agregado por `chave` estável (ver linktreeItemKey). */
export const linktree_clicks = sqliteTable('linktree_clicks', {
  chave:         text().primaryKey(),
  cliques:       integer().notNull().default(0),
  atualizado_em: text().notNull().default(sql`(datetime('now'))`),
});

// Aliases camelCase
export const linktreeProfile = linktree_profile;
export const linktreeItems   = linktree_items;
export const linktreeClicks  = linktree_clicks;

export type LinktreeProfile       = typeof linktree_profile.$inferSelect;
export type LinktreeProfileInsert = typeof linktree_profile.$inferInsert;
export type LinktreeItem          = typeof linktree_items.$inferSelect;
export type LinktreeItemInsert    = typeof linktree_items.$inferInsert;
export type LinktreeClick         = typeof linktree_clicks.$inferSelect;
