import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbListDepoimentos, dbCreateDepoimento } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  validateAdminToken(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const { results } = await dbListDepoimentos(db);
    return results;
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { nome, foto_cf_id, rating, data, texto, link, featured, portfolio_link, ordem } = body ?? {};
    if (!nome || !texto) throw createError({ statusCode: 400, statusMessage: 'nome e texto são obrigatórios' });

    const result = await dbCreateDepoimento(db, {
      nome, foto_cf_id: foto_cf_id ?? null, rating: rating ?? 5,
      data: data ?? null, texto, link: link ?? null,
      featured: featured ? 1 : 0, portfolio_link: portfolio_link ?? null, ordem: ordem ?? 0,
    });
    return { success: true, id: result.meta.last_row_id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
