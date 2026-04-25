-- Migração 001: Sistema de entrega e seleção de fotos
-- Seguro para executar múltiplas vezes (CREATE TABLE IF NOT EXISTS)
-- Não afeta as tabelas do Nuxt Content que usam o mesmo banco DB

CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  nome_sessao TEXT NOT NULL,
  produto_tipo TEXT NOT NULL,
  pacote_index INTEGER NOT NULL DEFAULT 0,
  fotos_incluidas INTEGER NOT NULL DEFAULT 0,
  preco_foto_extra REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'aguardando_fotos',
  -- status: aguardando_fotos | aguardando_selecao | selecao_concluida | entregue
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessao_fotos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sessao_id INTEGER NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
  cloudflare_image_id TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS selecoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sessao_id INTEGER NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
  foto_id INTEGER NOT NULL REFERENCES sessao_fotos(id) ON DELETE CASCADE,
  selecionada INTEGER NOT NULL DEFAULT 0,
  comentario TEXT,
  UNIQUE(sessao_id, foto_id)
);

CREATE TABLE IF NOT EXISTS entregas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sessao_id INTEGER NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE UNIQUE,
  r2_key TEXT,
  nome_arquivo TEXT,
  bg_image_id TEXT,
  mensagem TEXT,
  ativo INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Índices para queries frequentes
CREATE INDEX IF NOT EXISTS idx_sessoes_cliente ON sessoes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_sessao_fotos_sessao ON sessao_fotos(sessao_id);
CREATE INDEX IF NOT EXISTS idx_selecoes_sessao ON selecoes(sessao_id);
