# paginas.md — Registro Estruturado por Página

> **Última atualização:** 2026-07-09
> Fonte canônica do **estado editorial** de cada página pública: propósito, seções, links, CTAs e issues. Absorve a auditoria manual de jul/2026 (ex-`organizacao-das-paginas.md`).
> **Papéis dos docs:** estado editorial → este arquivo · estratégia/regras → [ia-site.md](ia-site.md) · trabalho priorizado → [ROADMAP.md](ROADMAP.md) · plumbing técnico rota→API → [sitemap.md](sitemap.md).

**Regra anti-divergência:** uma issue daqui vira checkbox no ROADMAP **apenas se exigir dev ou decisão**. Issue de conteúdo puro (resolvível via admin) vive só aqui — o ROADMAP referencia o grupo, não cada micro-item. Ao fechar: marcar aqui E no ROADMAP se lá existir.

**Novas auditorias:** escrever direto na seção *Issues* da rota, com tag `[triagem]` para itens ainda não classificados.

**Template por rota** (famílias dinâmicas têm UMA seção com inventário de instâncias):
`Tipo` estatica | dinamica-d1 | lp · `Funil` descoberta | consideracao | conversao | pos-venda | suporte (ver [ia-site.md §2](ia-site.md)) · `Serviço` ensaio | aluguel | coloracao | consultoria | transversal · `Status` ok | incompleta | orfa

---

## /

| Campo | Valor |
|---|---|
| Tipo | estatica |
| Funil | descoberta (hub — dupla função) |
| Serviço | transversal |
| Status | ok |
| Keyword | "fotógrafa em mogi das cruzes" |
| No menu | não (logo leva para cá) |

**Propósito:** hub de entrada — apresenta a fotógrafa, o portfolio em destaque e distribui para todos os serviços da tabela de prioridades.

**Seções:**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Hero (díptico + painel de serviços) | ok | painel: ensaios / aluguel / coloração; CTA primário `/agende-seu-ensaio` |
| 2 | Portfolio destaque | ok | |
| 3 | Depoimentos | ok | `SectionsGeneralTestimonials` |
| 4 | O estúdio | ok | `SectionsStudioTiny` sem mapa |

**Links de entrada:** logo (todas as páginas), GBP, redes sociais
**Links de saída:** `/agende-seu-ensaio`, `/ensaio-fotografico`, `/estudio-fotografico-em-mogi-das-cruzes`, `/estudio-.../aluguel`, `/analise-coloracao-pessoal-em-mogi`
**CTAs:**
| Posição | Tipo | Destino | Status |
|---|---|---|---|
| hero | primário | `/agende-seu-ensaio` | ok (`cta-agendar-home` trackeado) |
| hero painel | secundário | `/agende-seu-ensaio` | ok |

**Issues:**
- [x] Quick-link "Conheça a Lillia" → `/sobre-fotografa-lillia-tavares` no hero — feito em 2026-07-09 (L11; CTA primário permanece, decisão em [ia-site.md §7](ia-site.md))

## /sobre-fotografa-lillia-tavares

| Campo | Valor |
|---|---|
| Tipo | estatica |
| Funil | descoberta |
| Serviço | transversal |
| Status | incompleta (era **orfa** até 2026-07-09) |
| Keyword | "fotógrafa lillia tavares" |
| No menu | sim (item "Sobre", desde 2026-07-09) |

**Propósito:** bio e construção de confiança — quem é a fotógrafa, trajetória, por que escolher. Cita coloração e consultoria de imagem.

**Links de entrada:** menu, footer, hero da home (quick-link "Conheça a Lillia") — regra dos 2 mínimos superada
**Links de saída:** [triagem] mapear ao editar a página
**CTAs:** [triagem] revisar

**Issues:**
- [x] Entrar no menu flat v2 — feito em 2026-07-09
- [x] Quick-link no hero da home — feito em 2026-07-09 (L11)
- [ ] Parágrafo de consultoria de imagem com âncora linkável (L14 — ROADMAP P0-C; estratégia em [ia-site.md §7](ia-site.md))

## /depoimentos

| Campo | Valor |
|---|---|
| Tipo | dinamica-d1 |
| Funil | consideracao |
| Serviço | transversal |
| Status | ok |
| Keyword | "fotógrafa mogi das cruzes avaliações" |
| No menu | não (candidata a submenu "Sobre") |

**Propósito:** prova social — 100 depoimentos 5 estrelas do Google Meu Negócio. Redutor de objeção.

**Seções:**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Destaques | ok | `SectionsDepoimentosHighlights` |
| 2 | Lista completa | ok | `SectionsDepoimentosList` |
| 3 | Tinyform | ok | fechamento correto p/ consideração |

**Links de entrada:** home (seção depoimentos) — [triagem] confirmar se a seção da home linka para cá; se não, adicionar
**Links de saída:** — (Tinyform → WhatsApp)
**CTAs:** Tinyform ao fim → WhatsApp — ok

**Issues:** —

## /perguntas-frequentes

| Campo | Valor |
|---|---|
| Tipo | dinamica-d1 (grupos de FAQ via admin) |
| Funil | consideracao/suporte |
| Serviço | transversal |
| Status | incompleta |
| Keyword | "ensaio fotográfico dúvidas" |
| No menu | sim |

**Propósito:** reduzir objeções e cortar atendimento repetitivo no WhatsApp.

**Links de entrada:** menu, footer, CTA FAQ da página de preços (L12 ✅ 2026-07-09)
**Links de saída:** — [triagem] mapear
**CTAs:** [triagem] revisar

**Issues:**
- [ ] Inserir mais dados de FAQ (conteúdo via admin — ROADMAP P0-C)

## /agende-seu-ensaio

| Campo | Valor |
|---|---|
| Tipo | estatica |
| Funil | **conversao** |
| Serviço | ensaio |
| Status | ok |
| Keyword | "agendar ensaio fotográfico mogi" |
| No menu | sim (CTA do menu desde 2026-07-09, substituiu o link cru de WhatsApp) |

**Propósito:** página de conversão — calendário que monta o texto do link para WhatsApp.

**Seções:**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Form completo (calendário → whats) | ok | `SectionsScheduleForm` |
| 2 | O estúdio | ok | `SectionsStudioTiny` com mapa |
| 3 | Mapa do estúdio | ok | |

**Links de entrada:** hero home (2×), Tinyforms (portfolio detalhe, depoimentos), LPs, menu (após flat v2)
**Links de saída:** `/estudio-fotografico-em-mogi-das-cruzes` (via seção estúdio) — ok, redutor de objeção
**CTAs:** form da página → WhatsApp com texto configurado — ok. **Não adicionar Tinyform nem links de fuga** (regra de conversão, [ia-site.md §4](ia-site.md)).

**Issues:** —

## /privacidade-e-termos

| Campo | Valor |
|---|---|
| Tipo | estatica |
| Funil | suporte |
| Serviço | transversal |
| Status | ok |
| No menu | não (footer) |

**Propósito:** texto jurídico + botão de gerenciamento de consentimento de cookies. Sem CTA comercial (regra §4).

**Links de entrada:** footer, banner de cookies
**Issues:** —

## /blog (família: índice + [category] + [category]/[slug])

| Campo | Valor |
|---|---|
| Tipo | dinamica-d1 |
| Funil | descoberta |
| Serviço | transversal (cada post puxa um serviço) |
| Status | incompleta |
| Keyword | por post (ver inventário) |
| No menu | sim |

**Propósito:** motor de SEO — cada post mira uma keyword e alimenta links internos para portfolio/LPs/preços (regra de linking nº 2: todo post fecha com ≥1 link educativo + 1 CTA contextual).

**Seções (índice):**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Lista de posts | ok | |
| 2 | Lista de categorias | ok | barra `SectionsBlogMenuCategories` (L13 ✅ 2026-07-09) |

**Seções ([category]):**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Lista filtrada | ok | |
| 2 | Nome da categoria | ok | lido de `blog_categorias.titulo` via `useBlogCategorias` (✅ 2026-07-09) |
| 3 | Descrição da categoria | ok | exibe `blog_categorias.descricao` quando preenchida (✅ 2026-07-09) |

**Seções ([slug] — post):**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Hero | ok | |
| 2 | Conteúdo | ok | |
| 3 | Ensaios com esse tema | religada (código) | migration 027 + campos no form do post (✅ 2026-07-09); **preencher por post via admin** (P0-E) |
| 4 | Tinyform | religada (código) | switch "Agendamento no fim do post" no admin; ligar nos posts relevantes (P0-E) |

**Links de entrada:** menu, footer
**CTAs:** por post (ver inventário) — padrão: link educativo + CTA contextual ao fim; Tinyform ao fim quando religado.

**Inventário de posts (8):**
| Post | Keyword | Links de saída hoje | Issues |
|---|---|---|---|
| PIPA Hub: espaço para empreendedores | ensaio corporativo mogi das cruzes | — | [ ] CTA existe mas não linka → LP corporativo + `/ensaio-fotografico/corporativo` (L1, admin) |
| Cartório de Mogi das Cruzes | ensaio de casal, casamento intimista civil | — | [ ] CTA sem link; interim → `/agende-seu-ensaio`; ideal → portfolio casal/casamento civil quando existir (L2, admin) |
| Presente de Dia das Mães | presente dia das mães mogi | LP dia-das-maes, hub presentes, `/ensaio-fotografico/dia-das-maes` | [ ] Falta "ensaios com esse tema" (L6 — bloqueado pelo bug) |
| Ensaio profissional para o LinkedIn | foto para linkedin | `/ensaio-profissional-em-mogi` | — (post-modelo de linking) |
| Nosso cenário do natal 2025 | natal | — | [ ] Inserir portfolios natal 2024/2025 (L4 — bloqueado: cadastrar portfolios antes; prepara Natal 2026) |
| Vantagens de fotos corporativas | fotos corporativas profissionais | — | [ ] Sem CTA → portfolio corporativo + LP corporativo + agende (L3, admin) |
| Nosso cenário do dia das mães 2025 | dia das mães | link antigo (redirect salva) | [ ] Atualizar link (L5, admin) · [ ] Post Dia das Mães 2026 referenciando o cenário da cama (sazonal — ROADMAP P2) |
| Nosso cenário do natal 2024 | natal | — | [ ] Conteúdo muito curto — expandir (ROADMAP P2) |

## /ensaio-fotografico (família portfolio: índice + [category] + [category]/[slug])

| Campo | Valor |
|---|---|
| Tipo | dinamica-d1 |
| Funil | descoberta (índice/categoria) → consideracao (detalhe) |
| Serviço | ensaio |
| Status | ok |
| Keyword | "ensaio fotográfico em mogi das cruzes" |
| No menu | sim ("Ensaios" — renomeado de "Trabalhos" em 2026-07-09) |

**Propósito:** portfolio — prova de qualidade e porta de entrada orgânica por categoria.

**Categorias atuais:** corporativo · sensual intimista · dia das maes. (Cadastráveis: casal, gestante, aniversário, espetáculo, natal...)

**Seções ([slug] — detalhe):**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Hero | ok | |
| 2 | Mosaico de fotos | ok | hover-reveal (redesign jul/2026) |
| 3 | Tinyform (CTA agende) | ok | fechamento correto; acento pela cor do ensaio |

**Links de entrada:** menu, footer, home (portfolio destaque), posts do blog (quando os links forem corrigidos)
**Links de saída:** categorias → trabalhos → Tinyform
**CTAs:** Tinyform no detalhe — ok

**Issues:**
- [ ] Nome de categoria via mapa hardcoded (`PORTFOLIO_CATEGORIAS` em `useD1Adapters.ts`) em vez da tabela `portfolio_categorias.titulo` — mesmo bug do blog (ROADMAP P0-B)
- [ ] Cadastrar portfolios Natal 2024 e Natal 2025 (desbloqueia L4, prepara campanha Natal 2026 — ROADMAP P0-C)
- [ ] Futuro: portfolio de casal / casamento civil (desbloqueia link ideal do post Cartório — L2)

## /precos-ensaios-fotograficos (família: índice + [slug])

| Campo | Valor |
|---|---|
| Tipo | dinamica-d1 |
| Funil | consideracao |
| Serviço | ensaio |
| Status | incompleta |
| Keyword | "quanto custa ensaio fotográfico mogi" |
| No menu | sim |

**Propósito:** transparência de preço por categoria — passo natural entre portfolio e agendamento.

**Seções (índice):**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Lista de itens | ok | só "corporativo" e "sensual intimista" têm interna |
| 2 | Por que investir em fotografia | ok | componentizada: `SectionsGeneralWhyInvest` (✅ 2026-07-09) |
| 3 | CTA para FAQ | ok | componentizada: `SectionsGeneralCtaFaq` → `/perguntas-frequentes` + whats secundário (L12 ✅ 2026-07-09) |

**Seções ([slug]):** pacotes · o que está incluso — ok
**Links de entrada:** menu, footer
**Links de saída:** internas de preço; FAQ (após L12)
**CTAs:** [triagem] conferir CTA → `/agende-seu-ensaio` nas internas (regra: consideração converte via agende)

**Issues:**
- [ ] Páginas internas dos demais preços (já era item do ROADMAP — P2)

## /estudio-fotografico-em-mogi-das-cruzes (família: página + /cenarios + /cenarios/[name] + /aluguel)

| Campo | Valor |
|---|---|
| Tipo | estatica + dinamica-d1 (cenários) |
| Funil | consideracao |
| Serviço | aluguel + ensaio |
| Status | incompleta |
| Keyword | "estúdio fotográfico em mogi das cruzes" / aluguel: "aluguel de estúdio fotográfico mogi" |
| No menu | sim ("Estúdio") |

**Propósito:** apresentar o estúdio próprio (diferencial competitivo) e vender o aluguel (serviço nº 2).

**Seções (página):** hero, fundo infinito, ambientes, cenários, **CTA aluguel** (`SectionsStudioRentCta`, L7 ✅ 2026-07-09), depoimentos, localização mapa+painel

**Seções (/aluguel):**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Hero | ok | |
| 2 | Valores | ok | |
| 3 | Cenários | ok | reutiliza o admin (`/api/public/cenarios?slug=estudio`, confirmado); status ativo/inativo por cenário implementado (migration 029, ✅ 2026-07-09) |
| 4 | Parceiros | ok | |
| 5 | Mapa | ok | |

**/cenarios e /cenarios/[name]:** lista via admin. Instância `dia-das-maes-2025` é **semi-órfã** (só linkada de 1 post do blog) — L8: linkar da lista de cenários + posts sazonais (admin/verificar).

**Links de entrada (página):** menu, footer, home (seção estúdio), agende-seu-ensaio (seção estúdio), LPs (bloco map)
**Links de entrada (/aluguel):** hero da home (painel de serviços) — **só 1** → reforçar com L7
**CTAs:** [triagem] revisar CTA de agendamento/aluguel nas 4 rotas da família

## /analise-coloracao-pessoal-em-mogi

| Campo | Valor |
|---|---|
| Tipo | lp (tema coloração) |
| Funil | conversao |
| Serviço | coloracao |
| Status | ok |
| Keyword | "análise de coloração pessoal mogi" |
| No menu | sim ("Coloração Pessoal", desde 2026-07-09) |

**Propósito:** LP do serviço nº 3. Decisão registrada: fica em rota própria — nem filha de `/servicos` (não criar), nem de `/sobre` ([ia-site.md §7](ia-site.md)).

**Links de entrada:** menu, footer, hero da home (painel de serviços), LP dia-das-maes (seção coloração — hoje quebrada, L10)
**Links de saída:** [triagem] mapear blocos
**CTAs:** CTA do bloco da LP — ok

**Issues:**
- [x] Links para a consultoria de imagem: intro (âncora no parágrafo) + botão no cross-sell — feito 2026-07-11 (metade da L14; a LP própria existe desde 2026-07-11, decisão #8 superada)

## /consultoria-de-imagem-em-mogi

| Campo | Valor |
|---|---|
| Tipo | estatica |
| Funil | conversao |
| Serviço | consultoria |
| Status | incompleta (valores fictícios) |
| Keyword | "consultoria de imagem mogi das cruzes" |
| No menu | sim (submenu "Imagem & Estilo", migration 030) |

**Propósito:** página do serviço de consultoria de imagem (decisão #8 superada em 2026-07-11 — racional em [ia-site.md §7](ia-site.md)). Vende a consultoria solo e o combo com coloração.

**Seções:**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Intro (foto circular + voz-lillia) | incompleta | foto reusa a da coloração — trocar quando houver foto própria |
| 2 | Benefícios (4 cards) | ok | |
| 3 | Como funciona | ok | reusa `LandingsHowWorks` |
| 4 | Pacotes (2× `BlocksPricingCard`) | **incompleta** | **valores FICTÍCIOS** (R$ 590 / combo R$ 890) — confirmar oferta real |
| 5 | Para quem é | ok | |
| 6 | Cross-sell (coloração + ensaios) | ok | |
| 7 | FAQ (4 itens + FAQPage JSON-LD) | ok | |
| 8 | CTA final (rose-deep, WhatsApp) | ok | |

**Links de entrada:** menu (submenu Imagem & Estilo, migration 030), LP coloração (intro + cross-sell) — regra dos 2 mínimos ok
**Links de saída:** `/analise-coloracao-pessoal-em-mogi`, `/ensaio-fotografico`, WhatsApp (pacotes + CTA)
**CTAs:** âncora #pacotes no intro; WhatsApp nos pacotes e no CTA final — ok (conversão: sem Tinyform)

**Issues:**
- [ ] **Valores fictícios** — definir oferta/preço reais com a Lillia e atualizar a página (resto da decisão #8)
- [ ] Foto própria da consultoria (hoje reusa a imagem da coloração)
- [ ] Parágrafo com âncora na `/sobre` linkando para cá (outra metade da L14)
- [ ] SEO seed via migration 031 — refinar og_image/score depois via `/admin/seo`

## /ensaio-profissional-em-mogi

| Campo | Valor |
|---|---|
| Tipo | lp (tema azul-marinho) |
| Funil | conversao |
| Serviço | ensaio (corporativo — carro-chefe) |
| Status | ok |
| Keyword | "ensaio profissional mogi" / "ensaio corporativo" |
| No menu | atual: não · flat v2: não (submenu alvo: "Ensaio corporativo") |

**Propósito:** LP de venda do ensaio corporativo; destino planejado das campanhas Google Ads. Domínio `ensaioprofissionalemmogi.com.br` em 301 para cá.

**Seções:**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Hero | ok | |
| 2 | Mini portfolio | ok | |
| 3 | Para quem | ok | keywords: Instagram, advogados... |
| 4 | Como funciona | ok | títulos verdes corrigidos (herança do tema, ✅ 2026-07-09) |
| 5 | Pacotes | ok | |
| 6 | Depoimentos | ok | |
| 7 | CTA | ok | |
| 8 | O estúdio (bloco map das LPs) | ok | |

**Links de entrada:** post "Ensaio para o LinkedIn", domínio 301; após L1/L3: posts PIPA Hub e fotos corporativas
**CTAs:** CTA do bloco — ok (conversão: minimizar fugas)

## /presente-ensaio-fotografico-mogi (hub + filha /dia-das-maes)

| Campo | Valor |
|---|---|
| Tipo | lp (hub tema rosa · filha tema marrom) |
| Funil | conversao |
| Serviço | ensaio (presenteável) |
| Status | incompleta |
| Keyword | "presente ensaio fotográfico mogi" / filha: "presente dia das mães mogi" |
| No menu | não (submenu alvo: "Presenteie um ensaio") |

**Propósito:** hub de ensaios presenteáveis por ocasião — estratégia sazonal permanente (dia das mães hoje; natal, aniversário e dia dos namorados/casais no roadmap).

**Seções (hub):**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Hero | ok | |
| 2 | Lista de presentes | ok | item "Dia das Mães" cadastrado em 2026-07-09 (L9 ✅); próximas ocasiões: Natal, aniversário, casais (P2) |
| 3 | Entregáveis | ok | Vale-Ensaio, Nécessaire+Vale, Álbum, Prints/Quadros |
| 4 | Por que ensaio é o presente perfeito | ok | |
| 5 | CTA | ok | |
| 6 | O estúdio | ok | |

**Seções (filha /dia-das-maes):**
| # | Seção | Status | Observação |
|---|---|---|---|
| 1 | Hero | ok | |
| 2 | Mini portfolio | ok | |
| 3 | Como funciona o ensaio | ok | |
| 4 | Depoimentos | ok | |
| 5 | CTA presenteie | ok | botão verde corrigido (seletor `.btn` no tema, ✅ 2026-07-09) |
| 6 | Ideias de presente | ok | keywords SEO |
| 7 | Coloração pessoal | ok | fallback por campo implementado — bloco vazio agora exibe o conteúdo default (L10 ✅ 2026-07-09) |
| 8 | O estúdio (bloco das LPs) | ok | |
| 9 | CTA para o hub de presentes | ok | backlink correto |

**Links de entrada (hub):** post "Presente de Dia das Mães", filha (CTA backlink)
**Links de entrada (filha):** post "Presente de Dia das Mães"; hub após L9
**Issues:**
- [ ] L9: cadastrar a filha na lista de presentes do hub (admin)
- [ ] Natal presenteável (mesma ideia da filha dia-das-maes) + ocasiões aniversário e casais/dia dos namorados (ROADMAP P2 — hub de presentes)

## /orcamentos/dia-das-maes

| Campo | Valor |
|---|---|
| Tipo | lp |
| Funil | conversao |
| Serviço | ensaio |
| Status | ok |
| No menu | não (no-robots — orçamento direto p/ leads de campanha) |

**Propósito:** orçamento fechado de campanha, fora do índice de busca. Sem exigência de links de entrada (distribuída por link direto).

## /links

| Campo | Valor |
|---|---|
| Tipo | dinamica-d1 (linktree com tracking de cliques) |
| Funil | suporte (distribuição bio Instagram) |
| Status | ok |
| No menu | não (no-robots) |

## Header / Footer (compartilhados)

- **Menu** (`menu_items`, editável em `/admin/menu`): **suporta submenus de 1 nível** desde 2026-07-09 (migration 028 `parent_id`; dropdown acessível no desktop, acordeão no mobile, colunas no footer). **Migration `030_menu_submenus_seed.sql` (2026-07-11) troca a flat v2 pela estrutura aninhada do [ia-site.md §6](ia-site.md)** (5 grupos: Ensaios · Estúdio · Imagem & Estilo · Sobre · CTA Agende) — já aplicada no banco local; produção/preview via `migrate:prod`/`migrate:preview` + purge de cache. Após aplicar, atualizar os campos "No menu" das rotas que entram em submenu (depoimentos, ensaio-profissional, presente hub).
- **Footer**: reusa o MESMO componente/tabela do menu + blocos próprios (logo, social Instagram/Email/WhatsApp, CTA agende, endereço, copyright, `/privacidade-e-termos`). Editar o menu atualiza os dois.

## No-robots (referência)

`/admin/*`, `/area-cliente/*`, `/orcamentos/*`, `/links` — detalhes técnicos em [sitemap.md](sitemap.md). Fora das regras de linking público.

---

## Matriz de links internos faltantes (auditoria jul/2026)

| # | Origem | Destino | Onde inserir | Execução |
|---|---|---|---|---|
| L1 | Post "PIPA Hub" | LP corporativo + `/ensaio-fotografico/corporativo` | CTA existente sem link | ✅ feito 2026-07-09 (admin) |
| L2 | Post "Cartório de Mogi" | interim `/agende-seu-ensaio`; futuro portfolio casal | CTA do post | ✅ interim feito 2026-07-09 (trocar quando portfolio de casal existir) |
| L3 | Post "Fotos corporativas" | portfolio corporativo + LP corporativo | CTA ao fim do conteúdo | ✅ feito 2026-07-09 (admin) |
| L4 | Post "Natal 2025" | portfolios natal 2024/2025 | corpo | admin — **bloqueado**: cadastrar portfolios antes |
| L5 | Post "Dia das mães 2025" | link novo (hoje redirect salva) | corpo | ✅ feito 2026-07-09 (admin) |
| L6 | Posts em geral | seção "ensaios com esse tema" | fim do post | ✅ código religado 2026-07-09 (migration 027) — falta preencher o campo nos posts via admin (P0-E) |
| L7 | Página do estúdio | `/estudio-.../aluguel` | seção/CTA "Alugue o estúdio" | ✅ feito 2026-07-09 (`SectionsStudioRentCta`) |
| L8 | `/estudio-.../cenarios` + posts | cenário `dia-das-maes-2025` (semi-órfão) | lista de cenários + posts sazonais | admin/verificar |
| L9 | LP presentes (hub) | LP filha dia-das-maes | bloco "lista de presentes" | ✅ feito 2026-07-09 (item "Dia das Mães" sem ano — decisão em ia-site.md §7) |
| L10 | LP dia-das-maes (seção coloração) | LP coloração | seção vazia/desconfigurada | ✅ fallback corrigido 2026-07-09 (defaults por campo no bloco coloracao) |
| L11 | menu/footer + hero home | `/sobre` | ✅ item de menu + quick-link "Conheça a Lillia" no hero (2026-07-09) | ✅ completo |
| L12 | `/precos` CTA "FAQ" | `/perguntas-frequentes` (hoje vai pro whats) | destino corrigido; whats virou link secundário | ✅ feito 2026-07-09 (`SectionsGeneralCtaFaq`) |
| L13 | `/blog` | `/blog/[category]` | barra de categorias no índice e na categoria | ✅ feito 2026-07-09 (`SectionsBlogMenuCategories`) |
| L14 | `/sobre` + LP coloração | consultoria de imagem | seções novas | ✅ metade LP coloração feita 2026-07-11 (links diretos para `/consultoria-de-imagem-em-mogi`, que agora existe); resta o parágrafo com âncora na `/sobre` |

## Rastreabilidade da auditoria (nota → destino)

Conferência de que nenhum item das notas brutas se perdeu na absorção. Pode ser apagada quando o P0 fechar.

| Item da nota | Destino |
|---|---|
| [falha] site desorganizado (hierarquia/co-relação) | [ia-site.md](ia-site.md) inteiro (funil, regras, menu) |
| [ideia] temas de LP criados via admin | ROADMAP P3 |
| [dúvida] coloração filha de /servicos ou /sobre | Decisão: rota própria + não criar /servicos ([ia-site.md §7](ia-site.md), ROADMAP decisão #10) |
| [falha] site mal fala de consultoria de imagem | Estratégia 3 tempos ([ia-site.md §7](ia-site.md)) + L14 + ROADMAP decisão #8 |
| [falha] blog sem lista de categorias | L13 → ROADMAP P0-B |
| [falha] categoria com nome do slug | ROADMAP P0-B (categorias do D1) |
| [falha] página de categoria protocolar | ROADMAP P2 (template de categoria) |
| [falha] PIPA Hub CTA não linka | L1 |
| [falha] Cartório CTA sem link | L2 |
| [falha] post presente s/ "ensaios com esse tema" | L6 → ROADMAP P0-D |
| [pendente] natal 2025: inserir portfolios 24/25 | L4 + ROADMAP P0-C (cadastrar portfolios) |
| [falha] fotos corporativas sem CTA | L3 |
| [pendente] post Dia das Mães 2026 (cenário da cama) | ROADMAP P2 (conteúdo sazonal) |
| [falha] dia das mães 2025 com link antigo | L5 |
| [falha] natal 2024 conteúdo pequeno | ROADMAP P2 |
| [falha] "ensaios com esse tema" parou de funcionar | Causa raiz identificada (works/showSchedule) → ROADMAP P0-D |
| (sugestões p/ Google Ads bem-vindas) | ROADMAP P2 Ads (pré-requisitos documentados) |
| [falha] LP corporativo títulos verdes | ROADMAP P0-B |
| [falha] estúdio não linka aluguel | L7 → ROADMAP P0-B |
| [falha] cenário dia-das-maes-2025 semi-morto | L8 |
| [pendente] aluguel: reuso de cenários + status ativo | ROADMAP P0-D (cenários) |
| (FAQ: mais dados pra inserir) | ROADMAP P0-C |
| [pendente] "porque investir" virar componente | ROADMAP P0-D (componentizar) |
| [falha] CTA FAQ linka pro whats | L12 → ROADMAP P0-B |
| [pendente] CTA FAQ virar componente | ROADMAP P0-D (componentizar) |
| [pendente] LP presentes incompleta / natal / aniversário / casais | L9 + ROADMAP P2 (hub de presentes) |
| [pendente] lista de presentes vazia | L9 |
| [falha] seção coloração desconfigurada (LP dia das mães) | L10 |
| [falha] botão presenteie verde | ROADMAP P0-B |
| [falha] seção coloração vazia não cai no default | L10 → ROADMAP P0-B |
| [falha] /sobre órfã + dúvida do hero | L11 + decisão hero ([ia-site.md §7](ia-site.md), ROADMAP decisão #6) |
| (sinto falta de submenus) | [ia-site.md §6](ia-site.md) → ROADMAP P0-D |
| questionamento: chatbot com dados do site | ROADMAP decisão #7 |
| questionamento: quais posts beneficiariam SEO | ROADMAP P2 (posts derivados da IA) |
| questionamento: Google Ads MCP / Meta Ads MCP | ROADMAP P2 Ads (+ Meta) |
| questionamento: error tracking / Sentry | Já era ROADMAP P4 (explicação adicionada) |
| questionamento: form de leads / e-book | ROADMAP decisão #9 |
