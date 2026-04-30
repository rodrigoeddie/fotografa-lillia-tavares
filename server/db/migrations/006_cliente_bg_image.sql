-- Migração 006: Adicionar imagem de fundo ao cliente
ALTER TABLE clientes ADD COLUMN bg_image TEXT;
