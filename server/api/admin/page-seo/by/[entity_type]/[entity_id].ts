import { defineEventHandler, createError, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { PageSeoService } from '~/server/services/PageSeoService';
import { entityTypeSchema } from '~/shared/schemas/seo';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new PageSeoService(getOrm(event));

  const entityType = getRouterParam(event, 'entity_type');
  const entityIdParam = getRouterParam(event, 'entity_id');

  const t = entityTypeSchema.safeParse(entityType);
  if (!t.success) throw createError({ statusCode: 400, statusMessage: 'entity_type inválido' });

  if (t.data === 'static') {
    // Para static, entity_id é a route URL-encoded
    const route = decodeURIComponent(entityIdParam ?? '');
    const row = await svc.getForRoute(route);
    return row ?? null;
  }

  const id = Number(entityIdParam);
  if (!id) throw createError({ statusCode: 400, statusMessage: 'entity_id inválido' });

  return svc.getForEntity(t.data, id) ?? null;
});
