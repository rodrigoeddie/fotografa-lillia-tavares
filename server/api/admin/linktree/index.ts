import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { LinktreeService } from '~/server/services/LinktreeService';
import { LinktreePresetTitleSchema } from '~/shared/schemas/linktree';

/**
 * GET  /api/admin/linktree  → lista de presets + cliques agregados.
 * POST /api/admin/linktree  → cria preset novo (body { titulo }) → { id }.
 */
export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new LinktreeService(getOrm(event));

  if (getMethod(event) === 'GET') {
    const [presets, clicks] = await Promise.all([svc.listPresets(), svc.getClicks()]);
    return { presets, clicks };
  }

  if (getMethod(event) === 'POST') {
    const parsed = LinktreePresetTitleSchema.safeParse(await readBody(event));
    if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Título inválido', data: parsed.error.format() });
    const id = await svc.createPreset(parsed.data.titulo);
    return { id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
