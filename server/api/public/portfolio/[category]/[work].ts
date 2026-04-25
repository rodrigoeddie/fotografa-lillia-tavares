import { defineEventHandler, getRouterParam, createError } from 'h3';
import { getDB, dbGetPortfolioWorkBySlug, dbListPortfolioFotosByWork } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const db = getDB(event);
  const category = getRouterParam(event, 'category');
  const work = getRouterParam(event, 'work');
  if (!category || !work) throw createError({ statusCode: 400, statusMessage: 'params obrigatórios' });

  const slug = `${category}/${work}`;
  const portfolioWork = await dbGetPortfolioWorkBySlug(db, slug);
  if (!portfolioWork || portfolioWork.ativo === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Portfolio não encontrado' });
  }

  const { results: fotos } = await dbListPortfolioFotosByWork(db, portfolioWork.id);

  return {
    ...portfolioWork,
    seo_keywords: portfolioWork.seo_keywords ? JSON.parse(portfolioWork.seo_keywords) : [],
    fotos,
  };
});
