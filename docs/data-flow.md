# Fluxo de Dados — D1 → Component

Padrão consistente em todo o projeto: dado **sempre** atravessa as mesmas 4 camadas.

## Fluxo padrão (leitura pública)

```
D1 (snake_case)
   ↓ Drizzle (server/db/schema)
Service (server/services/XxxService.ts)
   ↓ classe injetada com getOrm(event)
API handler (server/api/public/xxx/*.ts)
   ↓ cache-control, sem auth
useFetch('/api/public/xxx') no client
   ↓ resposta crua, snake_case
Adapter (composables/useD1Adapters.ts → adaptXxx)
   ↓ rename + defaults + composição
Component recebe props em camelCase
```

**Por que adapter?** Componentes Vue foram escritos esperando shape camelCase (`title`, `colorHighlight`, `testimonial.rating`). O D1 retorna snake_case (`titulo`, `cor_destaque`, `depoimento_rating`). O adapter é o único lugar onde os dois mundos se encontram — não renomear colunas no DB, não renomear props nos componentes.

## Exemplo: detalhe de ensaio

```ts
// 1. Página: pages/ensaio-fotografico/[category]/[slug].vue
const { data: raw } = await useFetch(`/api/public/portfolio/${slug}`);
const work = computed(() => adaptPortfolioWork(raw.value));

// 2. Service: server/services/PortfolioService.ts
async getBySlug(slug: string) {
  const [row] = await this.db.select().from(portfolio_works).where(eq(portfolio_works.slug, slug));
  return row ?? null;
}

// 3. Endpoint: server/api/public/portfolio/[work].ts
const w = await svc.getBySlug(slug);
return { ...w, fotos: await svc.listFotosByWork(w.id) };

// 4. Adapter: composables/useD1Adapters.ts
export function adaptPortfolioWork(w: any) {
  return {
    ...w,
    title: w.titulo,
    colorHighlight: w.cor_destaque ?? '#000000',
    testimonial: w.depoimento_texto ? {
      text: w.depoimento_texto,
      rating: w.depoimento_rating ?? 5,
      // ...
    } : null,
  };
}
```

## Fluxo de escrita (admin)

```
Form admin (components/admin/XxxEditor.vue)
   ↓ useXxxForm() (composables/admin/)
useAdminFetch.put('/api/admin/xxx/:id', body)
   ↓ header x-cms-token
API handler admin
   ↓ validateAdminToken(event)
   ↓ Zod.safeParse(body) se JSON polimórfico
Service.update(id, data)
   ↓ Drizzle update
D1
```

Após sucesso: invalidação de cache em `/admin/cache` (manual, via botão) ou auto-purge se configurado.

## Fluxo cliente (área de fotos)

```
Login: POST /api/cliente/auth/login
  → set-cookie cliente_session (httpOnly, 30d)

Toda chamada subsequente: $fetch('/api/cliente/...')
  → cookie enviado automaticamente
  → handler chama getAuthenticatedCliente(event) → { clienteId }
  → service filtra pelo clienteId (nunca expõe dados de outros clientes)
```

## Upload de imagem

### Pública (portfolio, blog, depoimentos) — Cloudflare Images
```
admin upload
  → POST /api/upload.ts (multipart)
  → Worker repassa para CF Images API
  → recebe { id, variants }
  → admin salva id em coluna cf_image_id da entidade
URL pública: https://images.fotografalilliatavares.com.br/images/{id}/public
```

### Privada (fotos de cliente) — R2
```
admin pede URL: GET /api/admin/r2/presign?key=...
  → Worker assina (AWS Sig V4, crypto.subtle)
  → retorna presigned PUT URL
admin PUT direto no R2 (não passa pelo Worker)
  → upload concluído, salva key na tabela sessao_fotos.r2_key

cliente baixa: GET /api/cliente/entregas/[id]/download
  → Worker valida auth (cookie JWT)
  → lê do R2 binding
  → stream ZIP de volta
```

## Quando NÃO usar adapter

- Endpoints admin retornam dados crus (a UI admin entende snake_case e os types Drizzle são usados direto)
- Forms admin enviam exatamente o shape Drizzle (camelCase só nos types)
- Adapter é apenas para a fronteira **D1 → componentes públicos**

## Cache

| Camada | Estratégia |
|---|---|
| Endpoint público | `Cache-Control: s-maxage=86400, stale-while-revalidate=3600` — CDN Cloudflare cacheia 24h |
| Imagens (CF Images) | cache nativo do CF Images, controlado por variant |
| Pages SSR | Nuxt + Cloudflare Pages default (verifica `nuxt.config.ts`) |
| Admin | nunca cacheia (auth header impede CDN) |
| Invalidação manual | `/admin/cache` → POST `/api/admin/cache/purge` |

## Validação de JSON polimórfico

Tabelas com colunas `text` que armazenam JSON validado por Zod:

| Tabela.coluna | Schema |
|---|---|
| `lp_blocks.dados` | `BlockSchema` (discriminated union 14 tipos) |
| `page_seo.metadata` | `PageSeoUpsertSchema` (discriminated union por entity_type) |

**Sempre validar no write**, **nunca no read** (se foi escrito válido, lê válido). Read converte com `JSON.parse()` e cast para o tipo `z.infer<>`.
