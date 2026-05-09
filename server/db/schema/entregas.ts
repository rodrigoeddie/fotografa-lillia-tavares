import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { sessoes } from './sessoes';
import { selecao_lotes } from './selecoes';

export const entregas = sqliteTable('entregas', {
  id:           integer().primaryKey({ autoIncrement: true }),
  sessao_id:    integer().notNull().references(() => sessoes.id, { onDelete: 'cascade' }),
  lote_id:      integer().references(() => selecao_lotes.id, { onDelete: 'set null' }),
  r2_key:       text(),
  nome_arquivo: text(),
  bg_image_id:  text(),
  mensagem:     text(),
  ativo:        integer().notNull().default(1),
  criado_em:    text().notNull().default(sql`(datetime('now'))`),
}, (t) => ({
  sessaoIdx: index('idx_entregas_sessao').on(t.sessao_id),
  loteIdx:   index('idx_entregas_lote').on(t.lote_id),
}));

export const entrega_portfolio_fotos = sqliteTable('entrega_portfolio_fotos', {
  id:          integer().primaryKey({ autoIncrement: true }),
  entrega_id:  integer().notNull().references(() => entregas.id, { onDelete: 'cascade' }),
  cf_image_id: text().notNull(),
  ordem:       integer().notNull().default(0),
}, (t) => ({
  entregaIdx: index('idx_entrega_portfolio_fotos').on(t.entrega_id),
}));

// Alias camelCase
export const entregaPortfolioFotos = entrega_portfolio_fotos;

export type Entrega                = typeof entregas.$inferSelect;
export type EntregaInsert          = typeof entregas.$inferInsert;
export type EntregaPortfolioFoto   = typeof entrega_portfolio_fotos.$inferSelect;
export type EntregaPortfolioFotoInsert = typeof entrega_portfolio_fotos.$inferInsert;
