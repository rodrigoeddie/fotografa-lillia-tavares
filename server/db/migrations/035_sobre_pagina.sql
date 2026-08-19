-- Página "Sobre a Fotógrafa" editável pelo admin: bloco de bio, cards de
-- serviços e a linha do tempo "Nossa história". Seed reproduz exatamente o
-- conteúdo que estava hard-coded em components/sections/sobre/.

CREATE TABLE IF NOT EXISTS sobre_pagina (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo             TEXT NOT NULL DEFAULT '',
  imagem_cf_id       TEXT,
  imagem_alt         TEXT,
  imagem_width       INTEGER NOT NULL DEFAULT 935,
  imagem_height      INTEGER NOT NULL DEFAULT 935,
  bio                TEXT NOT NULL DEFAULT '',
  servicos_titulo    TEXT NOT NULL DEFAULT '',
  timeline_titulo    TEXT NOT NULL DEFAULT '',
  timeline_descricao TEXT,
  atualizado_em      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sobre_servicos (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  tag             TEXT,
  titulo          TEXT NOT NULL,
  subtitulo       TEXT,
  descricao       TEXT,
  descricao_extra TEXT,
  cta_label       TEXT,
  cta_url         TEXT,
  sub_link_label  TEXT,
  sub_link_url    TEXT,
  destaque        INTEGER NOT NULL DEFAULT 0,
  ordem           INTEGER NOT NULL DEFAULT 0,
  ativo           INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS sobre_marcos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  ano          INTEGER NOT NULL,
  mes          TEXT,
  titulo       TEXT NOT NULL,
  descricao    TEXT,
  imagem_cf_id TEXT,
  formato      TEXT,
  ordem        INTEGER NOT NULL DEFAULT 0,
  ativo        INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_sobre_marcos_ordem ON sobre_marcos(ordem);

-- ── Seed: bloco principal ────────────────────────────────────────────────
INSERT OR IGNORE INTO sobre_pagina (
  id, titulo, imagem_cf_id, imagem_alt, imagem_width, imagem_height,
  bio, servicos_titulo, timeline_titulo, timeline_descricao
) VALUES (
  1,
  'Sobre a Fotógrafa Lillia Tavares',
  '5aaf1433-aaa7-42ed-7198-15626f964000',
  'Fotógrafa Lillia Tavares segurando sua câmera fotográfica',
  935,
  935,
  'Sou fotógrafa em Mogi das Cruzes e consultora de imagem, formada pela Etec de Artes e pelo Senac. Sou especialista em retratos femininos, fotografia corporativa e reposicionamento de imagem, capturando fotografias com intenção, presença e identidade.

Cresci cercada pela fotografia, em uma família que sempre fez questão de registrar e guardar cada momento vivido. Aprendi desde cedo que imagens não são apenas registros, são memórias que atravessam o tempo. Esse olhar atento para os detalhes, para a luz e para as emoções me acompanha em cada ensaio.

Atuo profissionalmente desde 2019, transformando a fotografia em uma ferramenta de fortalecimento da autoestima e construção de imagem. Em junho de 2024, inaugurei meu primeiro estúdio fotográfico em Mogi das Cruzes, criando um espaço pensado para acolher, direcionar e revelar o melhor de cada pessoa.

Cada ensaio é uma experiência guiada. Eu direciono poses, expressões e postura de forma natural, respeitando a individualidade de cada cliente. Meu objetivo é que você se sinta confiante, confortável e verdadeiramente representada nas suas fotos.',
  'O que eu ofereço',
  'Nossa história',
  'Uma jornada de evolução, aprendizado e muitas histórias fotografadas.'
);

-- ── Seed: cards de serviços ──────────────────────────────────────────────
INSERT INTO sobre_servicos (tag, titulo, subtitulo, descricao, descricao_extra, cta_label, cta_url, sub_link_label, sub_link_url, destaque, ordem, ativo)
SELECT
  'Produto principal',
  'Ensaios Fotográficos em Mogi das Cruzes',
  NULL,
  'Retratos femininos, corporativos, gestantes, família e debutantes. Cada sessão é conduzida com direção de poses, expressão e postura — tudo para revelar sua melhor versão com autenticidade.',
  'Como fotógrafa em Mogi das Cruzes, meu propósito é criar retratos que fortaleçam a autoestima, comuniquem identidade e gerem conexão verdadeira.',
  'Ver tipos de ensaio',
  '/ensaio-fotografico',
  NULL, NULL, 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_servicos);

INSERT INTO sobre_servicos (tag, titulo, subtitulo, descricao, descricao_extra, cta_label, cta_url, sub_link_label, sub_link_url, destaque, ordem, ativo)
SELECT
  NULL,
  'Estúdio Fotográfico',
  'Aluguel de espaço em Mogi das Cruzes',
  'Sete cenários modernos e sofisticados, do corporativo elegante ao intimista delicado. Fácil acesso, ótimas opções de estacionamento e infraestrutura completa para fotógrafos e criadores de conteúdo.',
  NULL,
  'Conhecer o espaço',
  '/estudio-fotografico-em-mogi-das-cruzes/aluguel',
  NULL, NULL, 0, 2, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_servicos WHERE ordem = 2);

INSERT INTO sobre_servicos (tag, titulo, subtitulo, descricao, descricao_extra, cta_label, cta_url, sub_link_label, sub_link_url, destaque, ordem, ativo)
SELECT
  NULL,
  'Consultoria de Imagem',
  NULL,
  'Análise e reposicionamento de imagem pessoal, disponível de forma independente ou como parte do pacote Do Tom ao Clique, que une consultoria ao ensaio fotográfico em uma experiência única.',
  NULL,
  NULL, NULL,
  'Análise de Coloração Pessoal',
  '/analise-coloracao-pessoal-em-mogi',
  0, 3, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_servicos WHERE ordem = 3);

-- ── Seed: linha do tempo "Nossa história" ────────────────────────────────
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2019, NULL, 'Espetáculo da Lola', 'Primeiros registros profissionais em cobertura de espetáculo teatral — o clique que confirmou a vocação.', '4f6db13c-469a-4636-b6b0-5f3f8dd71100', NULL, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 1);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2019, NULL, 'Ensaio na praia', 'Primeiros ensaios externos com luz natural, descobrindo o retrato feminino como linguagem.', 'dfef0926-9e7f-4292-3515-f61e93a55600', NULL, 2, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 2);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2021, 'Formação', 'Etec de Artes', 'Formação técnica em fotografia pela Etec, construindo a base técnica e artística.', 'cad71dbd-ff03-467e-b1d6-08d299ce5f00', NULL, 3, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 3);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2021, 'Prêmio', 'Prêmio Mogi Revela 2021', 'Ganhadora do 11º Prêmio Mogi Revela de Fotografia — mostra exibida no Centro Cultural de Mogi das Cruzes, um marco no reconhecimento da carreira.', '67da3987-5e01-4fc9-2417-2c5e2f61ad00', 'portrait', 4, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 4);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2022, 'Formação', 'Senac', 'Formação técnica em fotografia pelo Senac, reforçando a base técnica e artística.', NULL, NULL, 5, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 5);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2022, 'Formação', 'Senac', 'Especialização em consultoria de imagem pelo Senac, integrando moda e fotografia.', NULL, NULL, 6, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 6);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2023, NULL, 'Fashion Week', 'Cobertura de desfile de moda — experiência de bastidor e fotografia editorial em ritmo acelerado.', NULL, NULL, 7, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 7);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2024, 'Junho', 'Inauguração do Estúdio', 'Abertura do primeiro estúdio fotográfico próprio em Mogi das Cruzes, com sete cenários exclusivos.', NULL, NULL, 8, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 8);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2024, 'Dezembro', 'Natal 2024', 'Primeira temporada de Natal no estúdio — cenários temáticos e centenas de famílias fotografadas.', NULL, NULL, 9, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 9);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2025, 'Maio', 'Dia das Mães 2025', 'Campanha especial para mães e filhos, com ensaios emocionantes e cenários delicados.', NULL, NULL, 10, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 10);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2025, 'Junho', '1 Ano de Estúdio', 'Um ano de sonho realizado: centenas de ensaios, histórias transformadas e autoestima elevada.', NULL, NULL, 11, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 11);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2025, 'Dezembro', 'Natal 2025', 'Segunda temporada natalina, com cenários renovados e novos temas exclusivos.', NULL, NULL, 12, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 12);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2026, 'Maio', 'Dia das Mães 2026', 'Mais uma edição especial celebrando o vínculo entre mães e filhos através da fotografia.', NULL, NULL, 13, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 13);
INSERT INTO sobre_marcos (ano, mes, titulo, descricao, imagem_cf_id, formato, ordem, ativo)
SELECT 2026, 'Junho', '2 Anos de Estúdio', 'Dois anos construindo histórias, revelando beleza e fortalecendo a autoestima de mulheres em Mogi.', NULL, NULL, 14, 1
WHERE NOT EXISTS (SELECT 1 FROM sobre_marcos WHERE ordem = 14);
