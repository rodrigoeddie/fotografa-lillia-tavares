-- Migração 002: Sistema de conteúdo (substitui Nuxt Content files)
-- Seguro para executar múltiplas vezes (CREATE TABLE IF NOT EXISTS)

-- ─────────────────────────────────────────────
-- Produtos (ensaios) + Pacotes
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  title TEXT NOT NULL,
  description TEXT,
  lp_slug TEXT,         -- landing page slug (ex: 'corporativo')
  includes TEXT,        -- JSON array of strings
  cta_title TEXT,
  cta_description TEXT,
  cta_whatsapp_msg TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pacotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  preco REAL NOT NULL DEFAULT 0,
  num_parcelas INTEGER NOT NULL DEFAULT 1,
  preco_parcelas REAL,
  fotos_incluidas INTEGER NOT NULL DEFAULT 0,
  preco_foto_extra REAL NOT NULL DEFAULT 0,
  features TEXT,          -- JSON array of strings
  is_recommended INTEGER NOT NULL DEFAULT 0,
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_pacotes_produto ON pacotes(produto_id);

-- ─────────────────────────────────────────────
-- Depoimentos
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS depoimentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  foto_cf_id TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  data TEXT,
  texto TEXT NOT NULL,
  link TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  portfolio_link TEXT,
  ordem INTEGER NOT NULL DEFAULT 0
);

-- ─────────────────────────────────────────────
-- FAQ
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faq_categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS faq_perguntas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  categoria_id INTEGER NOT NULL REFERENCES faq_categorias(id) ON DELETE CASCADE,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_faq_perguntas_cat ON faq_perguntas(categoria_id);

-- ─────────────────────────────────────────────
-- Blog
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  categoria TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data TEXT,
  imagem_cf_id TEXT,
  conteudo TEXT,               -- HTML from TipTap
  conteudo_imagens TEXT,       -- JSON array of CF image IDs used in content
  album TEXT,                  -- JSON array of CF image IDs for gallery
  ativo INTEGER NOT NULL DEFAULT 1,
  seo_keywords TEXT,           -- JSON array of strings
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────
-- Portfolio
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_works (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  categoria TEXT NOT NULL,   -- ex: 'corporativo', 'dia-das-maes', 'sensual-intimista'
  titulo TEXT,
  data TEXT,
  local TEXT,
  depoimento_texto TEXT,     -- inline testimonial text (may differ from depoimentos table)
  depoimento_avatar TEXT,    -- CF image ID
  depoimento_link TEXT,
  cor_destaque TEXT,
  home INTEGER NOT NULL DEFAULT 0,
  home_order INTEGER NOT NULL DEFAULT 0,
  video TEXT,                -- iframe HTML
  instagram_uri TEXT,
  instagram_title TEXT,
  site TEXT,
  ativo INTEGER NOT NULL DEFAULT 1,
  ordem INTEGER NOT NULL DEFAULT 0,
  seo_keywords TEXT          -- JSON array
);

CREATE TABLE IF NOT EXISTS portfolio_fotos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_id INTEGER NOT NULL REFERENCES portfolio_works(id) ON DELETE CASCADE,
  cf_image_id TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  formato TEXT,              -- 'paisagem' | 'retrato'
  custom_class TEXT,
  alt TEXT,
  highlight INTEGER NOT NULL DEFAULT 0,
  can_be_thumb INTEGER NOT NULL DEFAULT 1,
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_portfolio_fotos_work ON portfolio_fotos(work_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_works_cat ON portfolio_works(categoria);

-- ─────────────────────────────────────────────
-- Cenários do estúdio
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cenario_paginas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,           -- ex: 'estudio', 'dia-das-maes-2025'
  titulo TEXT NOT NULL,
  titulo_pre TEXT,
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cenarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pagina_id INTEGER NOT NULL REFERENCES cenario_paginas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  imagem_bg_cf_id TEXT,
  imagem_exemplo_cf_id TEXT,
  imagem_exemplo_alt TEXT,
  imagem_exemplo_link TEXT,
  imagem_exemplo_titulo TEXT,
  imagem_exemplo_orientacao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_cenarios_pagina ON cenarios(pagina_id);

-- ─────────────────────────────────────────────
-- Alterações em tabelas existentes
-- (SQLite não suporta IF NOT EXISTS em ALTER TABLE —
--  estas colunas serão adicionadas apenas se a coluna não existir;
--  em caso de re-execução o erro "duplicate column" pode ser ignorado)
-- ─────────────────────────────────────────────
ALTER TABLE sessoes ADD COLUMN produto_id INTEGER REFERENCES produtos(id);

ALTER TABLE entregas ADD COLUMN portfolio_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE entregas ADD COLUMN portfolio_titulo TEXT;
ALTER TABLE entregas ADD COLUMN portfolio_categoria TEXT;
ALTER TABLE entregas ADD COLUMN portfolio_ordem INTEGER DEFAULT 0;

-- Portfolio fotos importadas do ZIP da entrega (sem marca d'água, redimensionadas)
CREATE TABLE IF NOT EXISTS entrega_portfolio_fotos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entrega_id INTEGER NOT NULL REFERENCES entregas(id) ON DELETE CASCADE,
  cf_image_id TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_entrega_portfolio_fotos ON entrega_portfolio_fotos(entrega_id);
