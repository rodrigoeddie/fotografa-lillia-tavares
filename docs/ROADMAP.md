# ROADMAP.md — Futuro do projeto

> **Última atualização:** 2026-07-01
> To-dos priorizados por frente. O estado atual que justifica cada item está em [PROJETO.md](PROJETO.md). Consolida e substitui as anotações soltas do `TODO.md` da raiz.
>
> **Prioridades:** P0 = bloqueia a fase atual · P1 = risco real (legal/segurança) · P2 = cresce o negócio · P3 = qualidade/produto · P4 = higiene técnica.

---

## P0 — Go-live dos pagamentos SumUp (fase atual)

Código pronto e revisado; falta operação. Ordem sugerida:

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

## P1 — LGPD e segurança ✅ (executado em 2026-07-01 — ver [seguranca-lgpd.md](seguranca-lgpd.md))

### LGPD
- [x] **Bloquear scripts por consentimento** — GA4 só carrega após opt-in (`useCookieConsent` + `plugins/third-party.client.ts`); revogação limpa cookies e recarrega; Pixel/Smartlook já ficam condicionados quando forem reativados.
- [x] **Exclusão de dados (direito ao esquecimento):** `DELETE /api/admin/clientes/[id]` apaga toda a cadeia — D1 + fotos (CF Images) + ZIPs (R2) — via `LgpdService.wipeCliente()`.
- [x] Atualizar política de privacidade: SumUp, Cloudflare, logs, fotos de sessão, botão "Gerenciar cookies", eliminação definitiva.
- [x] Registrar consentimento no D1 (tabela `consentimentos`, migration 026 aplicada em produção; `POST /api/public/consent`).
- [ ] **Automatizar retenção de 5 anos** (fotos + dados) — implementação depende da decisão de negócio (Decisões pendentes #2). Exclusão sob demanda já funciona.

### Segurança
- [x] **Security headers** — X-Frame-Options/nosniff/Referrer-Policy já existiam nas routeRules; **CSP completa adicionada** (allowlist GA4, fonts, R2, embeds). ⚠️ Novo serviço externo exige atualizar a CSP no `nuxt.config.ts`.
- [x] **Rate limiting** — KV `RATE_LIMIT` criado e vinculado; aplicado em cms-login e login cliente (10/10min/IP), webhook SumUp (60/min/IP) e consent (20/10min/IP).
- [x] Senha do cliente: novo formato PBKDF2 (`pbkdf2$salt$hash`); hashes SHA-512 legados aceitos e re-hashados no primeiro login; anti-enumeração por timing no login cliente.
- [x] Separar D1 de preview: banco `fotografa-lillia-preview` criado com todas as migrations; `env.preview` não escreve mais em produção (banco novo começa sem conteúdo — restaurar backup se precisar de dados).

## P2 — SEO e marketing orgânico (crescimento)

Ênfase: venda de ensaios em Mogi das Cruzes e região (Alto Tietê).

### SEO técnico
- [ ] **LocalBusiness/ProfessionalService completo** (endereço, telefone, horários, geo, `areaServed`) — verificar o `jsonld_data` de `/` e `/estudio` e expor em todas as páginas relevantes. Maior alavanca de SEO local pendente.
- [ ] **OG image por página** (`og_image_cf_id` no `/admin/seo`) — começar pelas páginas de dinheiro: home, preços, LPs, portfolio top.
- [ ] Varredura de SEO on-page (title, description, copy, imagem de share) com foco em "ensaio fotográfico em Mogi das Cruzes" — item 5 do TODO antigo.
- [ ] Automatizar o audit SEO (preencher `score`/`last_issues` via cron ou ao salvar) em vez do audit manual emulado.
- [ ] Atualizar `docs/sitemap.md` (rotas faltantes: aluguel, cenários internos, orçamentos).

### Conteúdo / funil (do TODO antigo, ainda válido)
- [ ] **Hub de presentes** `/presente-ensaio-fotografico-mogi`: por que ensaio é presente, ocasiões (Dia das Mães → link; aniversário e casais → futuro), produtos entregáveis (vale-ensaio físico); backlink da página de Dia das Mães para o hub.
- [ ] Post no blog para links internos promovendo a LP de presentes/dia das mães.
- [ ] Páginas internas dos demais preços (`/precos-ensaios-fotograficos/[slug]` faltantes).
- [ ] Página de aluguel do estúdio (existe rota; revisar conteúdo/SEO).
- [ ] LP de análise de coloração pessoal como sub-produto (e futura consultoria de imagem).
- [ ] Atualizar produtos no Google Business Profile (+ campanhas sazonais: dia das mães, natal, namorados).

### Ads (quando o orgânico + pagamentos estiverem rodando)
- [ ] Avaliar Google Ads API via MCP/CLI para gestão de campanhas assistida por agente. Pré-requisitos antes de gastar: conversões mensuráveis (GA4 pós-consentimento + eventos de checkout/WhatsApp) e LPs de campanha prontas. Sem tracking de conversão, ads é dinheiro às cegas — resolver o item de consentimento (P1) primeiro.

## P3 — Produto, UX e redesigns

- [x] **Aplicar os 5 redesigns escolhidos** ([escolhas-redesign.md](escolhas-redesign.md)) — **feito**. Portados para Vue/SCSS conforme frontend-standards (sem BEM, rem, reuso de `_objects`, novos tokens em `_variables`, Lato-only, AA, `prefers-reduced-motion`):
    - **Hero home** → `SectionsHomeHero` (díptico texto + painel sage + foto; nav global mantida por decisão do Rodrigo).
    - **Portfolio masonry** → foto pura + legenda **hover-reveal** (não overlay pesado) + barra de categorias.
    - **CTA contato** (`Tinyform`) → split-screen P4, acento pela cor do ensaio (`--color-highlight`).
    - **Estúdio** → hero, fundo infinito (cards de cor real + foto), ambientes, depoimentos (`SectionsGeneralTestimonials`), e **localização mapa+painel** (novo `SectionsStudioLocation`; `StudioMap` intacto p/ aluguel/agende).
    - **Footer** → P3 split assimétrico (menu data-driven e temas de LP preservados).
- [ ] **Completar notificações:** admin consome a lista (badge + painel), notificar admin quando cliente finaliza seleção, notificar cliente em mudança de status, marcar como lida no cliente, prazo de seleção com aviso próximo do vencimento.
- [ ] Melhorias do fluxo de sessão anotadas no TODO antigo: botão "cadastrar entrega" quando sessão está "Seleção concluída" sem entrega; nome do ZIP `Ensaio-{produto}-{cliente}`; bug do card em meus-ensaios que não reflete status "entregue"; bug da URL `/admin/entregas/save/{id}` carregando entrega errada — **retestar antes de corrigir** (podem já ter sido resolvidos).
- [ ] Acessibilidade: ARIA no menu mobile (aria-expanded/controls), auditar lightbox (foco, ESC, role), formulário de agendamento (labels/erros), contraste dos temas de LP, fallback para alt vazio.
- [ ] LPs com modo rascunho/preview antes de publicar.
- [ ] Admin: busca/filtro nas listas grandes, modal de confirmação de delete, `datetime-local` no prazo de seleção.

## P4 — Operacional e higiene técnica

- [ ] **Error tracking** (Sentry ou similar) no server + client — hoje ninguém sabe quando algo quebra em produção.
- [ ] **Backup automático do D1** (cron trigger diário usando o `db-backup.ts` existente) + teste de restore documentado.
- [ ] **E-mail transacional** (Cloudflare Email Service ou Resend): confirmação de pagamento, entrega pronta, aviso de prazo de seleção — Web Push sozinho não alcança quem não deu permissão.
- [ ] Medir Core Web Vitals reais (RUM ou Cloudflare Web Analytics) em vez do audit emulado.
- [ ] Type safety no admin: eliminar `any`, interfaces compartilhadas, Zod nos domínios sem validação (clientes, menu, linktree, entregas).
- [ ] README real (setup Cloudflare, env vars, migrations, deploy) substituindo o boilerplate.
- [ ] Higiene de git: commits descritivos (`feat:`/`fix:`/...) em vez de "Working..."; CHANGELOG.md a partir de agora.
- [ ] Limpar `TODO.md` da raiz (conteúdo absorvido aqui) e arquivar scripts obsoletos em `scripts/`.

---

## Decisões pendentes (só o Rodrigo/Lillia podem tomar)

1. **Entrega × pagamento:** entrega liberada independente do pagamento online? (P0)
2. **Retenção de fotos:** confirmar os 5 anos da política e autorizar a limpeza automática (a exclusão sob demanda já existe). (P1)
3. ~~Rate limiting: KV ou DO?~~ **Resolvido:** KV `RATE_LIMIT` criado e em uso (2026-07-01).
4. **Prazo/ordem dos redesigns** e se entram antes ou depois da temporada de campanhas. (P3)
5. **Ads:** verba e momento de entrada; Google Ads primeiro ou Meta? (P2)

## Ritual de gestão sugerido

- **Ao fechar qualquer item:** marcar aqui e, se mudar o estado de uma frente, refletir em [PROJETO.md](PROJETO.md).
- **Mensal (~30 min):** revisar semáforos do PROJETO.md, repriorizar P2/P3 conforme campanhas sazonais (dia das mães, natal...), conferir se docs/sitemap.md acompanha rotas novas.
- **Antes de cada campanha:** checklist mínimo — LP pronta com SEO/OG preenchidos no `/admin/seo`, GBP atualizado, post de blog interligando, purge de cache.
