-- Linktree: presets nomeados (temporadas/temas). Cada preset carrega o cabeçalho
-- completo (nome, headline, avatar, tema) + seus próprios blocos. Exatamente um
-- preset fica ativo por vez e alimenta a página pública /links.

CREATE TABLE IF NOT EXISTS linktree_presets (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo        TEXT NOT NULL DEFAULT 'Preset',
  ativo         INTEGER NOT NULL DEFAULT 0,
  avatar_cf_id  TEXT,
  nome          TEXT NOT NULL DEFAULT '',
  headline      TEXT,
  tema          TEXT NOT NULL DEFAULT 'claro',
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

-- No máximo um preset ativo por vez (índice único parcial).
CREATE UNIQUE INDEX IF NOT EXISTS idx_linktree_presets_ativo
  ON linktree_presets(ativo) WHERE ativo = 1;

-- Migra o perfil único atual (linktree_profile id=1) para o primeiro preset, já ativo.
INSERT INTO linktree_presets (id, titulo, ativo, avatar_cf_id, nome, headline, tema)
SELECT 1, 'Padrão', 1, avatar_cf_id, nome, headline, tema
FROM linktree_profile WHERE id = 1;

-- Fallback: garante um preset ativo mesmo se não houver perfil migrado.
INSERT OR IGNORE INTO linktree_presets (id, titulo, ativo, nome, tema)
VALUES (1, 'Padrão', 1, 'Fotógrafa Lillia Tavares', 'claro');

-- Vincula os itens existentes ao preset 1 (default aplica-se às linhas atuais).
ALTER TABLE linktree_items ADD COLUMN preset_id INTEGER NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_linktree_items_preset
  ON linktree_items(preset_id, ordem);

-- linktree_profile fica obsoleta (dados migrados p/ linktree_presets); mantida por segurança.
