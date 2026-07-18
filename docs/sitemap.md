# Sitemap — Páginas e Relacionamentos

Mapa de todas as rotas e quais APIs/services alimentam cada uma. Fonte autoritativa do sitemap XML está em `server/api/__sitemap__/urls.ts`.

> **Papéis dos docs:** plumbing técnico rota→API → **este doc** · estado editorial por página (seções, links, issues) → [paginas.md](paginas.md) · estratégia de IA (funil, linking, CTAs, menu) → [ia-site.md](ia-site.md).

## Público

| Rota | Propósito | Dados |
|---|---|---|
| `/` | Home (hero, portfolio destaque, depoimentos) | `usePageSeo('static','/')` + `/api/public/portfolio?home=1` |
| `/sobre-fotografa-lillia-tavares` | Bio | estática |
| `/depoimentos` | Galeria de testemunhos | `/api/public/depoimentos` (DepoimentoService) |
| `/perguntas-frequentes` | FAQ geral | `/api/public/faq` (FaqService) |
| `/agende-seu-ensaio` | Formulário + mapa | estática |
| ~~`/consultoria-de-imagem-em-mogi`~~ | **DESATIVADA (jul/2026)** — retorna 404, fora do menu/sitemap; volta no futuro (ver docs/paginas.md) | estática (`.vue` mantido) |
| `/privacidade-e-termos` | Políticas | estática |
| `/links` | Linktree (bio Instagram, tracking de cliques) — `noindex` | `/api/public/linktree` |

### Portfolio

| Rota | Dados |
|---|---|
| `/ensaio-fotografico` | índice de categorias — `/api/public/portfolio?home=1` (PortfolioService) |
| `/ensaio-fotografico/[category]` | lista por categoria — `/api/public/portfolio?categoria=...` |
| `/ensaio-fotografico/[category]/[slug]` | detalhe + galeria — `/api/public/portfolio/[work]` |

### Blog

| Rota | Dados |
|---|---|
| `/blog` | índice + categorias — `/api/public/blog` (BlogService) |
| `/blog/[category]` | filtra por categoria |
| `/blog/[category]/[slug]` | post + JSON-LD BlogPosting |

### Preços & Estúdio

| Rota | Dados |
|---|---|
| `/precos-ensaios-fotograficos` | catálogo — `/api/public/investimento` (ProdutoService) |
| `/precos-ensaios-fotograficos/[slug]` | pacote específico |
| `/estudio-fotografico-em-mogi-das-cruzes` | apresentação do estúdio |
| `/estudio-fotografico-em-mogi-das-cruzes/aluguel` | aluguel do estúdio (valores, cenários, parceiros, mapa) |
| `/estudio-fotografico-em-mogi-das-cruzes/cenarios` | listagem — `/api/public/cenarios` (CenarioService) |
| `/estudio-fotografico-em-mogi-das-cruzes/cenarios/[name]` | cenário específico |

### Landing Pages dinâmicas (D1)

Rotas geradas a partir da tabela `landing_pages` (ativo=1). Cada LP tem slug + array de blocos JSON. Renderizadas por `BlockRenderer`.

| Slug atual | Tema |
|---|---|
| `/analise-coloracao-pessoal-em-mogi` | coloração |
| `/ensaio-profissional-em-mogi` | corporativo |
| `/presente-ensaio-fotografico-mogi` | presente |
| `/presente-ensaio-fotografico-mogi/dia-das-maes` | presente / dia das mães |
| `/orcamentos/dia-das-maes` | orçamento dia das mães |

Layout: `lp.vue`. Classe tema: `lp-<slug>` (ex: `lp-presentes`, `lp-dia-das-maes`).

## Admin (`/admin/*`)

Layout: `admin.vue`. Auth: header `x-cms-token` (JWT). `robots: noindex, nofollow`.

**Conteúdo**: `/admin/portfolio`, `/admin/portfolio/categorias`, `/admin/blog`, `/admin/blog/categorias`, `/admin/depoimentos`, `/admin/investimento`, `/admin/faq`, `/admin/hero-banners`, `/admin/landing-pages`, `/admin/menu`, `/admin/page-faq`

**Operação**: `/admin/clientes`, `/admin/sessoes` (→ `/[id]/fotos`, `/[id]/selecao`, `/[id]/lotes`), `/admin/entregas`, `/admin/cenarios`

**Sistema**: `/admin/seo` (audit + page-seo + static-pages), `/admin/cache` (purge CF)

Convenção de rotas CRUD: `/admin/X` (lista) → `/admin/X/save/[[id]]` (create/edit, mesmo arquivo).

## Área do Cliente (`/area-cliente/*`)

Layout: `cliente.vue`. Auth: cookie `cliente_session` (JWT httpOnly). Middleware: `cliente-auth.ts`. SSR ativo, `robots: noindex`.

| Rota | Propósito |
|---|---|
| `/area-cliente` | login (form in-place) |
| `/area-cliente/meus-ensaios` | lista de sessões — `/api/cliente/sessoes` |
| `/area-cliente/selecao/[id]` | cliente seleciona fotos — `/api/cliente/sessoes/[id]/selecao` |
| `/area-cliente/entrega/[id]` | download ZIP — `/api/cliente/entregas/[id]` |

## Diagrama hierárquico

```
/
├── Público (cacheável CDN)
│   ├── /sobre-fotografa-lillia-tavares
│   ├── /depoimentos
│   ├── /perguntas-frequentes
│   ├── /agende-seu-ensaio
│   ├── /ensaio-fotografico/[category]/[slug]
│   ├── /blog/[category]/[slug]
│   ├── /precos-ensaios-fotograficos/[slug]
│   ├── /estudio-fotografico-em-mogi-das-cruzes
│   │   ├── /aluguel
│   │   └── /cenarios/[name]
│   ├── /links               ← linktree (noindex)
│   └── /<slug-lp>           ← dinâmico via D1 (BlockRenderer)
│
├── /admin/*                 ← layout admin, JWT header
│   ├── conteúdo (portfolio, blog, depoimentos, LP, menu, ...)
│   ├── operação (clientes, sessões, entregas, cenários)
│   └── sistema (SEO, cache)
│
└── /area-cliente/*          ← layout cliente, JWT cookie
    ├── /meus-ensaios
    ├── /selecao/[id]
    └── /entrega/[id]
```

## Fluxos cruzados importantes

- **Cliente recebe sessão**: admin cria sessão (`/admin/sessoes/save`) → upload fotos (`/admin/sessoes/[id]/fotos`, R2) → cliente loga (`/area-cliente`) → seleciona (`/area-cliente/selecao/[id]`) → admin aprova/finaliza (`/admin/entregas`) → cliente baixa (`/area-cliente/entrega/[id]`)
- **LP → conversão**: LPs dinâmicas linkam para `/agende-seu-ensaio` ou contato direto via WhatsApp (CTA configurado no bloco)
- **SEO**: meta tags vêm de `page_seo` (table), consultadas via `usePageSeo()`, sobrescrevíveis no admin em `/admin/seo`
