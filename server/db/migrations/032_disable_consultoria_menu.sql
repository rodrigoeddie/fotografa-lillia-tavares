-- 032: desativa a Consultoria de Imagem no menu (jul/2026 — volta no futuro).
-- Remove o item de consultoria do submenu "Imagem & Estilo". Como o grupo ficaria
-- com um único filho apontando para o mesmo path do pai, ele é colapsado num link
-- direto de topo "Coloração Pessoal" (alinhado a docs/ia-site.md §6 e docs/paginas.md).
-- Idempotente e independente de IDs. Menu segue editável em /admin/menu.
-- Lembrete pós-aplicação: purge de cache em /admin/cache (menu público tem s-maxage=3600).
--
-- Para reativar a consultoria: recriar o grupo/submenu em /admin/menu (ou nova migration),
-- reverter os links de entrada e a rota (ver pages/consultoria-de-imagem-em-mogi/index.vue).

DELETE FROM menu_items WHERE path = '/consultoria-de-imagem-em-mogi';

DELETE FROM menu_items
  WHERE path = '/analise-coloracao-pessoal-em-mogi' AND parent_id IS NOT NULL;

UPDATE menu_items
  SET label = 'Coloração Pessoal'
  WHERE path = '/analise-coloracao-pessoal-em-mogi' AND parent_id IS NULL;
