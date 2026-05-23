import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';

export const portfolio_works = sqliteTable('portfolio_works', {
  id:                 integer().primaryKey({ autoIncrement: true }),
  slug:               text().notNull().unique(),
  categoria:          text().notNull(),
  titulo:             text(),
  data:               text(),
  local:              text(),
  depoimento_texto:   text(),
  depoimento_avatar:  text(),
  depoimento_link:    text(),
  depoimento_date:    text(),
  depoimento_rating:  integer(),
  cor_destaque:       text(),
  home:               integer().notNull().default(0),
  home_order:         integer().notNull().default(0),
  video:              text(),
  instagram_uri:      text(),
  instagram_title:    text(),
  site:               text(),
  ativo:              integer().notNull().default(1),
  ordem:              integer().notNull().default(0),
  seo_keywords:       text(),                 // JSON
  descricao:          text(),
  artigo:             text().default('a'),
}, (t) => ({
  catIdx: index('idx_portfolio_works_cat').on(t.categoria),
}));

export const portfolio_fotos = sqliteTable('portfolio_fotos', {
  id:           integer().primaryKey({ autoIncrement: true }),
  work_id:      integer().notNull().references(() => portfolio_works.id, { onDelete: 'cascade' }),
  cf_image_id:  text().notNull(),
  width:        integer(),
  height:       integer(),
  formato:      text(),
  custom_class: text(),
  alt:          text(),
  highlight:    integer().notNull().default(0),
  can_be_thumb: integer().notNull().default(1),
  ordem:        integer().notNull().default(0),
}, (t) => ({
  workIdx: index('idx_portfolio_fotos_work').on(t.work_id),
}));

// Aliases camelCase
export const portfolioWorks = portfolio_works;
export const portfolioFotos = portfolio_fotos;

export type PortfolioWork       = typeof portfolio_works.$inferSelect;
export type PortfolioWorkInsert = typeof portfolio_works.$inferInsert;
export type PortfolioFoto       = typeof portfolio_fotos.$inferSelect;
export type PortfolioFotoInsert = typeof portfolio_fotos.$inferInsert;
