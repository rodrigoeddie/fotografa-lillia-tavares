# PROJETO.md — Mapa de Controle do Projeto

> **Última atualização:** 2026-07-01
> Documento de gestão: estado real de cada frente do projeto, com riscos e lacunas. O futuro (to-dos priorizados) está em [ROADMAP.md](ROADMAP.md). A arquitetura está em [../CLAUDE.md](../CLAUDE.md).
>
> **Como manter:** ao fechar um item do ROADMAP ou mudar de fase, atualize a seção correspondente aqui e a data acima. Este documento só é útil se refletir a realidade.

## Visão executiva

Site institucional + CMS admin + área do cliente da **Fotógrafa Lillia Tavares** (ensaios fotográficos em Mogi das Cruzes / Alto Tietê). Projeto com ~3 anos, 434 commits, hoje em **Nuxt 4 + Cloudflare** (Pages, D1, R2, CF Images), Drizzle ORM, JWT próprio.

**Momento atual:** o sistema de pagamentos SumUp na seleção de fotos está **codificado e revisado em segurança (jun/2026), mas não está em produção** — os bloqueios são operacionais (secrets, migration, webhook), não de código. Ver §3.

| Frente | Estado | Maior risco/lacuna |
|---|---|---|
| 1. Front público + SEO | 🟢 Sólido | Falta LocalBusiness schema; audit SEO não automatizado |
| 2. Admin CMS | 🟢 Funcional | Notificações não consumidas; sem tela de pagamentos |
| 3. Área do cliente + Pagamentos | 🟡 Código pronto, go-live pendente | Secrets/migration/webhook não configurados em produção |
| 4. Dados (D1/Drizzle) | 🟢 Concluído | Backup manual, sem rotina |
| 5. Segurança | 🟢 Resolvido (P1 jul/2026) | Falta 2FA e log de auditoria (nice-to-have) |
| 6. LGPD | 🟢 Conforme (P1 jul/2026) | Falta só automatizar retenção de 5 anos (decisão pendente) |
| 7. Acessibilidade & Performance | 🟡 Boa base | Menu mobile/lightbox sem ARIA auditado; contraste não auditado |
| 8. Redesigns | 🟡 Escolhidos, não aplicados | 5 protótipos selecionados, 0 implementados |
| 9. Operacional | 🔴 Frágil | Sem monitoramento de erros, sem e-mail transacional, backup manual |
| 10. Marketing & conteúdo | 🟡 Em expansão | Hub de presentes, blog de links internos, GBP desatualizado |

---

## 1. Front público + SEO

**Estado:** a frente mais madura do projeto.

- **Páginas:** home, sobre, depoimentos, FAQ, agendamento, privacidade, portfolio (`/ensaio-fotografico/[cat]/[slug]`), blog (`/blog/[cat]/[slug]`), preços (+ internas por slug), estúdio (+ aluguel + cenários), linktree, e 5 LPs dinâmicas por blocos JSON: `presentes`, `dia-das-maes`, `corporativo` (com domínio ensaioprofissionalemmogi.com.br em 301), `analise-coloracao`, `orcamentos/dia-das-maes`.
- **SEO centralizado:** tabela polimórfica `page_seo` (title, description, og image, canonical, jsonld, score de audit) editável em `/admin/seo`, aplicada via `usePageSeo()` SSR-safe. Módulos `@nuxtjs/seo` + `nuxt-schema-org`.
- **JSON-LD implementado:** Person (identity global), WebSite, BreadcrumbList, BlogPosting, ImageObject/ItemPage (portfolio), FAQPage. LocalBusiness populado em `jsonld_data` para `/` e `/estudio` (verificar se ativo).
- **sitemap.xml** dinâmico ([server/api/__sitemap__/urls.ts](../server/api/__sitemap__/urls.ts)) lendo LPs/blog/portfolio do D1; **robots.txt** auto-gerado com noindex em `/admin`, `/area-cliente`, `/links`.

**Lacunas:**
- OG image é default genérica na maioria das páginas (`og_image_cf_id` raramente preenchido) — item antigo do TODO ("custom og-share para cada página").
- Campos de audit SEO (`score`, `last_issues`, `last_audited_at`) existem mas não são populados automaticamente; o audit em `/admin/seo/audit` é emulado no cliente, não mede Core Web Vitals reais.
- `docs/sitemap.md` está parcialmente defasado (faltam `/estudio.../aluguel`, `/estudio.../cenarios/[name]`, `/orcamentos/dia-das-maes`).
- LPs publicam direto (`ativo=1`), sem modo rascunho/preview.
- `v-html` em títulos de blog — sanitização do conteúdo depende do admin ser confiável (aceitável hoje, registrar como risco).

## 2. Admin CMS

**Estado:** funcional e consistente. 17 domínios com CRUD (portfolio, blog, depoimentos, sessões, clientes, entregas, produtos/pacotes, LPs com 14 tipos de bloco, FAQ, page-faq, menu, linktree, cenários, hero banners, SEO, cache purge, usuários). Padrão `useXxxForm()` + `useAdminFetch()` em todos.

- **Auth:** login PBKDF2-SHA256 (100k iterações, resistente a timing/enumeração), JWT HS256 8h em header `x-cms-token`.
- **RBAC server-side** ([server/middleware/admin-rbac.ts](../server/middleware/admin-rbac.ts)): `super_admin` (tudo, único que gerencia usuários), `editor` (conteúdo), `sessions` (clientes/sessões/entregas/produtos).
- **Fluxo de sessão:** criar sessão → upload fotos com watermark (CF Images) → cliente seleciona (lotes) → entrega ZIP (R2 presigned) → notifica cliente via Web Push + DB.

**Lacunas:**
- **Sem tela de pagamentos** — admin não vê status pago/pendente/combinado de nenhum lote.
- **Notificações pela metade:** tabela + service + push existem; disparam ao criar sessão/entrega, mas o admin não consome a lista (só toast local), cliente não marca como lida, e mudança de status de sessão não notifica.
- Validação Zod só em depoimentos e LPs; `any` espalhado; menu/linktree salvam JSON sem schema.
- Listas sem busca/paginação; deletes com `confirm()` nativo; sem log de auditoria (quem apagou o quê); `prazo_selecao` é input de texto livre.

## 3. Área do cliente + Pagamentos (fase atual)

**Estado do fluxo cliente:** completo — login (cookie httpOnly `cliente_session`, JWT 30d) → meus-ensaios → seleção com autosave e comentários por foto → checkout → entrega (ZIP via presigned URL R2, 24h).

**Regras de negócio do pagamento (implementadas):**
- Lote 1: `total = fotos extras + valor_restante_pacote` (campo editável no admin da sessão). Lotes 2+: só extras.
- Desconto progressivo de 5% a cada 5 fotos extras. Valor **sempre recalculado no servidor**.
- Pagamento **opcional**: botão "Combinar com a Lillia" ao lado do "Pagar agora".
- Parcelas vêm do pacote (`pacotes.num_parcelas`).

**Segurança (revisada jun/2026, [pagamentos-seguranca.md](pagamentos-seguranca.md)):** webhook HMAC fail-closed, status `pago` terminal, verificação de amount+currency na confirmação, `sumup_checkout_id` UNIQUE, nenhum dado de cartão passa pelo servidor.

**🔴 Bloqueios de go-live (nenhum é de código):**
1. Secrets no Cloudflare Pages: `SUMUP_API_KEY`, `SUMUP_WEBHOOK_SECRET`, `SUMUP_MERCHANT_CODE`, `SITE_URL`.
2. Migration em produção: `wrangler d1 execute DB --remote --file=server/db/migrations/023_pagamentos.sql`.
3. Cadastrar webhook no painel SumUp: `https://fotografalilliatavares.com.br/api/webhooks/sumup`.
4. Validar em sandbox: unidade/moeda do `amount` na resposta SumUp e o esquema exato do HMAC (header `X-Signature`, SHA-256 do corpo cru) — o código assume ambos.

**Pendências não bloqueantes:** idempotência do POST de checkout por lote (2 cliques = 2 checkouts), badge de status de pagamento em meus-ensaios, tela `/admin/pagamentos`, regra explícita de liberação de entrega vs pagamento, senha do cliente em SHA-512 simples (admin usa PBKDF2).

## 4. Dados

- **26 tabelas** D1 com schema Drizzle completo em `server/db/schema/`; **migração para Drizzle concluída** (19+ services usando `getOrm()`). 26 migrations, última `026_consentimentos.sql`.
- **Produção em paridade com o repositório desde 2026-07-01** (aplicadas 023 pagamentos, 024/025 linktree, 026 consentimentos, com backup prévio). Exceção: a migration **019 é obsoleta** — `portfolio_works.depoimento_id` nunca entrou no schema Drizzle nem é usada pelo código (o vínculo é `depoimentos.portfolio_link`); não foi aplicada em produção de propósito.
- **Controle de migrations (desde 2026-07-01):** tabela `d1_migrations` (padrão do wrangler) em produção e preview, com backfill das 001–026. Fluxo: `bun run migrate:status` → `bun run migrate:prod` → `bun run migrate:preview`. Arquivos numerados manualmente com 3 dígitos (`027_...`). Ver [../server/CLAUDE.md](../server/CLAUDE.md).
- Domínios: auth (admin_users, clientes), sessões (sessoes, sessao_fotos, selecao_lotes, selecoes, entregas, pagamentos), conteúdo (portfolio, blog, depoimentos, faq, categorias), LP/SEO (landing_pages, lp_blocks, page_seo), produtos/pacotes, menu, linktree, notificações/push.
- Backup: scripts `db-backup.ts`/`db-restore.ts` existem, **execução manual** — último backup em `scripts/backups/` é de 21/mai/2026.

## 5. Segurança

> Detalhes operacionais em [seguranca-lgpd.md](seguranca-lgpd.md).

**Resolvido (revisões de 2026 + P1 jul/2026):** JWT admin/cliente com secrets separados e expiração; RBAC server-side; endpoints `fs/*`, `upload` e `cf-images` exigem token; upload com whitelist de MIME + limite 15 MB; login legado SHA1 removido; default de role fail-closed (`editor`); R2 com CORS restrito e presigned URLs; nenhum secret commitado; **rate limiting por IP via KV** (logins, webhook, consent); **CSP completa** + X-Frame-Options/nosniff/Referrer-Policy/Permissions-Policy; **senha do cliente em PBKDF2** (legado SHA-512 re-hashado no login); **preview com D1 separado** do de produção.

**Pendente (menor):** 2FA para super_admin; log de auditoria de ações do admin. ⚠️ Regra operacional: ativar novo serviço externo exige atualizar a CSP no `nuxt.config.ts`.

## 6. LGPD

> Detalhes operacionais em [seguranca-lgpd.md](seguranca-lgpd.md).

**Conforme desde o P1 (jul/2026):**
- **Consentimento real:** nenhum script não-essencial carrega antes do opt-in (GA4 condicionado; Pixel/Smartlook já condicionados quando reativarem). Revogação limpa cookies e recarrega. Banner reabrível pela página de privacidade.
- **Trilha de auditoria:** cada escolha registrada no D1 (`consentimentos`, via `POST /api/public/consent`).
- **Direito ao esquecimento:** exclusão de cliente no admin apaga toda a cadeia — D1 + fotos (CF Images) + ZIPs (R2) — via `LgpdService`.
- **Política de privacidade atualizada:** SumUp como operador, Cloudflare/logs, fotos de sessão, eliminação definitiva, botão "Gerenciar cookies".

**Pendente:** automatizar a retenção de 5 anos (hoje a exclusão é sob demanda) — depende de decisão de negócio.

## 7. Acessibilidade & Performance

**Bom:** skip-to-content, `<main>`/landmarks, breadcrumb com `aria-label` + `aria-current` + JSON-LD, alt dinâmico nas imagens, `loading="lazy"`, CF Images com webp/srcset responsivo, chunks separados para GSAP (~100 KB) e Swiper, cache CDN `s-maxage=86400` nos endpoints públicos.

**Não auditado / lacunas:** menu mobile (aria-expanded/controls), lightbox `vue-easy-lightbox` (role=dialog, teclado), formulários de agendamento, contraste WCAG nos temas de LP, alt vazio quando não preenchido no admin, Core Web Vitals reais nunca medidos em produção.

## 8. Redesigns

5 protótipos escolhidos em [escolhas-redesign.md](escolhas-redesign.md) (30/jun): hero (`p1-v9-nav-cta` n3), footer (agente-c proposta 3), portfolio (`masonry-v2` proposta 4), CTA contato (agente-a proposta 4), estúdio (`curadoria-refinada`). **Nenhum foi aplicado** — os componentes reais em `components/sections/` seguem as versões antigas. Sem plano de implementação/ordem.

## 9. Operacional

- **Deploy:** Cloudflare Pages via `bun run build`; preview compartilha o mesmo D1 de produção (⚠️ risco de escrita acidental).
- **Sem monitoramento:** nenhum error tracking (Sentry etc.), sem alertas, sem métricas de Web Vitals.
- **Sem e-mail transacional:** nenhum provider configurado; toda comunicação é Web Push + UI. Cliente não recebe confirmação de pagamento/entrega por e-mail.
- **Backup manual** (§4). Histórico git com 83% dos commits "Working..." — sem rastreabilidade de mudanças; sem CHANGELOG.

## 10. Marketing & conteúdo

- **Norte:** venda de ensaios fotográficos em Mogi das Cruzes e Alto Tietê (orgânico como canal principal hoje).
- **Ativos:** LPs de campanha (dia das mães, corporativo com domínio próprio 301, coloração pessoal), linktree com tracking de cliques, depoimentos (70+), blog.
- **Em construção (do TODO):** hub de presentes `/presente-ensaio-fotografico-mogi` (páginas-filhas por ocasião, interligação com dia das mães), post de blog para links internos, páginas internas dos demais preços, página de aluguel do estúdio, produtos no Google Business Profile desatualizados.
- **Ads:** nada implementado; intenção declarada de avaliar CLI/MCP do Google Ads (ver ROADMAP).

## Documentação — índice e saúde

| Doc | Cobre | Estado |
|---|---|---|
| [../CLAUDE.md](../CLAUDE.md) | Arquitetura geral | 🟢 Atualizado |
| [../server/CLAUDE.md](../server/CLAUDE.md) | Backend, D1, JWT, R2 | 🟢 Atualizado |
| [../shared/CLAUDE.md](../shared/CLAUDE.md) | Schemas Zod | 🟢 Atualizado |
| [data-flow.md](data-flow.md) | D1→service→API→adapter→componente | 🟢 Atualizado |
| [frontend-standards.md](frontend-standards.md) | SCSS/componentes | 🟢 Atualizado |
| [pagamentos-seguranca.md](pagamentos-seguranca.md) | Revisão SumUp | 🟢 Atualizado |
| [sitemap.md](sitemap.md) | Mapa de rotas | 🟡 Parcialmente defasado |
| [escolhas-redesign.md](escolhas-redesign.md) | Redesigns escolhidos | 🟡 Só a lista, sem plano |
| ../README.md | Setup | 🔴 Boilerplate Nuxt genérico |
| **PROJETO.md** (este) | Estado por frente | criado 2026-07-01 |
| [ROADMAP.md](ROADMAP.md) | To-dos priorizados | criado 2026-07-01 |
