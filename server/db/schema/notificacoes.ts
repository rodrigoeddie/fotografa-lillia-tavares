import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const notificacoes = sqliteTable('notificacoes', {
  id:              integer().primaryKey({ autoIncrement: true }),
  tipo:            text().notNull(),                  // 'admin' | 'cliente'
  destinatario_id: integer(),
  titulo:          text().notNull(),
  mensagem:        text(),
  lida:            integer().notNull().default(0),
  criado_em:       text().notNull().default(sql`(datetime('now'))`),
}, (t) => ({
  destIdx: index('idx_notificacoes_dest').on(t.tipo, t.destinatario_id),
}));

export const push_subscriptions = sqliteTable('push_subscriptions', {
  id:              integer().primaryKey({ autoIncrement: true }),
  tipo:            text().notNull(),
  destinatario_id: integer(),
  endpoint:        text().notNull().unique(),
  p256dh:          text().notNull(),
  auth:            text().notNull(),
  criado_em:       text().notNull().default(sql`(datetime('now'))`),
}, (t) => ({
  destIdx: index('idx_push_subs_dest').on(t.tipo, t.destinatario_id),
}));

// Alias camelCase
export const pushSubscriptions = push_subscriptions;

export type Notificacao            = typeof notificacoes.$inferSelect;
export type NotificacaoInsert      = typeof notificacoes.$inferInsert;
export type PushSubscription       = typeof push_subscriptions.$inferSelect;
export type PushSubscriptionInsert = typeof push_subscriptions.$inferInsert;
