-- Migração 010: Prazo de seleção por sessão
ALTER TABLE sessoes ADD COLUMN prazo_selecao TEXT;
