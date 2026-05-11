-- Seed: page_seo (SEO unificado)
-- Idempotente via INSERT OR IGNORE (índice único parcial em entity+id ou route).

-- ── Landing pages: snapshot do useSeoMeta() das 3 páginas atuais ─────────────
INSERT OR IGNORE INTO page_seo (entity_type, entity_id, meta_title, meta_description, og_image_cf_id, canonical, jsonld_type)
SELECT 'lp', id,
  'Ensaio Profissional em Mogi das Cruzes | Fotos para LinkedIn e Empresas',
  'Ensaio fotográfico profissional em Mogi das Cruzes para LinkedIn, currículo e redes sociais. Estúdio completo, direção de poses e entrega rápida. Agende seu horário.',
  '54ca9011-783d-4bb0-c5ac-65e33edefa00',
  'https://fotografalilliatavares.com.br/ensaio-profissional-em-mogi',
  'WebPage'
FROM landing_pages WHERE slug='corporativo';

INSERT OR IGNORE INTO page_seo (entity_type, entity_id, meta_title, meta_description, og_image_cf_id, canonical, jsonld_type)
SELECT 'lp', id,
  'Presente com Ensaio Fotográfico em Mogi das Cruzes | Ideias Especiais',
  'Surpreenda quem você ama com um ensaio fotográfico profissional em Mogi das Cruzes. Presente perfeito para Dia das Mães, aniversário, casais e datas especiais. Fotos que eternizam momentos.',
  'a0839ccd-c1b8-4142-e44f-77c07c62c800',
  'https://fotografalilliatavares.com.br/presente-ensaio-fotografico-mogi',
  'WebPage'
FROM landing_pages WHERE slug='presentes';

INSERT OR IGNORE INTO page_seo (entity_type, entity_id, meta_title, meta_description, og_image_cf_id, canonical, jsonld_type)
SELECT 'lp', id,
  'Presente de Dia das Mães em Mogi das Cruzes: Ensaio Fotográfico Especial',
  'Se você está procurando um presente de dia das mães em Mogi das Cruzes, uma das opções mais especiais é um ensaio fotográfico profissional. Diferente de presentes comuns, como flores ou roupas, as fotos se tornam lembranças para toda a vida.',
  '737d6560-9e6a-49b4-b503-4c7d56dad900',
  'https://fotografalilliatavares.com.br/presente-ensaio-fotografico-mogi/dia-das-maes',
  'WebPage'
FROM landing_pages WHERE slug='dia-das-maes';

-- ── Blog: backfill a partir do estado atual ─────────────────────────────────
INSERT OR IGNORE INTO page_seo (entity_type, entity_id, meta_title, meta_description, og_image_cf_id, keywords, jsonld_type)
SELECT
  'blog',
  id,
  titulo,
  descricao,
  imagem_cf_id,
  seo_keywords,
  'BlogPosting'
FROM blog_posts;

-- ── Portfolio: backfill a partir do estado atual ────────────────────────────
INSERT OR IGNORE INTO page_seo (entity_type, entity_id, meta_title, meta_description, keywords, jsonld_type)
SELECT
  'portfolio',
  id,
  COALESCE(titulo, slug),
  descricao,
  seo_keywords,
  'WebPage'
FROM portfolio_works;

-- ── Páginas estáticas ───────────────────────────────────────────────────────
-- Home: LocalBusiness com jsonld_data completo (replica useSchemaOrg de pages/index.vue)
INSERT OR IGNORE INTO page_seo (entity_type, route, meta_title, meta_description, og_image_cf_id, og_image_alt, canonical, jsonld_type, jsonld_data) VALUES
  ('static', '/',
    'Fotógrafa Lillia Tavares',
    'Lillia Tavares: Fotógrafa de retratos femininos que celebra a singularidade das mulheres. Destaque sua realeza com uma sessão única que empodera sua autoestima.',
    'a0839ccd-c1b8-4142-e44f-77c07c62c800',
    'Fotógrafa Lillia Tavares segurando sua câmera fotográfica',
    'https://fotografalilliatavares.com.br/',
    'LocalBusiness',
    json('{"name":"Fotógrafa Lillia Tavares","image":"https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public","@id":"https://fotografalilliatavares.com.br","url":"https://fotografalilliatavares.com.br","telephone":"+55-11-9111-59795","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"Av. Ver. Narciso Yague Guimarães, 124 - Sala 21 - Vila Partenio","addressLocality":"Mogi das Cruzes","addressRegion":"SP","postalCode":"08780-200","addressCountry":"BR"},"geo":{"@type":"GeoCoordinates","latitude":"-23.5199319","longitude":"-46.1864729"},"sameAs":["https://www.facebook.com/fotografalilliatavares","https://www.instagram.com/fotografalilliatavares"]}'));

-- Demais estáticas: jsonld_data fica null (form do admin permite preencher quando necessário)
INSERT OR IGNORE INTO page_seo (entity_type, route, meta_title, meta_description, og_image_cf_id, canonical, jsonld_type) VALUES
  ('static', '/sobre-fotografa-lillia-tavares',
    'Sobre Lillia Tavares - Fotógrafa de Retratos Femininos em Mogi das Cruzes',
    'Conheça Lillia Tavares, fotógrafa especializada em retratos femininos em Mogi das Cruzes. História, estilo e missão de eternizar a realeza única de cada mulher.',
    '5aaf1433-aaa7-42ed-7198-15626f964000',
    'https://fotografalilliatavares.com.br/sobre-fotografa-lillia-tavares',
    'AboutPage'),

  ('static', '/depoimentos',
    'Depoimentos - Fotógrafa Lillia Tavares',
    'Veja o que clientes dizem sobre suas experiências de ensaio fotográfico em Mogi das Cruzes com a fotógrafa Lillia Tavares.',
    'a0839ccd-c1b8-4142-e44f-77c07c62c800',
    'https://fotografalilliatavares.com.br/depoimentos',
    'CollectionPage'),

  ('static', '/perguntas-frequentes',
    'Perguntas Frequentes - Fotógrafa Lillia Tavares',
    'Respostas sobre ensaios fotográficos, pacotes, agendamento e processo de entrega da Lillia Tavares Fotografia em Mogi das Cruzes.',
    'a0839ccd-c1b8-4142-e44f-77c07c62c800',
    'https://fotografalilliatavares.com.br/perguntas-frequentes',
    'FAQPage'),

  ('static', '/privacidade-e-termos',
    'Privacidade e Termos - Fotógrafa Lillia Tavares',
    'Política de privacidade e termos de uso do site da fotógrafa Lillia Tavares.',
    'a0839ccd-c1b8-4142-e44f-77c07c62c800',
    'https://fotografalilliatavares.com.br/privacidade-e-termos',
    'WebPage'),

  ('static', '/agende-seu-ensaio',
    'Agende seu Ensaio Fotográfico em Mogi das Cruzes',
    'Agende seu ensaio fotográfico com Lillia Tavares em Mogi das Cruzes. Ensaios femininos, corporativos, dia das mães e mais. Fale conosco pelo WhatsApp.',
    'a0839ccd-c1b8-4142-e44f-77c07c62c800',
    'https://fotografalilliatavares.com.br/agende-seu-ensaio',
    'WebPage'),

  ('static', '/analise-coloracao-pessoal-em-mogi',
    'Análise de Coloração Pessoal em Mogi das Cruzes',
    'Descubra sua paleta de cores ideal com análise de coloração pessoal profissional em Mogi das Cruzes. Aumente sua autoestima e estilo pessoal.',
    '5aaf1433-aaa7-42ed-7198-15626f964000',
    'https://fotografalilliatavares.com.br/analise-coloracao-pessoal-em-mogi',
    'Service'),

  ('static', '/blog',
    'Blog - Fotógrafa Lillia Tavares',
    'Dicas, bastidores e inspirações sobre fotografia feminina, retratos profissionais e ensaios em Mogi das Cruzes.',
    'a0839ccd-c1b8-4142-e44f-77c07c62c800',
    'https://fotografalilliatavares.com.br/blog',
    'CollectionPage'),

  ('static', '/ensaio-fotografico',
    'Portfólio - Ensaios Fotográficos em Mogi das Cruzes',
    'Veja o portfólio completo de ensaios fotográficos da Lillia Tavares em Mogi das Cruzes. Retratos femininos, corporativos, família, dia das mães e mais.',
    'a0839ccd-c1b8-4142-e44f-77c07c62c800',
    'https://fotografalilliatavares.com.br/ensaio-fotografico',
    'CollectionPage'),

  -- /estudio também é LocalBusiness; tratado abaixo num INSERT separado para incluir jsonld_data.

  ('static', '/precos-ensaios-fotograficos',
    'Preços de Ensaios Fotográficos em Mogi das Cruzes',
    'Confira os pacotes e preços dos ensaios fotográficos da Lillia Tavares em Mogi das Cruzes. Opções para retrato feminino, corporativo, família e mais.',
    'a0839ccd-c1b8-4142-e44f-77c07c62c800',
    'https://fotografalilliatavares.com.br/precos-ensaios-fotograficos',
    'WebPage'),

  ('static', '/orcamentos/dia-das-maes',
    'Orçamento de Ensaio para Dia das Mães em Mogi das Cruzes',
    'Receba o orçamento personalizado para um ensaio fotográfico de Dia das Mães em Mogi das Cruzes com a fotógrafa Lillia Tavares.',
    '737d6560-9e6a-49b4-b503-4c7d56dad900',
    'https://fotografalilliatavares.com.br/orcamentos/dia-das-maes',
    'WebPage');

-- /estudio: LocalBusiness com jsonld_data completo (replica useSchemaOrg de pages/estudio/index.vue)
INSERT OR IGNORE INTO page_seo (entity_type, route, meta_title, meta_description, og_image_cf_id, canonical, jsonld_type, jsonld_data) VALUES
  ('static', '/estudio',
    'Estúdio Fotográfico em Mogi das Cruzes - Lillia Tavares',
    'Conheça o estúdio fotográfico de Lillia Tavares em Mogi das Cruzes. Cenários variados, ambiente confortável e estrutura profissional para seu ensaio.',
    'a0839ccd-c1b8-4142-e44f-77c07c62c800',
    'https://fotografalilliatavares.com.br/estudio',
    'LocalBusiness',
    json('{"name":"Estúdio Fotográfico Lillia Tavares","image":"https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/0e29fb7d-191c-4447-7a71-95448ed4fd00/public","@id":"https://fotografalilliatavares.com.br/estudio","url":"https://fotografalilliatavares.com.br/estudio","telephone":"+55-11-9111-59795","address":{"@type":"PostalAddress","streetAddress":"Av. Ver. Narciso Yague Guimarães, 124 - Sala 21 - Vila Partenio","addressLocality":"Mogi das Cruzes","addressRegion":"SP","postalCode":"08780-200","addressCountry":"BR"},"geo":{"@type":"GeoCoordinates","latitude":"-23.5199319","longitude":"-46.1864729"},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"18:00"}],"sameAs":["https://www.facebook.com/fotografalilliatavares","https://www.instagram.com/fotografalilliatavares","https://www.tiktok.com/@fotografalilliatavares","https://wa.me/5511911159795"]}'));
