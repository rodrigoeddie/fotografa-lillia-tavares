import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { clientes } from './clientes';
import { produtos } from './produtos';

export const sessoes = sqliteTable('sessoes', {
  id:                integer().primaryKey({ autoIncrement: true }),
  cliente_id:        integer().notNull().references(() => clientes.id, { onDelete: 'cascade' }),
  nome_sessao:       text().notNull(),
  produto_tipo:      text().notNull(),
  pacote_index:      integer().notNull().default(0),
  fotos_incluidas:   integer().notNull().default(0),
  preco_foto_extra:  real().notNull().default(0),
  status:            text().notNull().default('aguardando_fotos'),
  criado_em:         text().notNull().default(sql`(datetime('now'))`),
  produto_id:        integer().references(() => produtos.id),
  prazo_selecao:     text(),
  capa_foto_id:             text(),
  valor_restante_pacote:    real().notNull().default(0),
}, (t) => ({
  clienteIdx: index('idx_sessoes_cliente').on(t.cliente_id),
}));

export const sessao_fotos = sqliteTable('sessao_fotos', {
  id:                  integer().primaryKey({ autoIncrement: true }),
  sessao_id:           integer().notNull().references(() => sessoes.id, { onDelete: 'cascade' }),
  cloudflare_image_id: text().notNull(),
  ordem:               integer().notNull().default(0),
  entregue:            integer().notNull().default(0),
}, (t) => ({
  sessaoIdx: index('idx_sessao_fotos_sessao').on(t.sessao_id),
}));

// Aliases camelCase para compatibilidade com código existente que importava `sessaoFotos`.
export const sessaoFotos = sessao_fotos;

export type Sessao        = typeof sessoes.$inferSelect;
export type SessaoInsert  = typeof sessoes.$inferInsert;
export type SessaoFoto    = typeof sessao_fotos.$inferSelect;
export type SessaoFotoInsert = typeof sessao_fotos.$inferInsert;
