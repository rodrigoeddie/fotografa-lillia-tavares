import { defineEventHandler, getQuery } from 'h3';
import { getDB, dbListPortfolioWorks, dbListPortfolioFotosByWork } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const db = getDB(event);
  const { categoria, home } = getQuery(event);
  const { results } = await dbListPortfolioWorks(db, true);
  let filtered = results;
  if (categoria) filtered = filtered.filter((w) => w.categoria === categoria);
  if (home === '1') filtered = filtered.filter((w) => w.home === 1);

  const works = await Promise.all(
    filtered.map(async (w) => {
      const { results: fotos } = await dbListPortfolioFotosByWork(db, w.id);
      return {
        ...w,
        seo_keywords: w.seo_keywords ? JSON.parse(w.seo_keywords) : [],
        fotos,
      };
    }),
  );
  return works;
});
