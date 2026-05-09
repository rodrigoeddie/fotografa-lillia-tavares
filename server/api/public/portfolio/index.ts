import { defineEventHandler, getQuery } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { PortfolioService } from '~/server/services/PortfolioService';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const { categoria, home } = getQuery(event);
  const svc = new PortfolioService(getOrm(event));
  let works = await svc.list(true);
  if (categoria) works = works.filter((w) => w.categoria === categoria);
  if (home === '1') works = works.filter((w) => w.home === 1);

  return Promise.all(
    works.map(async (w) => ({
      ...w,
      seo_keywords: w.seo_keywords ? JSON.parse(w.seo_keywords) : [],
      fotos: await svc.listFotosByWork(w.id),
    })),
  );
});
