import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { MenuService } from '~/server/services/MenuService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new MenuService(getOrm(event));

  if (getMethod(event) === 'GET') {
    return svc.list();
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    if (!Array.isArray(body)) {
      throw createError({ statusCode: 400, statusMessage: 'Body deve ser um array de itens' });
    }
    await svc.replace(body);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
