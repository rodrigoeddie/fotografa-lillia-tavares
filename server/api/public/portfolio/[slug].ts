import { defineEventHandler, getRouterParam, createError } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { PortfolioService } from '~/server/services/PortfolioService';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug obrigatório' });

  const svc = new PortfolioService(getOrm(event));
  const work = await svc.getBySlug(slug);
  if (!work || work.ativo === 0) throw createError({ statusCode: 404, statusMessage: 'Portfolio não encontrado' });

  const fotos = await svc.listFotosByWork(work.id);
  return {
    ...work,
    seo_keywords: work.seo_keywords ? JSON.parse(work.seo_keywords) : [],
    fotos,
  };
});
