import { defineEventHandler, getRouterParam, createError } from 'h3';
import { getDB, dbGetBlogPostBySlug } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const db = getDB(event);
  const category = getRouterParam(event, 'category');
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug obrigatório' });

  // Query by slug; optionally scope to category
  let post = await dbGetBlogPostBySlug(db, slug);
  if (!post && category) {
    // Fallback: query by categoria + slug
    const db2 = getDB(event);
    const result = await db2.prepare(
      'SELECT * FROM blog_posts WHERE slug = ? AND categoria = ? AND ativo = 1',
    ).bind(slug, category).first();
    post = result as any;
  }

  if (!post || (post as any).ativo === 0) throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' });

  return {
    ...post,
    conteudo_imagens: (post as any).conteudo_imagens ? JSON.parse((post as any).conteudo_imagens) : [],
    album: (post as any).album ? JSON.parse((post as any).album) : [],
    seo_keywords: (post as any).seo_keywords ? JSON.parse((post as any).seo_keywords) : [],
  };
});
