// Tipos compartilhados entre client e server.
//
// Os tipos das tabelas (Cliente, Sessao, BlogPost, etc.) já são auto-importados
// pelo Nuxt a partir de `server/utils/d1-client.ts` (que re-exporta de
// `server/db/schema/*`). Para evitar duplicação no auto-import, este arquivo
// apenas concentra os schemas Zod customizados (LP blocks discriminated union
// e SEO polimórfico) que não vêm direto do Drizzle.

export * from '../schemas/landing-page';
export * from '../schemas/seo';
