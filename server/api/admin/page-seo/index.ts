import { defineEventHandler, readBody, createError, getMethod, getQuery } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { PageSeoService } from '~/server/services/PageSeoService';
import { PageSeoUpsertSchema, entityTypeSchema } from '~/shared/schemas/seo';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new PageSeoService(getOrm(event));

  if (getMethod(event) === 'GET') {
    const { entity_type } = getQuery(event);
    if (entity_type) {
      const t = entityTypeSchema.safeParse(entity_type);
      if (!t.success) throw createError({ statusCode: 400, statusMessage: 'entity_type inválido' });
      return svc.list(t.data);
    }
    return svc.list();
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const parsed = PageSeoUpsertSchema.safeParse(body);
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Validação falhou', data: parsed.error.flatten() });
    }
    const result = await svc.upsert(parsed.data);
    return { success: true, ...result };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
