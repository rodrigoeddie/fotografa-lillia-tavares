-- 031: seed de SEO para a rota estática /consultoria-de-imagem-em-mogi
-- (página criada em 2026-07-11; decisão #8 do ROADMAP superada — ver docs/ia-site.md §7).
-- INSERT OR IGNORE: se o registro já foi criado/editado via /admin/seo, não sobrescreve.

INSERT OR IGNORE INTO page_seo (
  entity_type,
  route,
  focus_keyword,
  keywords,
  meta_title,
  meta_description,
  canonical,
  jsonld_type,
  jsonld_data
) VALUES (
  'static',
  '/consultoria-de-imagem-em-mogi',
  'consultoria de imagem mogi das cruzes',
  '["consultoria de imagem mogi das cruzes","consultoria de estilo","consultoria de imagem e estilo","personal stylist mogi","analise de coloracao pessoal e consultoria de imagem"]',
  'Consultoria de Imagem em Mogi das Cruzes | Lillia Tavares',
  'Consultoria de imagem e estilo em Mogi das Cruzes: diagnóstico de estilo, análise de biotipo, guia personalizado e combo com análise de coloração pessoal.',
  'https://fotografalilliatavares.com.br/consultoria-de-imagem-em-mogi',
  'Service',
  '{"name":"Consultoria de Imagem e Estilo","serviceType":"Consultoria de imagem","description":"Diagnóstico de estilo, análise de biotipo e guia de estilo personalizado, com opção de combo com análise de coloração pessoal.","provider":{"@type":"LocalBusiness","name":"Fotógrafa Lillia Tavares","address":{"@type":"PostalAddress","addressLocality":"Mogi das Cruzes","addressRegion":"SP","postalCode":"08780-200","streetAddress":"Av. Ver. Narciso Yague Guimarães, 124 — Sala 21, Vila Partenio"}},"areaServed":"Mogi das Cruzes e Alto Tietê"}'
);
