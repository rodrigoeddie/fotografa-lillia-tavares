import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const depoimentos = sqliteTable('depoimentos', {
  id:             integer().primaryKey({ autoIncrement: true }),
  nome:           text().notNull(),
  foto_cf_id:     text(),
  rating:         integer().notNull().default(5),
  data:           text(),
  texto:          text().notNull(),
  link:           text(),
  featured:       integer().notNull().default(0),
  portfolio_link: text(),
  ordem:          integer().notNull().default(0),
});

export type Depoimento       = typeof depoimentos.$inferSelect;
export type DepoimentoInsert = typeof depoimentos.$inferInsert;
