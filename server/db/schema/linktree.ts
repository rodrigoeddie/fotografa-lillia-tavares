import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Linktree — hub público (/links) alimentado pelos dados do site.
 *
 * `linktree_presets` são coleções nomeadas (temporadas/temas). Cada preset carrega
 * o cabeçalho completo (nome, headline, avatar, tema) + seus próprios blocos.
 * Exatamente um preset fica `ativo` por vez (índice único parcial) e é o que a
 * página pública /links renderiza.
 *
 * `linktree_items` são os blocos ordenáveis, vinculados a um preset via `preset_id`
 * (config JSON validado por Zod).
 *
 * `linktree_profile` é OBSOLETA (dados migrados p/ presets na migration 034);
 * mantida na base por segurança, não é mais lida/escrita.
 */

export const linktree_presets = sqliteTable('linktree_presets', {
  id:            integer().primaryKey({ autoIncrement: true }),
  titulo:        text().notNull().default('Preset'),
  ativo:         integer({ mode: 'boolean' }).notNull().default(false),
  avatar_cf_id:  text(),
  nome:          text().notNull().default(''),
  headline:      text(),
  tema:          text().notNull().default('claro'),
  atualizado_em: text().notNull().default(sql`(datetime('now'))`),
});

export const linktree_items = sqliteTable('linktree_items', {
  id:        integer().primaryKey({ autoIncrement: true }),
  preset_id: integer().notNull().default(1),
  ordem:     integer().notNull().default(0),
  ativo:     integer({ mode: 'boolean' }).notNull().default(true),
  tipo:      text().notNull(),
  config:    text().notNull(),                 // JSON validado por LinktreeItemSchema
}, (t) => ({
  presetIdx: index('idx_linktree_items_preset').on(t.preset_id, t.ordem),
}));

/** Contador de cliques por bloco, agregado por `chave` estável (ver linktreeItemKey). */
export const linktree_clicks = sqliteTable('linktree_clicks', {
  chave:         text().primaryKey(),
  cliques:       integer().notNull().default(0),
  atualizado_em: text().notNull().default(sql`(datetime('now'))`),
});

/** @deprecated migrada p/ linktree_presets (034). Mantida só p/ não perder dados. */
export const linktree_profile = sqliteTable('linktree_profile', {
  id:            integer().primaryKey({ autoIncrement: true }),
  avatar_cf_id:  text(),
  nome:          text().notNull().default(''),
  headline:      text(),
  tema:          text().notNull().default('claro'),
  atualizado_em: text().notNull().default(sql`(datetime('now'))`),
});

// Aliases camelCase
export const linktreePresets = linktree_presets;
export const linktreeItems    = linktree_items;
export const linktreeClicks   = linktree_clicks;

export type LinktreePreset       = typeof linktree_presets.$inferSelect;
export type LinktreePresetInsert = typeof linktree_presets.$inferInsert;
export type LinktreeItem         = typeof linktree_items.$inferSelect;
export type LinktreeItemInsert   = typeof linktree_items.$inferInsert;
export type LinktreeClick        = typeof linktree_clicks.$inferSelect;
