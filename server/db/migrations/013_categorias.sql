-- Migration 013: tabelas de categorias para blog e portfolio

CREATE TABLE IF NOT EXISTS blog_categorias (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  slug      TEXT    NOT NULL UNIQUE,
  titulo    TEXT    NOT NULL,
  descricao TEXT,
  ordem     INTEGER NOT NULL DEFAULT 0,
  ativo     INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS portfolio_categorias (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  slug      TEXT    NOT NULL UNIQUE,
  titulo    TEXT    NOT NULL,
  descricao TEXT,
  ordem     INTEGER NOT NULL DEFAULT 0,
  ativo     INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Seeds: categorias iniciais vindas dos constantes do código
INSERT OR IGNORE INTO blog_categorias (slug, titulo, ordem) VALUES
  ('fotografia-corporativa', 'Fotografia Corporativa', 1),
  ('cenarios-tematicos',     'Cenários Temáticos',     2),
  ('presentes',              'Presentes',               3),
  ('dicas',                  'Dicas',                   4);

INSERT OR IGNORE INTO portfolio_categorias (slug, titulo, ordem) VALUES
  ('corporativo',        'Corporativo',         1),
  ('sensual-intimista',  'Sensual Intimista',   2),
  ('dia-das-maes',       'Dia das Mães',        3),
  ('gestante',           'Gestante',            4),
  ('aniversario',        'Aniversário',         5),
  ('casal',              'Casal',               6);
