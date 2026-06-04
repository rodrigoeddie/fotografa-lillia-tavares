import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const clientes = sqliteTable('clientes', {
  id:         integer().primaryKey({ autoIncrement: true }),
  nome:       text().notNull(),
  email:      text().notNull().unique(),
  senha_hash: text().notNull(),
  criado_em:  text().notNull().default(sql`(datetime('now'))`),
  bg_image:      text(),
  celular:       text(),
  senha_acesso:  text(),
});

export type Cliente       = typeof clientes.$inferSelect;
export type ClienteInsert = typeof clientes.$inferInsert;
