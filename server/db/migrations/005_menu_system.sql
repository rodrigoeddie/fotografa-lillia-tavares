-- Migração 005: Menu de navegação em DB (substitui content/globals/menu.json)
-- Seguro para executar múltiplas vezes (CREATE TABLE IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0
);

-- Seeds: dados do menu.json original
INSERT OR IGNORE INTO menu_items (id, label, path, ordem) VALUES (1, 'Home', '/', 0);
INSERT OR IGNORE INTO menu_items (id, label, path, ordem) VALUES (2, 'Sobre', '/sobre-fotografa-lillia-tavares', 1);
INSERT OR IGNORE INTO menu_items (id, label, path, ordem) VALUES (3, 'Trabalhos', '/ensaio-fotografico', 2);
INSERT OR IGNORE INTO menu_items (id, label, path, ordem) VALUES (4, 'Estúdio', '/estudio', 3);
INSERT OR IGNORE INTO menu_items (id, label, path, ordem) VALUES (5, 'Preços', '/precos-ensaios-fotograficos', 4);
INSERT OR IGNORE INTO menu_items (id, label, path, ordem) VALUES (6, 'Blog', '/blog', 5);
INSERT OR IGNORE INTO menu_items (id, label, path, ordem) VALUES (7, 'FAQ', '/perguntas-frequentes', 6);
INSERT OR IGNORE INTO menu_items (id, label, path, ordem) VALUES (8, 'Agende seu ensaio', '/agende-seu-ensaio', 7);
