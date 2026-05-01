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
  await validateAdminToken(event);
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
    const { titulo, slug, perguntas } = body ?? {};
    if (!titulo || !slug) throw createError({ statusCode: 400, statusMessage: 'titulo e slug são obrigatórios' });

    const { results: maxResult } = await db
      .prepare('SELECT COALESCE(MAX(ordem), 0) + 1 as next FROM faq_categorias')
      .all<{ next: number }>();
    const ordem = maxResult[0]?.next ?? 1;

    const result = await dbCreateFaqCategoria(db, titulo, slug, ordem);
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

  // PATCH reordena categorias: body = [{id, ordem}]
  if (getMethod(event) === 'PATCH') {
    const body = await readBody(event);
    if (!Array.isArray(body)) throw createError({ statusCode: 400, statusMessage: 'Body deve ser um array' });
    for (const item of body) {
      if (item.id && item.ordem !== undefined) {
        await db.prepare('UPDATE faq_categorias SET ordem = ? WHERE id = ?').bind(item.ordem, item.id).run();
      }
    }
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});