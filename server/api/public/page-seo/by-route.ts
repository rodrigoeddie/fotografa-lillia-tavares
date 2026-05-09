import { defineEventHandler, getQuery, createError } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { PageSeoService } from '~/server/services/PageSeoService';

/**
 * GET /api/public/page-seo/by-route?route=/sobre-fotografa-lillia-tavares
 * Retorna SEO de uma página estática (entity_type='static').
 */
export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
  const { route } = getQuery(event);
  if (!route || typeof route !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'route obrigatório' });
  }

  return new PageSeoService(getOrm(event)).getForRoute(route) ?? null;
});
