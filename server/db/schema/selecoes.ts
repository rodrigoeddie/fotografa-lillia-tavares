import { sqliteTable, integer, text, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { sessoes, sessao_fotos } from './sessoes';

export const selecao_lotes = sqliteTable('selecao_lotes', {
  id:        integer().primaryKey({ autoIncrement: true }),
  sessao_id: integer().notNull().references(() => sessoes.id, { onDelete: 'cascade' }),
  criado_em: text().notNull().default(sql`(datetime('now'))`),
  status:    text().notNull().default('aguardando_selecao'),
}, (t) => ({
  sessaoIdx: index('idx_selecao_lotes_sessao').on(t.sessao_id),
}));

export const selecoes = sqliteTable('selecoes', {
  id:          integer().primaryKey({ autoIncrement: true }),
  lote_id:     integer().notNull().references(() => selecao_lotes.id, { onDelete: 'cascade' }),
  foto_id:     integer().notNull().references(() => sessao_fotos.id, { onDelete: 'cascade' }),
  selecionada: integer().notNull().default(0),
  comentario:  text(),
}, (t) => ({
  loteIdx: index('idx_selecoes_lote').on(t.lote_id),
  uniq:    uniqueIndex('uq_selecoes_lote_foto').on(t.lote_id, t.foto_id),
}));

// Alias camelCase
export const selecaoLotes = selecao_lotes;

export type SelecaoLote       = typeof selecao_lotes.$inferSelect;
export type SelecaoLoteInsert = typeof selecao_lotes.$inferInsert;
export type Selecao           = typeof selecoes.$inferSelect;
export type SelecaoInsert     = typeof selecoes.$inferInsert;
