-- Migration 015: hero_banners
-- Banners hero configuráveis por página.

CREATE TABLE IF NOT EXISTS hero_banners (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo     TEXT    NOT NULL,
  subtitulo  TEXT,
  descricao  TEXT,
  bg_image   TEXT,
  cta_nome   TEXT,
  cta_url    TEXT,
  cta_target TEXT    NOT NULL DEFAULT 'self',
  ativo      INTEGER NOT NULL DEFAULT 1,
  ordem      INTEGER NOT NULL DEFAULT 0,
  criado_em  TEXT    DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS hero_banner_pages (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  banner_id INTEGER NOT NULL REFERENCES hero_banners(id) ON DELETE CASCADE,
  route     TEXT    NOT NULL,
  UNIQUE(banner_id, route)
);

CREATE INDEX IF NOT EXISTS idx_hero_banner_pages_banner ON hero_banner_pages(banner_id);
CREATE INDEX IF NOT EXISTS idx_hero_banner_pages_route  ON hero_banner_pages(route);
