import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { LinktreeService } from '~/server/services/LinktreeService';
import { LinktreeSaveSchema } from '~/shared/schemas/linktree';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new LinktreeService(getOrm(event));

  if (getMethod(event) === 'GET') {
    const [profile, items, clicks] = await Promise.all([svc.getProfile(), svc.listItems(), svc.getClicks()]);
    return { profile, items, clicks };
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const parsed = LinktreeSaveSchema.safeParse(body);
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Dados inválidos', data: parsed.error.format() });
    }
    await svc.updateProfile(parsed.data.profile);
    await svc.replaceItems(parsed.data.items);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
