import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { CategoriasService } from '~/server/services/CategoriasService';

/** GET /api/admin/portfolio/categorias/:id — detalhe (inclui works vinculados)
 *  PUT /api/admin/portfolio/categorias/:id — atualiza
 *  DELETE /api/admin/portfolio/categorias/:id — remove (apenas se sem works vinculados) */
export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new CategoriasService(getOrm(event));
  const id = Number(getRouterParam(event, 'id'));
  if (!id || isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'id inválido' });

  if (getMethod(event) === 'GET') {
    const cat = await svc.getPortfolioById(id);
    if (!cat) throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' });
    const works = await svc.getWorksWithPortfolioCategoria(cat.slug);
    return { ...cat, works };
  }

  if (getMethod(event) === 'PUT') {
    const cat = await svc.getPortfolioById(id);
    if (!cat) throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' });
    const { titulo, descricao, ordem, ativo } = (await readBody(event)) ?? {};
    if (!titulo) throw createError({ statusCode: 400, statusMessage: 'titulo é obrigatório' });
    await svc.updatePortfolio(id, {
      titulo: titulo.trim(),
      descricao: descricao ?? null,
      ordem: ordem ?? cat.ordem,
      ativo: ativo !== false ? 1 : 0,
    });
    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const cat = await svc.getPortfolioById(id);
    if (!cat) throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' });
    const works = await svc.getWorksWithPortfolioCategoria(cat.slug);
    if (works.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: `Categoria em uso por ${works.length} trabalho(s). Mova-os antes de deletar.`,
      });
    }
    await svc.deletePortfolio(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
