import { sqliteTable, integer, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const hero_banners = sqliteTable('hero_banners', {
  id:         integer().primaryKey({ autoIncrement: true }),
  titulo:     text(),
  subtitulo:  text(),
  descricao:  text(),
  bg_image:        text().notNull(),
  bg_image_mobile: text(),
  cta_nome:        text(),
  cta_url:    text(),
  cta_target: text().notNull().default('self'),
  ativo:      integer().notNull().default(1),
  ordem:      integer().notNull().default(0),
  criado_em:  text().default(sql`(datetime('now'))`),
});

export const hero_banner_pages = sqliteTable('hero_banner_pages', {
  id:        integer().primaryKey({ autoIncrement: true }),
  banner_id: integer().notNull().references(() => hero_banners.id, { onDelete: 'cascade' }),
  route:     text().notNull(),
}, (t) => ({
  bannerIdx:  index('idx_hero_banner_pages_banner').on(t.banner_id),
  routeIdx:   index('idx_hero_banner_pages_route').on(t.route),
  uniqPair:   unique('uq_hero_banner_page').on(t.banner_id, t.route),
}));

// Aliases camelCase
export const heroBanners     = hero_banners;
export const heroBannerPages = hero_banner_pages;

export type HeroBanner       = typeof hero_banners.$inferSelect;
export type HeroBannerInsert = typeof hero_banners.$inferInsert;
export type HeroBannerPage   = typeof hero_banner_pages.$inferSelect;
