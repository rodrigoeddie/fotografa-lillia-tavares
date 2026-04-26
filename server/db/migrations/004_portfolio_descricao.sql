-- Add descricao (description) and artigo fields to portfolio_works
-- descricao: text description shown on portfolio listing
-- artigo: Portuguese article ("o" or "a"), used for display

ALTER TABLE portfolio_works ADD COLUMN descricao TEXT;
ALTER TABLE portfolio_works ADD COLUMN artigo TEXT DEFAULT 'a';
