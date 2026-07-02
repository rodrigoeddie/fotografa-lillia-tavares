import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Trilha de auditoria de consentimento LGPD (art. 8º §2º — ônus da prova é do controlador).
// Cada save do banner de cookies gera um registro; o histórico nunca é sobrescrito.
export const consentimentos = sqliteTable('consentimentos', {
  id:         integer().primaryKey({ autoIncrement: true }),
  visitor_id: text().notNull(),          // UUID anônimo gerado no navegador (localStorage)
  analytics:  integer().notNull().default(0),
  marketing:  integer().notNull().default(0),
  recording:  integer().notNull().default(0),
  user_agent: text(),
  criado_em:  text().notNull().default(sql`(datetime('now'))`),
}, (t) => ({
  visitorIdx: index('idx_consentimentos_visitor').on(t.visitor_id),
}));

export type Consentimento       = typeof consentimentos.$inferSelect;
export type ConsentimentoInsert = typeof consentimentos.$inferInsert;
