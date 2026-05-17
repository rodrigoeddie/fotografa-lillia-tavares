import { defineEventHandler, getQuery } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { PageFaqService } from '~/server/services/PageFaqService';

/** GET /api/public/page-faq?route=/sobre — retorna o faq_slug da rota, ou null */
export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');
  const { route } = getQuery(event);
  if (!route || typeof route !== 'string') return null;
  return new PageFaqService(getOrm(event)).getByRoute(route);
});
