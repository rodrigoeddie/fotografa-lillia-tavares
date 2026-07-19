import { defineEventHandler, readBody, createError, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { LinktreeService } from '~/server/services/LinktreeService';
import { LinktreePresetTitleSchema } from '~/shared/schemas/linktree';

/** POST /api/admin/linktree/[id]/duplicate → clona cabeçalho + blocos (body { titulo }) → { id }. */
export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new LinktreeService(getOrm(event));

  const id = Number(getRouterParam(event, 'id'));
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const parsed = LinktreePresetTitleSchema.safeParse(await readBody(event));
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Título inválido', data: parsed.error.format() });

  try {
    const newId = await svc.duplicatePreset(id, parsed.data.titulo);
    return { id: newId };
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: e?.message || 'Não foi possível duplicar' });
  }
});
