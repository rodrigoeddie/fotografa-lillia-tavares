import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';

export const faq_categorias = sqliteTable('faq_categorias', {
  id:     integer().primaryKey({ autoIncrement: true }),
  titulo: text().notNull(),
  slug:   text().notNull().unique(),
  ordem:  integer().notNull().default(0),
});

export const faq_perguntas = sqliteTable('faq_perguntas', {
  id:           integer().primaryKey({ autoIncrement: true }),
  categoria_id: integer().notNull().references(() => faq_categorias.id, { onDelete: 'cascade' }),
  pergunta:     text().notNull(),
  resposta:     text().notNull(),
  ordem:        integer().notNull().default(0),
}, (t) => ({
  catIdx: index('idx_faq_perguntas_cat').on(t.categoria_id),
}));

// Aliases camelCase
export const faqCategorias = faq_categorias;
export const faqPerguntas  = faq_perguntas;

export type FaqCategoria       = typeof faq_categorias.$inferSelect;
export type FaqCategoriaInsert = typeof faq_categorias.$inferInsert;
export type FaqPergunta        = typeof faq_perguntas.$inferSelect;
export type FaqPerguntaInsert  = typeof faq_perguntas.$inferInsert;
