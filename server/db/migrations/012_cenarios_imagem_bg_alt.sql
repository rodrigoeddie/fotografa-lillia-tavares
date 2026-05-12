-- Migração 012: Adicionar alt da imagem de fundo aos cenários
ALTER TABLE cenarios ADD COLUMN imagem_bg_alt TEXT;
