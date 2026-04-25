import { defineEventHandler, getRouterParam, createError } from 'h3';
import { getDB, dbGetPortfolioWorkBySlug, dbListPortfolioFotosByWork } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const db = getDB(event);
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug obrigatório' });

  const work = await dbGetPortfolioWorkBySlug(db, slug);
  if (!work || work.ativo === 0) throw createError({ statusCode: 404, statusMessage: 'Portfolio não encontrado' });

  const { results: fotos } = await dbListPortfolioFotosByWork(db, work.id);

  return {
    ...work,
    seo_keywords: work.seo_keywords ? JSON.parse(work.seo_keywords) : [],
    fotos,
  };
});
