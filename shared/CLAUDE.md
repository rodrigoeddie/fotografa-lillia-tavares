# shared/ — Tipos e schemas compartilhados server ↔ client

Pasta acessível tanto pelo Nitro server quanto pelo Vue client. Importar via `~/shared/...`.

## Estrutura

```
shared/
├── schemas/            # Zod schemas (única fonte de verdade para JSONs validados)
│   ├── landing-page.ts # blocos de LP (discriminated union)
│   └── seo.ts          # PageSeo polimórfico por entity_type
└── types/
    └── entities.ts     # re-exports de tipos inferidos via z.infer
```

## Quando usar Zod (e quando não)

**Use Zod** para validar **JSON polimórfico armazenado em colunas `text`** do D1:

- `lp_blocks.dados` (text) → validado pelo `BlockSchema` antes de persistir
- `page_seo.metadata` (text) → validado pelo `PageSeoUpsertSchema`

**Não use Zod** para validar linhas inteiras de tabelas — para isso, use os tipos `$inferSelect` do Drizzle. Drizzle e Zod aqui são complementares, não redundantes.

## Padrão

```ts
// shared/schemas/landing-page.ts
import { z } from 'zod';

export const HeroBlockSchema = z.object({
  type: z.literal('hero'),
  title: z.string(),
  // ...
});

export const BlockSchema = z.discriminatedUnion('type', [
  HeroBlockSchema,
  ForWhoBlockSchema,
  // ...
]);

export const LandingPageInputSchema = z.object({
  slug: z.string(),
  blocks: z.array(BlockSchema),
});

export type LpBlock = z.infer<typeof BlockSchema>;
export type LpBlockType = LpBlock['type'];
```

**Regra**: todo type exportado vem de `z.infer<>` — nunca declarar interface paralela ao schema.

## Schemas atuais

| Arquivo | Conteúdo |
|---|---|
| `landing-page.ts` | 14 tipos de bloco: `hero`, `heroPresentes`, `forWho`, `howWorks`, `prices`, `testimonials`, `ctaContact`, `map`, `portfolioGrid`, `giftGrid`, `coloracao`, `deliverables`, `hubBacklink`, `faq`. Discriminated union em `BlockSchema`. |
| `seo.ts` | `PageSeoUpsertSchema` polimórfico por `entity_type` (`lp` / `blog` / `portfolio` / `static`). Inclui OpenGraph, JSON-LD, keywords. |

## Uso

### No server (validação)
```ts
const parsed = LandingPageInputSchema.safeParse(body);
if (!parsed.success) throw createError({ statusCode: 400, data: parsed.error });
await svc.upsert(parsed.data);
```

### No client (tipo apenas)
```ts
import type { LpBlock } from '~/shared/schemas/landing-page';
const block: LpBlock = props.block;  // sem .parse() — validação foi no server
```

Forms admin **não** revalidam com Zod no client — confiamos na validação server-side. Se quiser feedback inline, o composable `useXxxForm()` faz checagens manuais (ex: required, length).

## Adicionar um novo bloco de LP

1. Criar schema em `shared/schemas/landing-page.ts` e adicionar ao `discriminatedUnion`
2. Criar componente em `components/landings/<Nome>.vue`
3. Registrar no mapa do `BlockRenderer.vue` (`components/landings/BlockRenderer.vue`)
4. Criar editor admin em `components/admin/landing-pages/blocks/<Nome>Editor.vue`
5. Registrar no `BlockEditor.vue` do admin
