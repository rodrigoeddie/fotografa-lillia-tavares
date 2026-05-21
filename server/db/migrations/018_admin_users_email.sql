-- Migração 018: Adiciona coluna email em admin_users
ALTER TABLE admin_users ADD COLUMN email TEXT;
