import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';

export const produtos = sqliteTable('produtos', {
  id:                integer().primaryKey({ autoIncrement: true }),
  slug:              text().notNull().unique(),
  icon:              text(),
  title:             text().notNull(),
  description:       text(),
  lp_slug:           text(),
  includes:          text(),                  // JSON
  cta_title:         text(),
  cta_description:   text(),
  cta_whatsapp_msg:  text(),
  active:            integer().notNull().default(1),
  ordem:             integer().notNull().default(0),
});

export const pacotes = sqliteTable('pacotes', {
  id:                integer().primaryKey({ autoIncrement: true }),
  produto_id:        integer().notNull().references(() => produtos.id, { onDelete: 'cascade' }),
  title:             text().notNull(),
  subtitle:          text(),
  preco:             real().notNull().default(0),
  num_parcelas:      integer().notNull().default(1),
  preco_parcelas:    real(),
  fotos_incluidas:   integer().notNull().default(0),
  preco_foto_extra:  real().notNull().default(0),
  features:          text(),                  // JSON
  is_recommended:    integer().notNull().default(0),
  ordem:             integer().notNull().default(0),
}, (t) => ({
  produtoIdx: index('idx_pacotes_produto').on(t.produto_id),
}));

export type Produto       = typeof produtos.$inferSelect;
export type ProdutoInsert = typeof produtos.$inferInsert;
export type Pacote        = typeof pacotes.$inferSelect;
export type PacoteInsert  = typeof pacotes.$inferInsert;
