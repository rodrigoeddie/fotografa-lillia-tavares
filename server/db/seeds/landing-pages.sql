-- Seed: Landing Pages + blocos
-- Idempotente: INSERT OR IGNORE nas LPs (slug UNIQUE) e índice único temporário
-- em lp_blocks(lp_id, tipo, ordem) para deduplicar blocos durante re-execução.

-- ── 1. Landing pages (3 atuais) ────────────────────────────
INSERT OR IGNORE INTO landing_pages (slug, rota, titulo, lp_class, ativo, ordem) VALUES
  ('corporativo',   '/ensaio-profissional-em-mogi',                  'Ensaio Corporativo Mogi',  'lp-corporativo',  1, 0),
  ('presentes',     '/presente-ensaio-fotografico-mogi',             'Presentes Mogi',           'lp-presentes',    1, 1),
  ('dia-das-maes',  '/presente-ensaio-fotografico-mogi/dia-das-maes', 'Dia das Mães Mogi',       'lp-dia-das-maes', 1, 2);

-- Índice único temporário só para a duração desta seed
CREATE UNIQUE INDEX IF NOT EXISTS uq_lp_block_seed ON lp_blocks(lp_id, tipo, ordem);

-- ── 2. Blocos da LP corporativo ────────────────────────────
INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'hero', 0, json('{"variant":"corporativo"}')
FROM landing_pages WHERE slug='corporativo';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'portfolioGrid', 1, json('{"categoria":"corporativo","title":"Fotos corporativas feitas no estúdio","description":"Mais de 288 clientes atendidos em Mogi das Cruzes","buttonText":"Ver Portifólio Completo","buttonLink":"/ensaio-fotografico/corporativo","buttonLabel":"Ver portfólio completo de fotos corporativas feitas no estúdio"}')
FROM landing_pages WHERE slug='corporativo';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'forWho', 2, json('{"title":"Para quem é esse ensaio","description":"Não precisa saber posar, nós te direcionamos durante todo o ensaio","lists":[{"title":"Redes Sociais","list":["LinkedIn","Instagram","Facebook","Site institucional"]},{"title":"Empresários","list":["Advogados","Médicos","Psicólogos","Influenciadores..."]},{"title":"Outros","list":["Inscrições para comissários","Executivos","Currículos..."]}]}')
FROM landing_pages WHERE slug='corporativo';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'howWorks', 3, json('{"title":"Como funciona o ensaio","list":[{"title":"Agendamento","description":"Agende seu horário em poucos minutos","icon":"chedule"},{"title":"Ensaio","description":"Receba direção completa durante o ensaio","icon":"camera"},{"title":"Seleção","description":"Escolha suas melhores fotos","icon":"choose"},{"title":"Entrega","description":"Receba imagens profissionais prontas para uso","icon":"envelope"}]}')
FROM landing_pages WHERE slug='corporativo';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'prices', 4, json('{"produtoSlug":"corporativo"}')
FROM landing_pages WHERE slug='corporativo';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'testimonials', 5, json('{}')
FROM landing_pages WHERE slug='corporativo';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'ctaContact', 6, json('{"title":"Pronto para ter fotos profissionais?","description":"Agende seu ensaio corporativo em Mogi das Cruzes e destaque-se com qualidade.","buttonText":"Agendar meu ensaio agora","whatsappMessage":"Olá, gostaria de ver a disponibilidade de um ensaio corporativo (mensagem do site)","image":"efcab108-fb74-4ac1-431e-5f18938ada00","imageAlt":"Mulher branca de cabelos longos sentadas em uma poltrona de couro marrom, usando um body preto","features":["✔ Direção completa durante o ensaio","✔ Ideal para LinkedIn e redes sociais","✔ Entrega rápida","✔ Estúdio em Mogi das Cruzes"]}')
FROM landing_pages WHERE slug='corporativo';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'map', 7, json('{"title":"Estúdio Fotográfico em Mogi das Cruzes","description":"<p>Estamos localizados em frente ao estacionamento da Prefeitura de Mogi das Cruzes, com fácil acesso para toda a região do Alto Tietê. Estamos próximos às principais vias de acesso, pontos de ônibus e à estação de trem Estudantes.</p>"}')
FROM landing_pages WHERE slug='corporativo';

-- ── 3. Blocos da LP presentes ──────────────────────────────
INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'heroPresentes', 0, json('{"title":"Presenteie com Ensaio Fotográfico<br>em Mogi das Cruzes","subtitle":"Surpreenda quem você ama com uma experiência única: um ensaio fotográfico profissional que transforma momentos em lembranças para toda a vida.","features":["Memórias que duram para sempre","Experiência acolhedora no estúdio","Entrega com kits e vale-ensaio"],"whatsappMessage":"Olá, gostaria de saber mais sobre presentear com um ensaio fotográfico (mensagem do site)","buttonText":"Quero presentear com um ensaio →"}')
FROM landing_pages WHERE slug='presentes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'giftGrid', 1, json('{}')
FROM landing_pages WHERE slug='presentes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'deliverables', 2, json('{"title":"Produtos entregáveis para presente","description":"Além das fotos digitais, oferecemos kits especiais para tornar o presente ainda mais inesquecível.","items":[{"icon":"🎁","title":"Vale-Ensaio","description":"Cartão personalizado com vale-ensaio fotográfico. A pessoa presenteada agenda no melhor horário."},{"icon":"👜","title":"Nécessaire + Vale-Ensaio","description":"Kit premium com nécessaire personalizada e vale-ensaio dentro. Perfeito para surpreender."},{"icon":"📸","title":"Álbum Personalizado","description":"Álbum impresso com as melhores fotos do ensaio. Uma lembrança física que dura gerações."},{"icon":"🖼️","title":"Prints e Quadros","description":"Impressões de alta qualidade em diversos tamanhos, prontas para emoldurar e decorar."}]}')
FROM landing_pages WHERE slug='presentes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'forWho', 3, json('{"title":"Por que um ensaio fotográfico é o presente perfeito?","description":"Diferente de presentes comuns que perdem o valor com o tempo, um ensaio fotográfico profissional cria memórias que duram para sempre.","lists":[{"title":"Benefícios emocionais","list":["Autoestima e confiança","Memórias eternizadas","Experiência única e especial","Momento de cuidado pessoal"]},{"title":"Para quais ocasiões","list":["<b>Dia das Mães</b>","Aniversários","Dia dos Namorados","Natal e datas especiais"]},{"title":"O que está incluso","list":["Ensaio profissional no estúdio","Direção de poses completa","Fotos editadas profissionalmente","Kit presente personalizado"]}]}')
FROM landing_pages WHERE slug='presentes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'testimonials', 4, json('{}')
FROM landing_pages WHERE slug='presentes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'ctaContact', 5, json('{"title":"Quer presentear alguém especial?","description":"Entre em contato e monte o presente perfeito. Ajudamos você a escolher o melhor pacote para a ocasião.","buttonText":"Montar presente pelo WhatsApp","whatsappMessage":"Olá, gostaria de montar um presente com ensaio fotográfico (mensagem do site)","imageAlt":"Menino de costas para sua mãe, ambos sorrindo, com fundo bege","features":["✔ Vale-ensaio personalizado","✔ Kits especiais para presente","✔ Agendamento flexível","✔ Estúdio em Mogi das Cruzes"]}')
FROM landing_pages WHERE slug='presentes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'map', 6, json('{"title":"Estúdio Fotográfico em Mogi das Cruzes","description":"<p>Nosso estúdio fotográfico em Mogi das Cruzes está localizado em uma região central e de fácil acesso, ideal para quem quer presentear com um ensaio fotográfico profissional.</p><p>Estamos em frente ao estacionamento da Prefeitura de Mogi das Cruzes, próximos às principais vias da cidade, pontos de ônibus e à estação de trem Estudantes.</p>","finalDescription":"<p>Se você quer presentear alguém com um ensaio fotográfico em Mogi das Cruzes, nosso estúdio oferece o ambiente perfeito para criar lembranças únicas e especiais.</p>"}')
FROM landing_pages WHERE slug='presentes';

-- ── 4. Blocos da LP dia-das-maes ───────────────────────────
INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'hero', 0, json('{"variant":"dia-das-maes"}')
FROM landing_pages WHERE slug='dia-das-maes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'portfolioGrid', 1, json('{"categoria":"dia-das-maes","title":"Fotos de dia das mães feitas no estúdio","description":"Mais de 288 clientes atendidos em Mogi das Cruzes","buttonText":"Ver Portifólio Completo","buttonLink":"/ensaio-fotografico/dia-das-maes","buttonLabel":"Ver portfólio completo de fotos de dia das mães feitas no estúdio"}')
FROM landing_pages WHERE slug='dia-das-maes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'howWorks', 2, json('{"title":"Como funciona o ensaio","list":[{"title":"Agendamento rápido","description":"Escolha o melhor dia e horário de forma simples e rápida pelo WhatsApp","icon":"chedule"},{"title":"Experiência no estúdio","description":"Sua família será guiada em cada momento para se sentir confortável e sair linda nas fotos","icon":"camera"},{"title":"Escolha das fotos","description":"Selecione suas imagens favoritas com calma e sem pressão","icon":"choose"},{"title":"Entrega especial","description":"Receba fotos profissionais prontas para guardar como lembrança para toda a vida","icon":"envelope"}]}')
FROM landing_pages WHERE slug='dia-das-maes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'prices', 3, json('{"produtoSlug":"dia-das-maes"}')
FROM landing_pages WHERE slug='dia-das-maes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'testimonials', 4, json('{}')
FROM landing_pages WHERE slug='dia-das-maes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'ctaContact', 5, json('{"title":"Presenteie sua mãe com um ensaio fotográfico em Mogi das Cruzes","description":"Um presente que ela vai guardar para sempre. Agende o ensaio de Dia das Mães e surpreenda quem você mais ama com fotos profissionais cheias de emoção.","buttonText":"Quero presentear minha mãe →","whatsappMessage":"Olá, gostaria de ver a disponibilidade de um ensaio de dia das mães (mensagem do site)","image":"bdffeee4-f95f-43d4-8421-a80f9e0ea100","imageWidth":"2000","imageAlt":"Menino de costas para sua mãe, ambos sorrindo, com fundo bege, eles estão sentados no chão, a mãe tem um vestido vermelho e o menino uma camisa marrom","features":["✔ Presente com vale-ensaio personalizado","✔ Direção de poses durante todo o ensaio","✔ Lembranças para toda a vida"]}')
FROM landing_pages WHERE slug='dia-das-maes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'forWho', 6, json('{"title":"Ideias de presente para o Dia das Mães em Mogi das Cruzes","description":"Se você ainda está em dúvida sobre o que escolher, existem várias opções de presente. Mas algumas criam apenas momentos passageiros, enquanto outras se transformam em lembranças para toda a vida.","lists":[{"title":"Experiência para mães","list":["<b>Ensaio fotográfico</b>","Spa / Dia de beleza","Jantar especial"]},{"title":"Presentes clássicos","list":["Flores","Perfume","Roupas ou acessórios"]},{"title":"Experiências personalizadas","list":["Álbum personalizado","<small><b>Análise de coloração pessoal</b></small>","Consultoria de imagem"]}]}')
FROM landing_pages WHERE slug='dia-das-maes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'coloracao', 7, json('{}')
FROM landing_pages WHERE slug='dia-das-maes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'map', 8, json('{"title":"Estúdio Fotográfico em Mogi das Cruzes","description":"<p>Nosso estúdio fotográfico em Mogi das Cruzes está localizado em uma região central e de fácil acesso, ideal para quem busca praticidade na hora de realizar seu ensaio de Dia das Mães.</p><p>Estamos em frente ao estacionamento da Prefeitura de Mogi das Cruzes, próximos às principais vias da cidade, pontos de ônibus e à estação de trem Estudantes, facilitando a chegada de clientes de toda a região.</p>","finalDescription":"<p>Se você está procurando um ensaio fotográfico em Mogi das Cruzes para o Dia das Mães, nosso estúdio oferece um ambiente preparado para criar lembranças únicas e especiais.</p>"}')
FROM landing_pages WHERE slug='dia-das-maes';

INSERT OR IGNORE INTO lp_blocks (lp_id, tipo, ordem, dados)
SELECT id, 'hubBacklink', 9, json('{"text":"Veja outras ideias de presente com ensaio fotográfico","linkLabel":"Explorar todas as opções de presente →","linkTo":"/presente-ensaio-fotografico-mogi"}')
FROM landing_pages WHERE slug='dia-das-maes';

-- Remove o índice temporário (em runtime poderia haver duplicatas legítimas)
DROP INDEX IF EXISTS uq_lp_block_seed;
