-- Migração 009: Múltiplas levas de seleção por sessão
-- Cada rodada de escolha de fotos gera um lote independente.
-- Fotos já entregues ficam bloqueadas nas levas seguintes.
-- Cada lote pode ter sua própria entrega.

-- 1. Tabela de lotes de seleção
CREATE TABLE IF NOT EXISTS selecao_lotes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  sessao_id  INTEGER NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
  criado_em  TEXT    NOT NULL DEFAULT (datetime('now')),
  status     TEXT    NOT NULL DEFAULT 'aguardando_selecao'
  -- status: aguardando_selecao | selecao_concluida | entregue
);

-- 2. Migrar sessões existentes que já tinham seleções → criar lote 1 para cada uma
INSERT INTO selecao_lotes (sessao_id, criado_em, status)
SELECT DISTINCT s.id, s.criado_em,
  CASE s.status
    WHEN 'selecao_concluida' THEN 'selecao_concluida'
    WHEN 'entregue'          THEN 'entregue'
    ELSE                          'aguardando_selecao'
  END
FROM sessoes s
WHERE EXISTS (SELECT 1 FROM selecoes sel WHERE sel.sessao_id = s.id);

-- 3. Criar nova tabela de seleções com lote_id (sem UNIQUE por sessao)
CREATE TABLE selecoes_new (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  lote_id     INTEGER NOT NULL REFERENCES selecao_lotes(id) ON DELETE CASCADE,
  foto_id     INTEGER NOT NULL REFERENCES sessao_fotos(id)  ON DELETE CASCADE,
  selecionada INTEGER NOT NULL DEFAULT 0,
  comentario  TEXT,
  UNIQUE(lote_id, foto_id)
);

-- 4. Migrar seleções existentes para o lote correspondente
INSERT INTO selecoes_new (id, lote_id, foto_id, selecionada, comentario)
SELECT sel.id, sl.id, sel.foto_id, sel.selecionada, sel.comentario
FROM selecoes sel
JOIN selecao_lotes sl ON sl.sessao_id = sel.sessao_id;

-- 5. Trocar tabela
DROP TABLE selecoes;
ALTER TABLE selecoes_new RENAME TO selecoes;

-- 6. Coluna entregue em sessao_fotos (bloqueia a foto nas levas seguintes)
ALTER TABLE sessao_fotos ADD COLUMN entregue INTEGER NOT NULL DEFAULT 0;

-- 7. Marcar como entregues fotos de sessões que já foram entregues
UPDATE sessao_fotos
SET entregue = 1
WHERE sessao_id IN (SELECT id FROM sessoes WHERE status = 'entregue');

-- 8. Recriar entregas sem o UNIQUE em sessao_id, adicionando lote_id
CREATE TABLE entregas_new (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  sessao_id    INTEGER NOT NULL REFERENCES sessoes(id)       ON DELETE CASCADE,
  lote_id      INTEGER          REFERENCES selecao_lotes(id) ON DELETE SET NULL,
  r2_key       TEXT,
  nome_arquivo TEXT,
  bg_image_id  TEXT,
  mensagem     TEXT,
  ativo        INTEGER NOT NULL DEFAULT 1,
  criado_em    TEXT    NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO entregas_new (id, sessao_id, lote_id, r2_key, nome_arquivo, bg_image_id, mensagem, ativo, criado_em)
SELECT e.id, e.sessao_id, sl.id, e.r2_key, e.nome_arquivo, e.bg_image_id, e.mensagem, e.ativo, e.criado_em
FROM entregas e
LEFT JOIN selecao_lotes sl ON sl.sessao_id = e.sessao_id;

DROP TABLE entregas;
ALTER TABLE entregas_new RENAME TO entregas;

-- 9. Índices
CREATE INDEX IF NOT EXISTS idx_selecao_lotes_sessao ON selecao_lotes(sessao_id);
CREATE INDEX IF NOT EXISTS idx_selecoes_lote         ON selecoes(lote_id);
CREATE INDEX IF NOT EXISTS idx_entregas_sessao        ON entregas(sessao_id);
CREATE INDEX IF NOT EXISTS idx_entregas_lote          ON entregas(lote_id);
