/* ── 023: Pagamentos ─────────────────────────────────────────────────────
   - Adiciona valor_restante_pacote à sessão (definido pelo admin)
   - Adiciona numero_lote ao selecao_lotes para distinguir lote 1 dos seguintes
   - Cria tabela pagamentos para rastrear checkouts SumUp por lote
   ─────────────────────────────────────────────────────────────────────── */

ALTER TABLE sessoes ADD COLUMN valor_restante_pacote REAL NOT NULL DEFAULT 0;

ALTER TABLE selecao_lotes ADD COLUMN numero_lote INTEGER NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS pagamentos (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  sessao_id             INTEGER NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
  lote_id               INTEGER REFERENCES selecao_lotes(id) ON DELETE SET NULL,
  sumup_checkout_id     TEXT UNIQUE,
  sumup_transaction_id  TEXT,
  status                TEXT NOT NULL DEFAULT 'pendente',
  valor_cents           INTEGER NOT NULL,
  metodo                TEXT,
  descricao             TEXT,
  criado_em             TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em         TEXT
);

CREATE INDEX IF NOT EXISTS idx_pagamentos_sessao ON pagamentos(sessao_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_lote   ON pagamentos(lote_id);
