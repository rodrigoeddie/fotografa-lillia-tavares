import { defineEventHandler, getQuery } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { BlogService } from '~/server/services/BlogService';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const { categoria } = getQuery(event);
  const all = await new BlogService(getOrm(event)).list(true);
  const filtered = categoria ? all.filter((p) => p.categoria === categoria) : all;
  return filtered.map((p) => ({
    ...p,
    seo_keywords: p.seo_keywords ? JSON.parse(p.seo_keywords) : [],
  }));
});
