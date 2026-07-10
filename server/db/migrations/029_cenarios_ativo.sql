-- 029: status ativo/inativo por cenário (auditoria jul/2026).
-- Permite tirar do ar cenários sazonais (ex: natal) sem apagar o cadastro.
-- Endpoints públicos passam a listar só ativo=1; o admin vê todos.

ALTER TABLE cenarios ADD COLUMN ativo INTEGER NOT NULL DEFAULT 1;
