# Fotógrafa Lillia Tavares — Guia de Arquitetura

Site institucional + admin CMS + área do cliente para sessões fotográficas. Deploy em Cloudflare Pages.

## Stack

- **Nuxt 4** (estrutura legacy no root: `pages/`, `components/`, etc. — sem `app/`)
- **Cloudflare**: Pages (host), D1 (banco SQLite), R2 (storage de fotos cliente), Cloudflare Images (CDN público)
- **Drizzle ORM** (sqlite-core) + migrations SQL versionadas
- **Zod** para validar JSON polimórfico (blocos LP, SEO)
- **JWT HS256** (Web Crypto API, sem libs) para auth admin + cliente
- **GSAP + ScrollTrigger** para animações declarativas (`data-ani-type`)
- **Swiper Element** para sliders
- **SCSS** com namespaces `v.` (variáveis) e `m.` (mixins/breakpoints)

## Documentos relacionados

- [server/CLAUDE.md](server/CLAUDE.md) — Backend: API, services, D1, JWT, R2, futuro SumUp
- [shared/CLAUDE.md](shared/CLAUDE.md) — Schemas Zod compartilhados
- [docs/sitemap.md](docs/sitemap.md) — Mapa de páginas (público + admin + cliente)
- [docs/data-flow.md](docs/data-flow.md) — Fluxo D1 → service → API → adapter → componente

## Organização do repositório

```
/
├── pages/              # rotas (públicas, /admin, /area-cliente, LP dinâmicas)
├── components/
│   ├── admin/          # editors CRUD + form controls (RouteSelect, etc.)
│   ├── sections/       # seções por tema (home/, portfolio/, blog/, faq/, ...)
│   ├── blocks/         # blocos atômicos reutilizáveis (Breadcrumb, FaqItem, ...)
│   ├── landings/       # blocos de LP dinâmica + BlockRenderer
│   ├── content/        # Prose customizados do Nuxt Content
│   └── templates/      # Menu, Footer, CookieConsent
├── composables/
│   ├── admin/          # auto-imported via imports.dirs (useAdminAuth, useAdminFetch)
│   └── ...             # useD1Adapters, useClientAuth, useScrollAnimations, etc.
├── layouts/            # default, admin, cliente, lp, emptyLayout
├── middleware/         # cliente-auth (route middleware Nuxt)
├── server/             # ver server/CLAUDE.md
├── shared/             # ver shared/CLAUDE.md
├── assets/styles/      # _variables, _mixins, _reset, _fonts, _objects
├── public/             # estáticos
├── content/            # Nuxt Content (markdown)
└── docs/               # sitemap.md, data-flow.md
```

## Convenções fundamentais

### Naming
- **DB (D1)**: `snake_case` em tabelas e colunas (`portfolio_works`, `depoimento_texto`)
- **Types TS**: `PascalCase` exportados via `$inferSelect` (`PortfolioWork`)
- **Services**: `PascalCase` + sufixo `Service` (`PortfolioService`)
- **Components**: `PascalCase` com hierarquia refletindo a pasta (`SectionsHomeHero`, `AdminBlogEditor`, `LandingsBlockRenderer`)

### Componentes
- Pasta determina o namespace: `components/sections/home/Hero.vue` → `<SectionsHomeHero />`
- Editors admin sempre em `components/admin/<dominio>Editor.vue`
- Blocos de LP em `components/landings/<TipoBloco>.vue` (renderizados via `BlockRenderer`)

### SCSS
- Todo arquivo já tem `v.$...` (cores, espaçamentos rem) e `m.max(sm)` / `m.min(md)` (breakpoints) auto-injetados
- Breakpoints: `xs:600`, `sm:900`, `md:1024`, `lg:1280`, `xlg:1600`
- Unidade preferida: `rem` (1rem = 16px) — não usar `px` em dimensões
- Temas de LP via classe na raiz da página (`.lp-corporativo`, `.lp-dia-das-maes`, `.lp-presentes`)

### Animações
- Declarativo: adicione `data-ani-type="fade-up"` (ou `fade`, `zoom-in`, `blur-in`, `polaroid`, etc.) no elemento
- Batch/stagger: `data-ani-batch="grupo"` + `data-ani-stagger="0.07"` + `data-ani-batch-max="3"`
- Composable: `useScrollAnimations()` instala os tweens GSAP automaticamente

### Auto-imports
- `imports.dirs: ['composables/admin']` no `nuxt.config.ts` → composables admin são auto-importados como os do root
- Components com prefixo pelo path (Nuxt padrão)

## Padrões reutilizáveis

### 1. Adapter pattern (D1 → Vue)
Toda entidade do D1 passa por um adapter em [composables/useD1Adapters.ts](composables/useD1Adapters.ts) antes de chegar nos componentes. Renomeia colunas snake_case para campos camelCase esperados pelos componentes e injeta defaults.

```ts
// API retorna { titulo, descricao, cor_destaque, depoimento_texto, ... }
// Adapter expõe { title, description, colorHighlight, testimonial: {...}, ... }
```

### 2. Composable de form admin
Cada entidade tem `useXxxForm()` que encapsula estado reativo + validação + submit. Padrão em `composables/admin/`.

### 3. BlockRenderer (LP dinâmica)
LPs são montadas por blocos JSON validados via Zod ([shared/schemas/landing-page.ts](shared/schemas/landing-page.ts)). `BlockRenderer.vue` mapeia `block.type` → componente de `components/landings/` via `resolveComponent()`.

### 4. SEO centralizado
- Páginas estáticas: `usePageSeo('static', '/rota')`
- LP: `useLandingPage(slug)` fetch + aplica SEO sincronamente (antes de `await`, SSR-safe)
- Tudo lê de `page_seo` table (PageSeoService)

### 5. Cache CDN
Endpoints públicos setam `Cache-Control: s-maxage=86400, stale-while-revalidate=3600`. Admin tem `/admin/cache` que faz purge via CF API.

## Áreas funcionais

- **Público**: home, portfolio (`/ensaio-fotografico/[cat]/[slug]`), blog, depoimentos, preços, FAQ, agendamento, LPs dinâmicas
- **Admin** (`/admin/*`, JWT em header `x-cms-token`): CRUD completo de portfolio/blog/depoimentos/sessões/clientes/LP/menu/SEO/cache
- **Área do cliente** (`/area-cliente/*`, JWT em cookie `cliente_session`): cliente vê sessões, seleciona fotos, baixa entrega ZIP
- **Futuro — Pagamentos SumUp**: gateway será integrado em `server/api/public/checkout/*` + `server/services/PagamentoService.ts`. Webhooks em `server/api/webhooks/sumup.ts`. Ver [server/CLAUDE.md](server/CLAUDE.md#sumup-futuro).

## Comandos comuns

```bash
bun install                          # deps
bun run dev                          # nuxt dev
bun run build                        # build cloudflare-pages
bun run lint                         # se configurado
wrangler d1 execute DB --remote ...  # rodar SQL em produção
```

## Onde procurar primeiro

| Quero... | Vou em... |
|---|---|
| Adicionar/editar uma página pública | `pages/*.vue` |
| Criar/editar um bloco de LP | `components/landings/` + schema em `shared/schemas/landing-page.ts` |
| Mudar um endpoint público | `server/api/public/<dominio>/*.ts` |
| Mudar lógica de DB | `server/services/<Dominio>Service.ts` |
| Adicionar coluna em tabela | `server/db/schema/<arquivo>.ts` + nova migration em `server/db/migrations/` |
| Editar formulário do admin | `components/admin/<Dominio>Editor.vue` + `composables/admin/use<Dominio>Form.ts` |
| Adicionar nova animação ao scroll | usar `data-ani-type` já existente; novos tipos em `composables/useScrollAnimations.ts` |
