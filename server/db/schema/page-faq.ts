import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const page_faq = sqliteTable('page_faq', {
  id:          integer().primaryKey({ autoIncrement: true }),
  route:       text().notNull().unique(),   // ex: /sobre-fotografa-lillia-tavares
  faq_slug:    text().notNull(),            // slug da categoria do FAQ
  criado_em:   text().default(sql`(datetime('now'))`),
});

export type PageFaq       = typeof page_faq.$inferSelect;
export type PageFaqInsert = typeof page_faq.$inferInsert;
