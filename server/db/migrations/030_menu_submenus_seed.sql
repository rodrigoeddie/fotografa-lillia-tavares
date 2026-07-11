-- 030: seed do menu com submenus — aplica a estrutura alvo de docs/ia-site.md §6.
-- Substitui INTENCIONALMENTE o menu flat v2 (configurado via /admin/menu em 2026-07-09)
-- usando delete-all + reinsert com IDs explícitos, o mesmo comportamento de
-- MenuService.replace(). O menu continua 100% editável em /admin/menu depois.
-- Lembrete pós-aplicação: purge de cache em /admin/cache (o endpoint público tem s-maxage=3600).

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
