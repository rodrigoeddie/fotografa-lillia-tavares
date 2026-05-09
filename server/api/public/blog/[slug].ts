import { defineEventHandler, getRouterParam, createError } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { BlogService } from '~/server/services/BlogService';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug obrigatório' });

  const post = await new BlogService(getOrm(event)).getBySlug(slug);
  if (!post || post.ativo === 0) throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' });

  return {
    ...post,
    conteudo_imagens: post.conteudo_imagens ? JSON.parse(post.conteudo_imagens) : [],
    album: post.album ? JSON.parse(post.album) : [],
    seo_keywords: post.seo_keywords ? JSON.parse(post.seo_keywords) : [],
  };
});
