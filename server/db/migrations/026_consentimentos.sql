-- Trilha de auditoria de consentimento de cookies (LGPD)
CREATE TABLE IF NOT EXISTS consentimentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  analytics INTEGER NOT NULL DEFAULT 0,
  marketing INTEGER NOT NULL DEFAULT 0,
  recording INTEGER NOT NULL DEFAULT 0,
  user_agent TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_consentimentos_visitor ON consentimentos(visitor_id);
