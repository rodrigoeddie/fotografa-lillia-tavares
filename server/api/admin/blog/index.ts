import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbListBlogPosts, dbCreateBlogPost } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  validateAdminToken(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const { results } = await dbListBlogPosts(db);
    return results;
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { slug, categoria, titulo, descricao, data, imagem_cf_id, conteudo, conteudo_imagens, album, ativo, seo_keywords } = body ?? {};
    if (!slug || !categoria || !titulo) throw createError({ statusCode: 400, statusMessage: 'slug, categoria e titulo são obrigatórios' });

    const result = await dbCreateBlogPost(db, {
      slug, categoria, titulo, descricao: descricao ?? null,
      data: data ?? null, imagem_cf_id: imagem_cf_id ?? null,
      conteudo: conteudo ?? null,
      conteudo_imagens: conteudo_imagens ? JSON.stringify(conteudo_imagens) : null,
      album: album ? JSON.stringify(album) : null,
      ativo: ativo !== false ? 1 : 0,
      seo_keywords: seo_keywords ? JSON.stringify(seo_keywords) : null,
    });
    return { success: true, id: result.meta.last_row_id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
