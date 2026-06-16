import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { sessoes } from './sessoes';
import { selecao_lotes } from './selecoes';

export const pagamentos = sqliteTable('pagamentos', {
  id:                   integer().primaryKey({ autoIncrement: true }),
  sessao_id:            integer().notNull().references(() => sessoes.id, { onDelete: 'cascade' }),
  lote_id:              integer().references(() => selecao_lotes.id, { onDelete: 'set null' }),
  sumup_checkout_id:    text(),
  sumup_transaction_id: text(),
  status:               text().notNull().default('pendente'),
  valor_cents:          integer().notNull(),
  metodo:               text(),
  descricao:            text(),
  criado_em:            text().notNull().default(sql`(datetime('now'))`),
  atualizado_em:        text(),
}, (t) => ({
  sessaoIdx: index('idx_pagamentos_sessao').on(t.sessao_id),
  loteIdx:   index('idx_pagamentos_lote').on(t.lote_id),
}));

export type Pagamento       = typeof pagamentos.$inferSelect;
export type PagamentoInsert = typeof pagamentos.$inferInsert;
