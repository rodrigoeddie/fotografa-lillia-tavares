-- Linktree: contador de cliques por bloco (agregado por chave estável).

CREATE TABLE IF NOT EXISTS linktree_clicks (
  chave         TEXT PRIMARY KEY,
  cliques       INTEGER NOT NULL DEFAULT 0,
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);
