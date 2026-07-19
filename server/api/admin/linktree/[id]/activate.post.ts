import { defineEventHandler, createError, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { LinktreeService } from '~/server/services/LinktreeService';

/** POST /api/admin/linktree/[id]/activate → torna este preset o ativo (público). */
export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new LinktreeService(getOrm(event));

  const id = Number(getRouterParam(event, 'id'));
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });
  if (!(await svc.getPreset(id))) throw createError({ statusCode: 404, statusMessage: 'Preset não encontrado' });

  await svc.activatePreset(id);
  return { success: true };
});
