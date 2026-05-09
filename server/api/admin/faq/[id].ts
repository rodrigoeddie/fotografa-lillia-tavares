import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { FaqService } from '~/server/services/FaqService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new FaqService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const cat = await svc.getCategoriaById(id);
    if (!cat) throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' });
    const perguntas = await svc.listByCategoria(id);
    return { ...cat, perguntas };
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { titulo, slug, ordem, perguntas } = body ?? {};
    if (!titulo || !slug) throw createError({ statusCode: 400, statusMessage: 'titulo e slug são obrigatórios' });

    const cat = await svc.getCategoriaById(id);
    if (!cat) throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' });

    await svc.updateCategoria(id, titulo, slug, ordem ?? cat.ordem);

    if (Array.isArray(perguntas)) {
      const existing = await svc.listByCategoria(id);
      const newIds = perguntas.filter((p) => p.id).map((p) => p.id);
      for (const e of existing) {
        if (!newIds.includes(e.id)) await svc.deletePergunta(e.id);
      }
      for (let i = 0; i < perguntas.length; i++) {
        const p = perguntas[i];
        if (!p.pergunta || !p.resposta) continue;
        if (p.id) {
          await svc.updatePergunta(p.id, p.pergunta, p.resposta, i + 1);
        } else {
          await svc.createPergunta(id, p.pergunta, p.resposta, i + 1);
        }
      }
    }

    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const cat = await svc.getCategoriaById(id);
    if (!cat) throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' });
    await svc.deleteCategoria(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
