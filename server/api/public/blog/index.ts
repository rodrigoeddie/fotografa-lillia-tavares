import { defineEventHandler, getQuery } from 'h3';
import { getDB, dbListBlogPosts } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const db = getDB(event);
  const { categoria } = getQuery(event);
  const { results } = await dbListBlogPosts(db, true);
  const filtered = categoria ? results.filter((p) => p.categoria === categoria) : results;
  return filtered.map((p) => ({
    ...p,
    seo_keywords: p.seo_keywords ? JSON.parse(p.seo_keywords) : [],
  }));
});
