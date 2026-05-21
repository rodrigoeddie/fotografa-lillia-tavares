import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { BlogService } from '~/server/services/BlogService';
import { deleteCfImages } from '~/server/utils/delete-cf-images';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new BlogService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const post = await svc.getById(id);
    if (!post) throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' });
    return post;
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { slug, categoria, titulo, descricao, data, imagem_cf_id, conteudo, conteudo_imagens, album, ativo, seo_keywords } = body ?? {};
    if (!slug || !categoria || !titulo) throw createError({ statusCode: 400, statusMessage: 'slug, categoria e titulo são obrigatórios' });

    const post = await svc.getById(id);
    if (!post) throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' });

    await svc.update(id, {
      slug,
      categoria,
      titulo,
      descricao: descricao ?? null,
      data: data ?? null,
      imagem_cf_id: imagem_cf_id ?? null,
      conteudo: conteudo ?? null,
      conteudo_imagens: conteudo_imagens ? JSON.stringify(conteudo_imagens) : null,
      album: album ? JSON.stringify(album) : null,
      ativo: ativo !== false ? 1 : 0,
      seo_keywords: seo_keywords ? JSON.stringify(seo_keywords) : null,
    });
    return { success: true };
  }

  if (getMethod(event) === 'PATCH') {
    const body = await readBody(event);
    if ('ativo' in (body ?? {})) {
      await svc.setAtivo(id, Boolean(body.ativo));
      return { success: true };
    }
    throw createError({ statusCode: 400, statusMessage: 'Campo inválido para patch' });
  }

  if (getMethod(event) === 'DELETE') {
    const post = await svc.getById(id);
    if (!post) throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' });
    await deleteCfImages(event, [post.imagem_cf_id]);
    await svc.delete(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
