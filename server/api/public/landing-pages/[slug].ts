import { defineEventHandler, getRouterParam, createError } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { LandingPageService } from '~/server/services/LandingPageService';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug obrigatório' });

  const rendered = await new LandingPageService(getOrm(event)).getRendered(slug);
  if (!rendered) throw createError({ statusCode: 404, statusMessage: 'Landing page não encontrada' });

  return rendered;
});
