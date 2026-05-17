-- Migration 017: hero_banners_titulo_nullable_bg_image_required
-- Make titulo nullable, bg_image required

PRAGMA foreign_keys = OFF;

CREATE TABLE hero_banners_new (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo     TEXT,
  subtitulo  TEXT,
  descricao  TEXT,
  bg_image        TEXT    NOT NULL DEFAULT '',
  bg_image_mobile TEXT,
  cta_nome   TEXT,
  cta_url    TEXT,
  cta_target TEXT    NOT NULL DEFAULT 'self',
  ativo      INTEGER NOT NULL DEFAULT 1,
  ordem      INTEGER NOT NULL DEFAULT 0,
  criado_em  TEXT    DEFAULT (datetime('now'))
);

INSERT INTO hero_banners_new
  SELECT id, titulo, subtitulo, descricao,
         COALESCE(bg_image, ''),
         bg_image_mobile,
         cta_nome, cta_url, cta_target, ativo, ordem, criado_em
  FROM hero_banners;

DROP TABLE hero_banners;
ALTER TABLE hero_banners_new RENAME TO hero_banners;

PRAGMA foreign_keys = ON;
