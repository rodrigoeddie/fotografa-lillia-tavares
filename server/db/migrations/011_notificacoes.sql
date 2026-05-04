-- Migração 011: Sistema de notificações in-app + Web Push

-- Notificações internas (bell icon / inbox)
CREATE TABLE IF NOT EXISTS notificacoes (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo           TEXT    NOT NULL, -- 'admin' | 'cliente'
  destinatario_id INTEGER,         -- NULL = broadcast (admin global)
  titulo         TEXT    NOT NULL,
  mensagem       TEXT,
  lida           INTEGER NOT NULL DEFAULT 0,
  criado_em      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Subscriptions de Web Push (VAPID)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo            TEXT    NOT NULL, -- 'admin' | 'cliente'
  destinatario_id INTEGER,
  endpoint        TEXT    NOT NULL UNIQUE,
  p256dh          TEXT    NOT NULL,
  auth            TEXT    NOT NULL,
  criado_em       TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notificacoes_dest  ON notificacoes(tipo, destinatario_id);
CREATE INDEX IF NOT EXISTS idx_push_subs_dest     ON push_subscriptions(tipo, destinatario_id);
