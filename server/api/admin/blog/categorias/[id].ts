import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { CategoriasService } from '~/server/services/CategoriasService';

/** GET /api/admin/blog/categorias/:id — detalhe (inclui posts vinculados)
 *  PUT /api/admin/blog/categorias/:id — atualiza
 *  DELETE /api/admin/blog/categorias/:id — remove (apenas se sem posts vinculados) */
export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new CategoriasService(getOrm(event));
  const id = Number(getRouterParam(event, 'id'));
  if (!id || isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'id inválido' });

  if (getMethod(event) === 'GET') {
    const cat = await svc.getBlogById(id);
    if (!cat) throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' });
    const posts = await svc.getPostsWithBlogCategoria(cat.slug);
    return { ...cat, posts };
  }

  if (getMethod(event) === 'PUT') {
    const cat = await svc.getBlogById(id);
    if (!cat) throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' });
    const { titulo, descricao, ordem, ativo } = (await readBody(event)) ?? {};
    if (!titulo) throw createError({ statusCode: 400, statusMessage: 'titulo é obrigatório' });
    await svc.updateBlog(id, {
      titulo: titulo.trim(),
      descricao: descricao ?? null,
      ordem: ordem ?? cat.ordem,
      ativo: ativo !== false ? 1 : 0,
    });
    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const cat = await svc.getBlogById(id);
    if (!cat) throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' });
    const posts = await svc.getPostsWithBlogCategoria(cat.slug);
    if (posts.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: `Categoria em uso por ${posts.length} post(s). Mova-os antes de deletar.`,
      });
    }
    await svc.deleteBlog(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
