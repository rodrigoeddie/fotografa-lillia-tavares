import { createError, type H3Event } from 'h3';

export function getDB(event: H3Event): D1Database {
  const cf = (event.context as any).cloudflare;
  const db = cf?.env?.DB;
  if (!db) {
    throw createError({ statusCode: 500, statusMessage: 'D1 binding DB não disponível' });
  }
  return db as D1Database;
}

// Re-exporta todos os módulos de domínio agrupados em server/utils/db/
export * from './db/index';
