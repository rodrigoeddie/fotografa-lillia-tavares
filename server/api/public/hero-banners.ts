import { defineEventHandler, getQuery } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { HeroBannerService } from '~/server/services/HeroBannerService';

/** GET /api/public/hero-banners?route=/sobre — retorna os banners ativos para a rota */
export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');
  const { route } = getQuery(event);
  if (!route || typeof route !== 'string') return [];
  const banners = await new HeroBannerService(getOrm(event)).getBannersForRoute(route);
  return banners.filter((b) => b.ativo !== 0);
});
