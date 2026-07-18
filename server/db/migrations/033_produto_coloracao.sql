-- 033: produto "Análise de Coloração Pessoal" no sistema de preços/investimento.
-- Criado INATIVO (active=0) e com pacote placeholder (preço 0) — nada aparece no
-- site até a Lillia definir os valores e ATIVAR em /admin › Investimento.
-- Quando ativo, aparece tanto na página /analise-coloracao-pessoal-em-mogi (seção
-- de investimento) quanto na lista pública /precos-ensaios-fotograficos (+ detalhe
-- em /precos-ensaios-fotograficos/analise-coloracao-pessoal).

INSERT OR IGNORE INTO produtos (slug,title,description,lp_slug,icon,includes,cta_title,cta_description,cta_whatsapp_msg,active,ordem)
VALUES (
  'analise-coloracao-pessoal',
  'Análise de Coloração Pessoal',
  'Descubra a cartela de cores que harmoniza com seus tons naturais de pele, cabelo e olhos. Análise presencial no estúdio em Mogi das Cruzes, com cartela personalizada e orientações práticas de guarda-roupa, maquiagem e acessórios.',
  NULL,
  '🎨',
  '["Análise presencial com tecidos-teste no estúdio","Identificação da sua estação (sistema de 12 estações)","Cartela de cores personalizada para consultar sempre","Orientações de guarda-roupa, maquiagem e acessórios"]',
  'Pronta para descobrir suas cores?',
  'Agende sua análise de coloração pessoal em Mogi das Cruzes.',
  'Olá! Gostaria de agendar uma análise de coloração pessoal (mensagem do site)',
  0,
  7
);

-- Pacote placeholder — a Lillia edita o preço e ativa o produto no admin.
INSERT OR IGNORE INTO pacotes (produto_id,title,subtitle,preco,num_parcelas,preco_parcelas,fotos_incluidas,preco_foto_extra,features,is_recommended,ordem)
SELECT
  (SELECT id FROM produtos WHERE slug='analise-coloracao-pessoal'),
  'Análise de Coloração Pessoal',
  'Presencial no estúdio',
  0, 1, NULL, 0, 0,
  '["Análise presencial no estúdio","Cartela de cores personalizada","Sistema de 12 estações","Orientações de uso no dia a dia"]',
  0, 1
WHERE (SELECT id FROM produtos WHERE slug='analise-coloracao-pessoal') IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM pacotes
    WHERE produto_id=(SELECT id FROM produtos WHERE slug='analise-coloracao-pessoal')
      AND title='Análise de Coloração Pessoal'
  );
