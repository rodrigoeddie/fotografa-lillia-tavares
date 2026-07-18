-- Seed: menu_items — estrutura de navegação alvo (docs/ia-site.md §6).
--
-- ⚠️  Seed de SUBSTITUIÇÃO (destrutivo por design), ao contrário dos seeds
--     aditivos (INSERT OR IGNORE) de landing-pages.sql / page-seo.sql.
--     Faz DELETE FROM menu_items + reinsert com IDs explícitos — o mesmo
--     comportamento de MenuService.replace() e da migration 030.
--
-- Uso principal: reaplicar o menu novo (nested) DEPOIS de importar um dump de
-- produção no ambiente local, já que prod ainda tem o menu antigo (flat).
--     wrangler d1 execute DB --local --file=server/db/seeds/menu.sql
--     (via bun: bun node_modules/wrangler/bin/wrangler.js d1 execute DB --local --file=server/db/seeds/menu.sql)
--
-- Requer a coluna parent_id (migration 028). O menu continua editável em
-- /admin/menu. Em produção, purgar cache em /admin/cache após aplicar
-- (endpoint público tem s-maxage=3600).

DELETE FROM menu_items;

-- Grupo 1 — Ensaios (âncora, prioridade nº 1)
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (1,  'Ensaios',                      '/ensaio-fotografico',                              0, 0, NULL);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (2,  'Portfólio',                    '/ensaio-fotografico',                              0, 0, 1);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (3,  'Preços e pacotes',             '/precos-ensaios-fotograficos',                     1, 0, 1);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (4,  'Ensaio corporativo',           '/ensaio-profissional-em-mogi',                     2, 0, 1);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (5,  'Presenteie um ensaio',         '/presente-ensaio-fotografico-mogi',                3, 0, 1);

-- Grupo 2 — Estúdio (prioridade nº 2)
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (6,  'Estúdio',                      '/estudio-fotografico-em-mogi-das-cruzes',          1, 0, NULL);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (7,  'Conheça o estúdio',            '/estudio-fotografico-em-mogi-das-cruzes',          0, 0, 6);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (8,  'Aluguel do estúdio',           '/estudio-fotografico-em-mogi-das-cruzes/aluguel',  1, 0, 6);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (9,  'Cenários',                     '/estudio-fotografico-em-mogi-das-cruzes/cenarios', 2, 0, 6);

-- Grupo 3 — Imagem & Estilo (prioridade nº 3)
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (10, 'Imagem & Estilo',              '/analise-coloracao-pessoal-em-mogi',               2, 0, NULL);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (11, 'Análise de coloração pessoal', '/analise-coloracao-pessoal-em-mogi',               0, 0, 10);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (12, 'Consultoria de imagem',        '/consultoria-de-imagem-em-mogi',                   1, 0, 10);

-- Grupo 4 — Sobre (resolve a página órfã + descoberta)
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (13, 'Sobre',                        '/sobre-fotografa-lillia-tavares',                  3, 0, NULL);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (14, 'A fotógrafa Lillia',           '/sobre-fotografa-lillia-tavares',                  0, 0, 13);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (15, 'Depoimentos',                  '/depoimentos',                                     1, 0, 13);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (16, 'Blog',                         '/blog',                                            2, 0, 13);
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (17, 'FAQ',                          '/perguntas-frequentes',                            3, 0, 13);

-- Item 5 — CTA (sem submenu)
INSERT INTO menu_items (id, label, path, ordem, blank, parent_id) VALUES (18, 'Agende seu ensaio',            '/agende-seu-ensaio',                               4, 0, NULL);
