import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { CategoriasService } from '~/server/services/CategoriasService';

/** GET /api/admin/blog/categorias — lista todas
 *  POST /api/admin/blog/categorias — cria nova */
export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new CategoriasService(getOrm(event));

  if (getMethod(event) === 'GET') {
    return svc.listBlog();
  }

  if (getMethod(event) === 'POST') {
    const { slug, titulo, descricao, ordem, ativo } = (await readBody(event)) ?? {};
    if (!slug || !titulo) throw createError({ statusCode: 400, statusMessage: 'slug e titulo são obrigatórios' });
    const result = await svc.createBlog({
      slug: slug.trim(),
      titulo: titulo.trim(),
      descricao: descricao ?? null,
      ordem: ordem ?? 0,
      ativo: ativo !== false ? 1 : 0,
    });
    return { success: true, id: result.meta.last_row_id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
