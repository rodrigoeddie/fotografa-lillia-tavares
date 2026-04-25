import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import {
  getDB,
  dbListFaqCategorias,
  dbListFaqPerguntasByCategoria,
  dbCreateFaqCategoria,
  dbCreateFaqPergunta,
} from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  validateAdminToken(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const { results: categorias } = await dbListFaqCategorias(db);
    const result = await Promise.all(
      categorias.map(async (c) => {
        const { results: perguntas } = await dbListFaqPerguntasByCategoria(db, c.id);
        return { ...c, perguntas };
      }),
    );
    return result;
  }

  // POST cria categoria
  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { titulo, slug, ordem, perguntas } = body ?? {};
    if (!titulo || !slug) throw createError({ statusCode: 400, statusMessage: 'titulo e slug são obrigatórios' });

    const result = await dbCreateFaqCategoria(db, titulo, slug, ordem ?? 0);
    const catId = result.meta.last_row_id as number;

    if (Array.isArray(perguntas)) {
      for (let i = 0; i < perguntas.length; i++) {
        const p = perguntas[i];
        if (p.pergunta && p.resposta) {
          await dbCreateFaqPergunta(db, catId, p.pergunta, p.resposta, i + 1);
        }
      }
    }

    return { success: true, id: catId };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
