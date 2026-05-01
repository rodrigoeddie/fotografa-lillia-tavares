-- Migração 007: Usuários admin com hash PBKDF2-SHA256 + salt aleatório
-- Seguro para executar múltiplas vezes (CREATE TABLE IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS admin_users (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  username     TEXT    NOT NULL UNIQUE,
  password_hash TEXT   NOT NULL,  -- base64url(PBKDF2-SHA256, 100k iter, 32 bytes)
  salt         TEXT    NOT NULL,  -- base64url(random 16 bytes)
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);
