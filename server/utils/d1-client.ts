import { createError, type H3Event } from 'h3';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export type ORM = DrizzleD1Database<typeof schema>;

/**
 * Retorna o D1Database raw do binding `DB` no contexto Cloudflare.
 *
 * @deprecated Prefira `getOrm(event)` (Drizzle ORM). Este export sobrevive
 * apenas durante a transição em que parte dos services ainda usa SQL raw.
 */
export function getDB(event: H3Event): D1Database {
  const cf = (event.context as any).cloudflare;
  const db = cf?.env?.DB;
  if (!db) {
    throw createError({ statusCode: 500, statusMessage: 'D1 binding DB não disponível' });
  }
  return db as D1Database;
}

/**
 * Retorna um cliente Drizzle ORM tipado, com todas as tabelas declaradas em
 * `server/db/schema/` injetadas no `schema` do Drizzle. Use este em toda a
 * camada nova de services (`server/services/`).
 */
export function getOrm(event: H3Event): ORM {
  return drizzle(getDB(event), { schema });
}

// Re-exporta utilitários legacy de query (server/utils/db/*) durante a
// transição. Estes serão removidos quando todos os endpoints estiverem
// consumindo services baseados em Drizzle.
export * from './db/index';
