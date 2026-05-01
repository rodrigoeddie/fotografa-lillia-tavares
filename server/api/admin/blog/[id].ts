import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbGetBlogPostById, dbUpdateBlogPost, dbDeleteBlogPost } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);
  const id = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const post = await dbGetBlogPostById(db, id);
    if (!post) throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' });
    return post;
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { slug, categoria, titulo, descricao, data, imagem_cf_id, conteudo, conteudo_imagens, album, ativo, seo_keywords } = body ?? {};
    if (!slug || !categoria || !titulo) throw createError({ statusCode: 400, statusMessage: 'slug, categoria e titulo são obrigatórios' });

    const post = await dbGetBlogPostById(db, id);
    if (!post) throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' });

    await dbUpdateBlogPost(db, id, {
      slug, categoria, titulo, descricao: descricao ?? null,
      data: data ?? null, imagem_cf_id: imagem_cf_id ?? null,
      conteudo: conteudo ?? null,
      conteudo_imagens: conteudo_imagens ? JSON.stringify(conteudo_imagens) : null,
      album: album ? JSON.stringify(album) : null,
      ativo: ativo !== false ? 1 : 0,
      seo_keywords: seo_keywords ? JSON.stringify(seo_keywords) : null,
    });
    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const post = await dbGetBlogPostById(db, id);
    if (!post) throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' });
    await dbDeleteBlogPost(db, id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
