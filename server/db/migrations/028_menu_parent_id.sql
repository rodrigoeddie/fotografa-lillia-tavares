-- 028: submenus no menu de navegação (1 nível de profundidade).
-- Itens com parent_id NULL são o nível de topo; itens com parent_id apontam
-- para o pai. Spec da estrutura alvo em docs/ia-site.md §6.

ALTER TABLE menu_items ADD COLUMN parent_id INTEGER REFERENCES menu_items(id);
