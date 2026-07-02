-- ⚠️ OBSOLETA — NÃO APLICAR EM PRODUÇÃO (verificado em 2026-07-01).
-- A coluna depoimento_id nunca entrou no schema Drizzle (server/db/schema/portfolio.ts)
-- e nenhum código a referencia: o vínculo depoimento↔portfolio é feito por
-- depoimentos.portfolio_link. Produção não tem esta coluna e está correta assim.
-- Mantida no repositório apenas para preservar a numeração sequencial.
ALTER TABLE portfolio_works ADD COLUMN depoimento_id INTEGER REFERENCES depoimentos(id);
