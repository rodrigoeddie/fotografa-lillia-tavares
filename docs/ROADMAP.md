# ROADMAP.md — Futuro do projeto

> **Última atualização:** 2026-07-09
> To-dos priorizados por frente. O estado atual que justifica cada item está em [PROJETO.md](PROJETO.md). Consolida e substitui as anotações soltas do `TODO.md` da raiz e a auditoria de páginas de jul/2026 (absorvida em [ia-site.md](ia-site.md) + [paginas.md](paginas.md)).
>
> **Prioridades:** P0 = fase atual · P1 = próxima fase · P2 = cresce o negócio · P3 = qualidade/produto · P4 = higiene técnica.

---

## P0 — Arquitetura de informação e navegação (fase atual)

> Origem: auditoria manual página a página de jul/2026. **Estratégia e regras:** [ia-site.md](ia-site.md) · **Estado por página + matriz de links L1–L14:** [paginas.md](paginas.md).

### A. Documentação
- [x] Criar [ia-site.md](ia-site.md) (funil, regras de linking, estratégia de CTA, spec do menu) + [paginas.md](paginas.md) (registro por rota); atualizar sitemap.md, CLAUDE.md e PROJETO.md; deletar `organizacao-das-paginas.md` com rastreabilidade 100% — **feito em 2026-07-09**.

### B. Quick-wins de código (bugs da auditoria)
- [ ] **Categorias de blog/portfolio lidas do D1** (`blog_categorias.titulo`/`portfolio_categorias.titulo`) em vez dos mapas hardcoded `BLOG_CATEGORIAS`/`PORTFOLIO_CATEGORIAS` em `composables/useD1Adapters.ts` — categorias novas param de aparecer como slug cru.
- [ ] `/blog`: lista de categorias no índice (L13).
- [ ] LP corporativo: títulos de "como funciona" verdes no tema azul-marinho.
- [ ] LP dia-das-maes: botão do CTA "presenteie" verde, fora do tema marrom + seção coloração vazia não cai no conteúdo default (bug do fallback, L10).
- [ ] `/precos`: CTA "FAQ" aponta pro WhatsApp — corrigir para `/perguntas-frequentes` (L12).
- [ ] Página do estúdio: seção/CTA linkando `/estudio-.../aluguel` (L7 — **link de dinheiro nº 2**).
- [ ] Hero home: quick-link "Conheça a Lillia" → `/sobre` (CTA primário permanece `/agende-seu-ensaio`; L11).

### C. Conteúdo e links via admin (sem dev) — detalhes em [paginas.md](paginas.md)
- [ ] **Menu flat v2** via `/admin/menu` (spec em [ia-site.md §5](ia-site.md)): Trabalhos→Ensaios, +Coloração Pessoal, +Sobre, CTA→`/agende-seu-ensaio`, remover Home; purge de cache; conferir header E footer (mesma tabela).
- [ ] Executar matriz de links **L1–L5, L8, L9, L14** (CTAs dos posts, lista de presentes do hub, cenário semi-órfão, âncoras de consultoria).
- [ ] Cadastrar portfolios **Natal 2024/2025** (desbloqueia L4, prepara campanha Natal 2026).
- [ ] Seção "consultoria de imagem" na LP de coloração + parágrafo com âncora na `/sobre`.
- [ ] FAQ: inserir os dados pendentes.

### D. Features de navegação (dev)
- [ ] **Submenus**: migration `parent_id` em `menu_items` + `MenuEditor.vue` com aninhamento (1 nível) + `Menu.vue` dropdown acessível (aria-expanded/controls, teclado) + acordeão mobile + footer em colunas — spec em [ia-site.md §6](ia-site.md).
- [ ] **Religar "ensaios com esse tema" + Tinyform do post** (L6): colunas `works`/`show_schedule` na `blog_posts` (migration), persistir nos handlers admin (`server/api/admin/blog/index.ts` e `[id].ts` descartam os campos hoje), expor no `adaptBlogPost` — resquício da migração Nuxt Content→D1; o editor já tem os campos.
- [ ] Cenários: status ativo/inativo no admin + confirmar reuso na página de aluguel.
- [ ] Componentizar "porque investir em fotografia" e "CTA FAQ" (seções repetidas — candidatas conforme regra dos 3+ usos).

## P1 — Go-live dos pagamentos SumUp (próxima fase; era P0)

> Código pronto e revisado; falta operação — **não tem dependência técnica com o P0** e pode rodar em paralelo se houver banda. Ordem sugerida:

- [ ] **Sandbox primeiro:** criar checkout de teste e confirmar (a) unidade/moeda do `amount` na resposta (código assume reais + BRL) e (b) esquema do HMAC do webhook (header `X-Signature`, HMAC-SHA256 do corpo cru). São as duas suposições não validadas do código.
- [ ] Configurar secrets no Cloudflare Pages: `SUMUP_API_KEY`, `SUMUP_WEBHOOK_SECRET`, `SUMUP_MERCHANT_CODE`, `SITE_URL=https://fotografalilliatavares.com.br`.
- [x] Rodar migration em produção — **feito em 2026-07-01** (023 + 024/025 linktree + 026 consentimentos; backup prévio em `scripts/backups/backup-prod-2026-07-01.sql`). Produção agora está em paridade com o repositório (exceto a 019, obsoleta — ver nota no arquivo).
- [ ] Cadastrar webhook no painel SumUp: `https://fotografalilliatavares.com.br/api/webhooks/sumup`.
- [ ] Teste ponta a ponta em produção com valor baixo (cartão + pix), conferindo confirmação via webhook E via página de retorno.
- [ ] **Idempotência do checkout:** antes de criar checkout, reusar pagamento `pendente` recente do mesmo lote (evita duplicatas ao clicar 2x).
- [ ] **Definir e documentar a regra entrega × pagamento** (decisão de negócio da Lillia): entrega é liberada independente de pagamento? Registrar em `pagamentos-seguranca.md`.

### Fechamento do produto de pagamentos (logo após go-live)
- [ ] Tela `/admin/pagamentos` (ou coluna em `/admin/sessoes`): status por lote — pago / pendente / "combinar com Lillia".
- [ ] Badge de status de pagamento no card de `area-cliente/meus-ensaios` (cliente que volta da SumUp precisa ver que pagou).
- [ ] Histórico de lotes visível para o cliente dentro de cada sessão.

## P2 — SEO e marketing orgânico (crescimento)

Ênfase: venda de ensaios em Mogi das Cruzes e região (Alto Tietê).

### SEO técnico
- [ ] **LocalBusiness/ProfessionalService completo** (endereço, telefone, horários, geo, `areaServed`) — verificar o `jsonld_data` de `/` e `/estudio-fotografico-em-mogi-das-cruzes` e expor em todas as páginas relevantes. Maior alavanca de SEO local pendente.
- [ ] **OG image por página** (`og_image_cf_id` no `/admin/seo`) — começar pelas páginas de dinheiro: home, preços, LPs, portfolio top.
- [ ] Varredura de SEO on-page (title, description, copy, imagem de share) com foco em "ensaio fotográfico em Mogi das Cruzes" — validar também as keywords propostas em [paginas.md](paginas.md).
- [ ] Automatizar o audit SEO (preencher `score`/`last_issues` via cron ou ao salvar) em vez do audit manual emulado.
- [x] Atualizar `docs/sitemap.md` (rotas faltantes: aluguel, cenários internos, orçamentos, links) — **feito em 2026-07-09** (movido para o P0-A).

### Conteúdo / funil
- [ ] **Hub de presentes** `/presente-ensaio-fotografico-mogi`: ocasiões além do Dia das Mães — **Natal presenteável** (próximo passo), aniversário, casais/dia dos namorados; produtos entregáveis (vale-ensaio físico). Backlinks hub ↔ filhas (L9 do P0 resolve o atual).
- [ ] **Posts SEO derivados da IA** (priorizar por serviço: ensaio > aluguel > coloração): "aluguel de estúdio fotográfico em Mogi", "quanto custa um ensaio fotográfico", "análise de coloração pessoal: o que é", "presente de dia dos namorados: ensaio de casal", post Dia das Mães 2026 (referenciar o cenário da cama). Cada post segue a regra de linking de [ia-site.md §3](ia-site.md).
- [ ] Post no blog para links internos promovendo a LP de presentes/dia das mães.
- [ ] Melhorar template das páginas de categoria do blog (hoje "protocolares") — usar `blog_categorias.descricao`.
- [ ] Post Natal 2024: expandir conteúdo (muito curto).
- [ ] Páginas internas dos demais preços (`/precos-ensaios-fotograficos/[slug]` faltantes).
- [ ] Página de aluguel do estúdio: revisar conteúdo/SEO (a rota existe; links de entrada resolvidos no P0 — L7).
- [ ] LP de consultoria de imagem quando houver oferta definida (decisão #8).
- [ ] Atualizar produtos no Google Business Profile (+ campanhas sazonais: dia das mães, natal, namorados).

### Ads (quando o orgânico + pagamentos estiverem rodando)
- [ ] Avaliar Google Ads e Meta Ads API via MCP/CLI para gestão de campanhas assistida por agente. Pré-requisitos antes de gastar: conversões mensuráveis (GA4 pós-consentimento + eventos de checkout/WhatsApp) e LPs de campanha prontas (a LP corporativa `/ensaio-profissional-em-mogi` é a candidata nº 1). Sem tracking de conversão, ads é dinheiro às cegas.

## P3 — Produto, UX e redesigns

- [x] **Aplicar os 5 redesigns escolhidos** ([escolhas-redesign.md](escolhas-redesign.md)) — **feito**. Portados para Vue/SCSS conforme frontend-standards (sem BEM, rem, reuso de `_objects`, novos tokens em `_variables`, Lato-only, AA, `prefers-reduced-motion`):
    - **Hero home** → `SectionsHomeHero` (díptico texto + painel sage + foto; nav global mantida por decisão do Rodrigo).
    - **Portfolio masonry** → foto pura + legenda **hover-reveal** (não overlay pesado) + barra de categorias.
    - **CTA contato** (`Tinyform`) → split-screen P4, acento pela cor do ensaio (`--color-highlight`).
    - **Estúdio** → hero, fundo infinito (cards de cor real + foto), ambientes, depoimentos (`SectionsGeneralTestimonials`), e **localização mapa+painel** (novo `SectionsStudioLocation`; `StudioMap` intacto p/ aluguel/agende).
    - **Footer** → P3 split assimétrico (menu data-driven e temas de LP preservados).
- [ ] **Completar notificações:** admin consome a lista (badge + painel), notificar admin quando cliente finaliza seleção, notificar cliente em mudança de status, marcar como lida no cliente, prazo de seleção com aviso próximo do vencimento.
- [ ] Melhorias do fluxo de sessão anotadas no TODO antigo: botão "cadastrar entrega" quando sessão está "Seleção concluída" sem entrega; nome do ZIP `Ensaio-{produto}-{cliente}`; bug do card em meus-ensaios que não reflete status "entregue"; bug da URL `/admin/entregas/save/{id}` carregando entrega errada — **retestar antes de corrigir** (podem já ter sido resolvidos).
- [ ] Acessibilidade: ARIA no menu mobile (aria-expanded/controls — o item de submenus do P0-D já cobre parte), auditar lightbox (foco, ESC, role), formulário de agendamento (labels/erros), contraste dos temas de LP, fallback para alt vazio.
- [ ] LPs com modo rascunho/preview antes de publicar.
- [ ] Temas de LP configuráveis via admin (hoje só cores via CSS) — ideia da auditoria de jul/2026.
- [ ] Admin: busca/filtro nas listas grandes, modal de confirmação de delete, `datetime-local` no prazo de seleção.

## P4 — Operacional e higiene técnica

- [ ] **Error tracking** (Sentry ou similar) no server + client — serviço que captura exceções em produção e avisa (e-mail/painel) com stack trace; hoje ninguém sabe quando algo quebra. Pesquisar Sentry vs alternativas leves (ex: Cloudflare Workers Analytics + logpush).
- [ ] **Backup automático do D1** (cron trigger diário usando o `db-backup.ts` existente) + teste de restore documentado.
- [ ] **E-mail transacional** (Cloudflare Email Service ou Resend): confirmação de pagamento, entrega pronta, aviso de prazo de seleção — Web Push sozinho não alcança quem não deu permissão. (Também é pré-requisito do lead magnet — decisão #9.)
- [ ] Medir Core Web Vitals reais (RUM ou Cloudflare Web Analytics) em vez do audit emulado.
- [ ] Type safety no admin: eliminar `any`, interfaces compartilhadas, Zod nos domínios sem validação (clientes, menu, linktree, entregas).
- [ ] README real (setup Cloudflare, env vars, migrations, deploy) substituindo o boilerplate.
- [ ] Higiene de git: commits descritivos (`feat:`/`fix:`/...) em vez de "Working..."; CHANGELOG.md a partir de agora.
- [ ] Limpar `TODO.md` da raiz (conteúdo absorvido aqui) e arquivar scripts obsoletos em `scripts/`.

---

## Decisões pendentes (só o Rodrigo/Lillia podem tomar)

1. **Entrega × pagamento:** entrega liberada independente do pagamento online? (P1)
2. **Retenção de fotos:** confirmar os 5 anos da política e autorizar a limpeza automática (a exclusão sob demanda já existe).
3. ~~Rate limiting: KV ou DO?~~ **Resolvido:** KV `RATE_LIMIT` criado e em uso (2026-07-01).
4. ~~Prazo/ordem dos redesigns~~ **Resolvido:** os 5 redesigns foram aplicados (jul/2026).
5. **Ads:** verba e momento de entrada; Google Ads primeiro ou Meta? (P2)
6. ~~Hero da home: trocar CTA por /sobre?~~ **Resolvido (2026-07-09):** mantém `/agende-seu-ensaio` como CTA primário; `/sobre` exposta via menu + quick-link (racional em [ia-site.md §7](ia-site.md)).
7. **Chatbot de atendimento** com os dados do site: vale o custo/manutenção agora? (backlog — reavaliar depois do P0/P1)
8. **Consultoria de imagem:** definir oferta/preço para justificar LP própria (até lá: seção na LP de coloração + âncora na /sobre).
9. **Lead magnet (e-book + form de e-mail marketing):** pré-requisito técnico é o e-mail transacional (P4); decidir tema do e-book e ferramenta de disparo.
10. ~~Criar rota /servicos?~~ **Resolvido (2026-07-09): não criar** — racional em [ia-site.md §7](ia-site.md).

## Concluído

### P1 — LGPD e segurança ✅ (executado em 2026-07-01 — ver [seguranca-lgpd.md](seguranca-lgpd.md))

#### LGPD
- [x] **Bloquear scripts por consentimento** — GA4 só carrega após opt-in (`useCookieConsent` + `plugins/third-party.client.ts`); revogação limpa cookies e recarrega; Pixel/Smartlook já ficam condicionados quando forem reativados.
- [x] **Exclusão de dados (direito ao esquecimento):** `DELETE /api/admin/clientes/[id]` apaga toda a cadeia — D1 + fotos (CF Images) + ZIPs (R2) — via `LgpdService.wipeCliente()`.
- [x] Atualizar política de privacidade: SumUp, Cloudflare, logs, fotos de sessão, botão "Gerenciar cookies", eliminação definitiva.
- [x] Registrar consentimento no D1 (tabela `consentimentos`, migration 026 aplicada em produção; `POST /api/public/consent`).
- [ ] **Automatizar retenção de 5 anos** (fotos + dados) — implementação depende da decisão de negócio (decisão #2). Exclusão sob demanda já funciona.

#### Segurança
- [x] **Security headers** — X-Frame-Options/nosniff/Referrer-Policy já existiam nas routeRules; **CSP completa adicionada** (allowlist GA4, fonts, R2, embeds). ⚠️ Novo serviço externo exige atualizar a CSP no `nuxt.config.ts`.
- [x] **Rate limiting** — KV `RATE_LIMIT` criado e vinculado; aplicado em cms-login e login cliente (10/10min/IP), webhook SumUp (60/min/IP) e consent (20/10min/IP).
- [x] Senha do cliente: novo formato PBKDF2 (`pbkdf2$salt$hash`); hashes SHA-512 legados aceitos e re-hashados no primeiro login; anti-enumeração por timing no login cliente.
- [x] Separar D1 de preview: banco `fotografa-lillia-preview` criado com todas as migrations; `env.preview` não escreve mais em produção (banco novo começa sem conteúdo — restaurar backup se precisar de dados).

## Ritual de gestão sugerido

- **Ao fechar qualquer item:** marcar aqui e, se mudar o estado de uma frente, refletir em [PROJETO.md](PROJETO.md). Se o item alterar seções/links/CTAs de uma página, atualizar também [paginas.md](paginas.md).
- **Ao criar rota nova:** criar a seção correspondente em [paginas.md](paginas.md) (com links de entrada planejados — mínimo 2) e conferir as regras de [ia-site.md](ia-site.md).
- **Mensal (~30 min):** revisar semáforos do PROJETO.md, repriorizar P2/P3 conforme campanhas sazonais (dia das mães, natal...), conferir se docs/sitemap.md acompanha rotas novas.
- **Antes de cada campanha:** checklist mínimo — LP pronta com SEO/OG preenchidos no `/admin/seo`, GBP atualizado, post de blog interligando (regras de linking de [ia-site.md §3](ia-site.md)), purge de cache.
