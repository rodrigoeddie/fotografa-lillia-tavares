import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { LinktreeService } from '~/server/services/LinktreeService';
import { LinktreeSaveSchema, LinktreePresetTitleSchema } from '~/shared/schemas/linktree';

/**
 * GET    /api/admin/linktree/[id]  → { preset, items } do preset (edição).
 * PUT    /api/admin/linktree/[id]  → salva cabeçalho + blocos (body { profile, items }).
 * PATCH  /api/admin/linktree/[id]  → renomeia (body { titulo }).
 * DELETE /api/admin/linktree/[id]  → exclui o preset e seus blocos.
 */
export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new LinktreeService(getOrm(event));

  const id = Number(getRouterParam(event, 'id'));
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const method = getMethod(event);

  if (method === 'GET') {
    const preset = await svc.getPreset(id);
    if (!preset) throw createError({ statusCode: 404, statusMessage: 'Preset não encontrado' });
    const items = await svc.listItems(id);
    return { preset, items };
  }

  if (method === 'PUT') {
    const parsed = LinktreeSaveSchema.safeParse(await readBody(event));
    if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Dados inválidos', data: parsed.error.format() });
    if (!(await svc.getPreset(id))) throw createError({ statusCode: 404, statusMessage: 'Preset não encontrado' });
    await svc.savePreset(id, parsed.data.profile, parsed.data.items);
    return { success: true };
  }

  if (method === 'PATCH') {
    const parsed = LinktreePresetTitleSchema.safeParse(await readBody(event));
    if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Título inválido', data: parsed.error.format() });
    await svc.renamePreset(id, parsed.data.titulo);
    return { success: true };
  }

  if (method === 'DELETE') {
    try {
      await svc.deletePreset(id);
    } catch (e: any) {
      throw createError({ statusCode: 409, statusMessage: e?.message || 'Não foi possível excluir' });
    }
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
