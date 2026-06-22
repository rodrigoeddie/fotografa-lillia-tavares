-- Linktree: hub público (/links) alimentado pelos dados do site.

CREATE TABLE IF NOT EXISTS linktree_profile (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  avatar_cf_id  TEXT,
  nome          TEXT NOT NULL DEFAULT '',
  headline      TEXT,
  tema          TEXT NOT NULL DEFAULT 'claro',
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS linktree_items (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  ordem  INTEGER NOT NULL DEFAULT 0,
  ativo  INTEGER NOT NULL DEFAULT 1,
  tipo   TEXT NOT NULL,
  config TEXT NOT NULL
);

-- Perfil inicial (linha única id=1)
INSERT OR IGNORE INTO linktree_profile (id, nome, headline, tema)
VALUES (1, 'Fotógrafa Lillia Tavares', 'Retratos femininos que celebram a sua singularidade', 'claro');

-- Blocos iniciais de exemplo
INSERT OR IGNORE INTO linktree_items (id, ordem, ativo, tipo, config) VALUES
  (1, 0, 1, 'atalho', '{"destino":"site"}'),
  (2, 1, 1, 'atalho', '{"destino":"portfolio"}'),
  (3, 2, 1, 'atalho', '{"destino":"precos"}'),
  (4, 3, 1, 'atalho', '{"destino":"agendamento"}'),
  (5, 4, 1, 'atalho', '{"destino":"depoimentos"}');
