import { createError, type H3Event } from 'h3';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export type ORM = DrizzleD1Database<typeof schema>;

/** Acesso ao binding D1 raw — necessário apenas para Drizzle e casos especiais (transações fora do ORM). Endpoints devem usar `getOrm`. */
export function getDB(event: H3Event): D1Database {
  const cf = (event.context as any).cloudflare;
  const db = cf?.env?.DB;
  if (!db) {
    throw createError({ statusCode: 500, statusMessage: 'D1 binding DB não disponível' });
  }
  return db as D1Database;
}

/** Cliente Drizzle ORM tipado, com todas as tabelas declaradas em `server/db/schema/`. */
export function getOrm(event: H3Event): ORM {
  return drizzle(getDB(event), { schema });
}

// Re-exports de tipos legados (Cliente, Sessao, BlogPost, etc.) que vêm dos schemas Drizzle.
// Mantidos aqui para compatibilidade com imports espalhados (ex: `import { Sessao } from '~/server/utils/d1-client'`).
export type {
  Cliente,
  Sessao, SessaoFoto,
  SelecaoLote, Selecao,
  Entrega, EntregaPortfolioFoto,
  Produto, Pacote,
  Depoimento,
  FaqCategoria, FaqPergunta,
  BlogPost,
  PortfolioWork, PortfolioFoto,
  CenarioPagina, Cenario,
  MenuItem,
  AdminUser,
  Notificacao, PushSubscription,
  LandingPage, LpBlockRow,
  PageSeo,
} from '../db/schema';
