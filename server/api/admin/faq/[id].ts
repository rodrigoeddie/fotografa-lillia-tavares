import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import {
  getDB,
  dbGetFaqCategoriaById,
  dbUpdateFaqCategoria,
  dbDeleteFaqCategoria,
  dbListFaqPerguntasByCategoria,
  dbCreateFaqPergunta,
  dbUpdateFaqPergunta,
  dbDeleteFaqPergunta,
} from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  validateAdminToken(event);
  const db = getDB(event);
  const id = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const cat = await dbGetFaqCategoriaById(db, id);
    if (!cat) throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' });
    const { results: perguntas } = await dbListFaqPerguntasByCategoria(db, id);
    return { ...cat, perguntas };
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { titulo, slug, ordem, perguntas } = body ?? {};
    if (!titulo || !slug) throw createError({ statusCode: 400, statusMessage: 'titulo e slug são obrigatórios' });

    const cat = await dbGetFaqCategoriaById(db, id);
    if (!cat) throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' });

    await dbUpdateFaqCategoria(db, id, titulo, slug, ordem ?? cat.ordem);

    // Rewrite all perguntas for this category
    if (Array.isArray(perguntas)) {
      const { results: existing } = await dbListFaqPerguntasByCategoria(db, id);
      // Delete removed ones
      const newIds = perguntas.filter((p) => p.id).map((p) => p.id);
      for (const e of existing) {
        if (!newIds.includes(e.id)) await dbDeleteFaqPergunta(db, e.id);
      }
      // Update or create
      for (let i = 0; i < perguntas.length; i++) {
        const p = perguntas[i];
        if (!p.pergunta || !p.resposta) continue;
        if (p.id) {
          await dbUpdateFaqPergunta(db, p.id, p.pergunta, p.resposta, i + 1);
        } else {
          await dbCreateFaqPergunta(db, id, p.pergunta, p.resposta, i + 1);
        }
      }
    }

    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const cat = await dbGetFaqCategoriaById(db, id);
    if (!cat) throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' });
    await dbDeleteFaqCategoria(db, id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
