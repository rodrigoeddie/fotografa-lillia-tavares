-- Migration 014: page_faq
-- Associa um grupo de FAQ a qualquer rota pública do site.

CREATE TABLE IF NOT EXISTS page_faq (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  route      TEXT    NOT NULL UNIQUE,
  faq_slug   TEXT    NOT NULL,
  criado_em  TEXT    DEFAULT (datetime('now'))
);
