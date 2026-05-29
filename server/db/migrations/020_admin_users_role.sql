-- Adiciona coluna role em admin_users
-- Usuários existentes tornam-se super_admin por padrão
ALTER TABLE admin_users ADD COLUMN role TEXT NOT NULL DEFAULT 'super_admin';
