# server/ — Backend

Nitro server rodando em Cloudflare Pages Workers. D1 + R2 via bindings.

## Estrutura

```
server/
├── api/
│   ├── public/         # sem auth (cacheável CDN)
│   ├── admin/          # auth: header `x-cms-token` (JWT HS256, 8h)
│   ├── cliente/        # auth: cookie `cliente_session` (JWT HS256, 30d, httpOnly)
│   ├── webhooks/       # callbacks externos (futuro: sumup.ts)
│   └── __sitemap__/    # fonte autoritativa do sitemap.xml
├── services/           # uma classe por domínio (PortfolioService, BlogService, ...)
├── db/
│   ├── schema/         # Drizzle sqlite-core (snake_case + alias camelCase)
│   ├── migrations/     # SQL versionado NNN_descricao.sql
│   └── drizzle/        # snapshots gerados pelo drizzle-kit
├── utils/              # d1-client (getOrm/getDB), auth-helpers, r2-presign, etc.
└── middleware/         # vazio — auth é inline nos handlers
```

## Padrão Service + Handler

Todo endpoint segue o mesmo formato:

```ts
import { defineEventHandler } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { PortfolioService } from '~/server/services/PortfolioService';

export default defineEventHandler(async (event) => {
  // 1. Auth (apenas admin/cliente)
  await validateAdminToken(event);            // OU getAuthenticatedCliente(event)

  // 2. Cache (apenas public)
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');

  // 3. Instancia service
  const svc = new PortfolioService(getOrm(event));

  // 4. Validação Zod (quando recebe body)
  const body = await readBody(event);
  const parsed = LandingPageInputSchema.safeParse(body);
  if (!parsed.success) throw createError({ statusCode: 400, data: parsed.error });

  // 5. Lógica + return
  return svc.list(true);
});
```

**Regra**: services contêm apenas queries Drizzle. Validação, parsing e composição vão no handler.

## D1 + Drizzle

- Binding: `DB` em `wrangler.toml`
- Acesso: `getOrm(event)` retorna `DrizzleD1Database<typeof schema>` tipado; `getDB(event)` retorna o raw binding (para batch/transações)
- Casing: schema declara colunas em `snake_case`; types camelCase via aliases ao final do arquivo de schema
- Migrations: `server/db/migrations/NNN_descricao.sql`, aplicadas via `wrangler d1 execute`. Não usar `drizzle-kit push` em produção.

### Schemas principais

Cada arquivo em `server/db/schema/` modela um domínio. Re-exportados via `server/db/schema/index.ts`. Padrão:

```ts
export const tabela = sqliteTable('tabela', {
  id: integer().primaryKey({ autoIncrement: true }),
  campo: text().notNull(),
  fk_id: integer().references(() => outra.id),
}, (t) => ({
  idx: index('idx_tabela_campo').on(t.campo),
}));

export const tabelaCamel = tabela;  // alias opcional
export type Tabela       = typeof tabela.$inferSelect;
export type TabelaInsert = typeof tabela.$inferInsert;
```

## Auth (JWT HS256, Web Crypto)

### Admin
- Token retornado por `/api/admin/auth/login` → cliente armazena em localStorage
- Enviado em **header** `x-cms-token` em todas as chamadas admin
- Validado por `validateAdminToken(event)` em [server/utils/auth-helpers.ts](utils/auth-helpers.ts)
- Senha armazenada SHA-512 + salt; setup inicial em `/api/admin/auth/setup` protegido por env `KEYCMS`

### Cliente (área de fotos)
- Token em **cookie httpOnly** `cliente_session` (SameSite=Lax, 30d)
- Validado por `getAuthenticatedCliente(event)` → retorna `{ clienteId }`
- Login: `/api/cliente/auth/login`; logout limpa o cookie

**Por que Web Crypto e não jose/jsonwebtoken**: Workers não rodam libs Node-only confiáveis e crypto.subtle é nativo.

## R2 (storage privado — fotos de cliente)

- Binding: `R2` → bucket `fotografa-lillia-ensaios`
- Upload do admin via **presigned URL**: `/api/admin/r2/presign.ts` gera URL PUT assinada com AWS Signature V4 (implementação própria em `utils/r2-presign.ts` usando `crypto.subtle`)
- Cliente faz upload direto para R2 (não passa pelo Worker)
- Download via Worker (`/api/cliente/entregas/[id]/download.ts`) — Worker valida auth + lê do binding + serve ZIP

## Cloudflare Images (CDN público — portfolio, blog, depoimentos, avatares)

- Não usa R2 — usa CF Images
- Upload via `/api/upload.ts` (multipart → CF Images API com `CLOUDFLARE_API_KEY` em env)
- ID armazenado em colunas `cf_image_id` ou similar (`foto_cf_id`, `imagem_cf_id`)
- URL pública: `https://images.fotografalilliatavares.com.br/images/{id}/{variant}` (variants: `public`, `thumbnail`, etc.)
- Listagem admin: `/api/cf-images.ts` consulta API da Cloudflare

## Services existentes

| Service | Domínio |
|---|---|
| `PortfolioService` | works + fotos do portfolio + flags ativo/home |
| `BlogService` | posts + categorias |
| `DepoimentoService` | depoimentos (table separada de portfolio_works.depoimento_*) |
| `CategoriasService` | categorias de portfolio e blog |
| `CenarioService` | páginas de cenários do estúdio |
| `FaqService` | FAQs por categoria |
| `PageFaqService` | composição de FAQs em página |
| `PageSeoService` | meta tags por entidade (lp/blog/portfolio/static) |
| `LandingPageService` | LPs dinâmicas + blocos (valida com Zod antes de persistir) |
| `ProdutoService` | pacotes/preços (CTA, pacotes, preço por parcela) |
| `ClienteService` | clientes (sem hash de senha na listagem) |
| `SessaoService` | sessões fotográficas, fotos, lotes de seleção |
| `EntregaService` | entregas finalizadas (ZIP) |
| `MenuService` | menu de navegação |
| `HeroBannerService` | hero banners por página |
| `NotificacaoService` | Web Push (futuro) |
| `AdminUserService` | usuários admin |

## Convenções de endpoint

- **Public GET**: cacheável, sem auth, retorna lista/detalhe
- **Admin CRUD**: `GET /api/admin/X` (lista), `GET /api/admin/X/[id]`, `POST /api/admin/X`, `PUT /api/admin/X/[id]`, `DELETE /api/admin/X/[id]`
- **Cliente**: nunca expõe dados de outros clientes — sempre filtra por `clienteId` do JWT
- **Erros**: usar `createError({ statusCode, statusMessage, data })` do h3

## Variáveis de ambiente / bindings (wrangler.toml)

| Nome | Tipo | Uso |
|---|---|---|
| `DB` | D1 binding | banco principal |
| `R2` | R2 binding | bucket fotos cliente |
| `JWT_SECRET` | secret | assinar tokens admin e cliente |
| `KEYCMS` | secret | proteger `/admin/auth/setup` |
| `CLOUDFLARE_API_KEY` | secret | upload CF Images |
| `CLOUDFLARE_ACCOUNT_ID` | var | conta CF Images |
| `R2_ACCOUNT_ID` | var | presign R2 |
| `R2_ACCESS_KEY_ID` | secret | presign R2 |
| `R2_SECRET_ACCESS_KEY` | secret | presign R2 |
| `R2_BUCKET_NAME` | var | nome do bucket |

## SumUp (futuro)

Plano de integração quando o gateway for adicionado:

```
server/
├── api/
│   ├── public/checkout/
│   │   ├── create.ts            # cria sessão SumUp, retorna URL de pagamento
│   │   └── status/[id].ts       # consulta status (opcional, usar webhook)
│   └── webhooks/
│       └── sumup.ts             # callback, valida HMAC, atualiza ProdutoPedido
├── services/
│   └── PagamentoService.ts      # encapsula chamadas à API SumUp + persistência
└── db/
    └── schema/
        └── pagamentos.ts        # tabela pedidos: id, produto_id, cliente_id?, status, sumup_checkout_id, sumup_transaction_id, valor_cents, created_at
```

Pontos de atenção:
- Validar webhook por assinatura (HMAC) — nunca confiar só no `transaction_id`
- Idempotência: chave `sumup_checkout_id` UNIQUE na tabela
- Reconciliação periódica via cron (Cloudflare Triggers) consultando status SumUp para pedidos `pending` > 1h
- Secrets em wrangler: `SUMUP_API_KEY`, `SUMUP_WEBHOOK_SECRET`, `SUMUP_MERCHANT_CODE`
- Não armazenar dados de cartão nem PAN — SumUp Checkout cuida disso
