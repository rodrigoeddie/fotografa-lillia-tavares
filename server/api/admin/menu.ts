import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbListMenu, dbReplaceMenu } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const { results } = await dbListMenu(db);
    return results;
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    if (!Array.isArray(body)) {
      throw createError({ statusCode: 400, statusMessage: 'Body deve ser um array de itens' });
    }
    await dbReplaceMenu(db, body);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
