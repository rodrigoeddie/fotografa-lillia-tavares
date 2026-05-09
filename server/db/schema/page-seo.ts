import { sqliteTable, integer, text, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Tabela polimórfica de SEO. Cada registro pode pertencer a:
 *  - uma entidade existente (entity_type + entity_id): 'lp' | 'blog' | 'portfolio'
 *  - uma rota estática (entity_type='static' + route)
 *
 * Restrições de unicidade definidas via parciais index (SQLite suporta).
 */
export const page_seo = sqliteTable('page_seo', {
  id:                    integer().primaryKey({ autoIncrement: true }),

  entity_type:           text({ enum: ['lp', 'blog', 'portfolio', 'static'] }).notNull(),
  entity_id:             integer(),
  route:                 text(),

  focus_keyword:         text(),
  keywords:              text(),                   // JSON array
  meta_title:            text(),
  meta_description:      text(),
  og_image_cf_id:        text(),
  og_image_alt:          text(),
  twitter_image_cf_id:   text(),
  canonical:             text(),
  robots:                text(),

  jsonld_type:           text(),
  jsonld_data:           text(),                   // JSON

  score:                 integer(),
  last_evaluated_at:     text(),
  last_issues:           text(),                   // JSON [{ severity, code, message, ... }]
  technical_audit:       text(),                   // JSON
  last_audited_at:       text(),

  criado_em:             text().notNull().default(sql`(datetime('now'))`),
  atualizado_em:         text().notNull().default(sql`(datetime('now'))`),
}, (t) => ({
  entityIdx: uniqueIndex('idx_page_seo_entity')
    .on(t.entity_type, t.entity_id)
    .where(sql`${t.entity_id} IS NOT NULL`),
  routeIdx: uniqueIndex('idx_page_seo_route')
    .on(t.route)
    .where(sql`${t.entity_type} = 'static' AND ${t.route} IS NOT NULL`),
  scoreIdx: index('idx_page_seo_score').on(t.score),
  typeIdx:  index('idx_page_seo_type').on(t.entity_type),
}));

// Alias camelCase
export const pageSeo = page_seo;

export type PageSeo       = typeof page_seo.$inferSelect;
export type PageSeoInsert = typeof page_seo.$inferInsert;
