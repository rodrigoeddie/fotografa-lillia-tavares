import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { SessaoService } from '~/server/services/SessaoService';
import { purgeCache } from '~/server/utils/purge-cache';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new SessaoService(getOrm(event));
  const sessaoId = Number(getRouterParam(event, 'id'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const sessao = await svc.getById(sessaoId);
  if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

  if (getMethod(event) === 'GET') {
    return svc.listFotos(sessaoId);
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { cloudflare_image_id } = body ?? {};
    if (!cloudflare_image_id) {
      throw createError({ statusCode: 400, statusMessage: 'cloudflare_image_id é obrigatório' });
    }

    const ordem = await svc.countFotos(sessaoId);
    const result = await svc.addFoto(sessaoId, cloudflare_image_id, ordem);
    await purgeCache(event, [
      `/api/cliente/sessoes/${sessaoId}/fotos`,
      `/api/cliente/sessoes/${sessaoId}/selecao`,
    ]);
    return { success: true, id: result.meta.last_row_id };
  }

  if (getMethod(event) === 'DELETE') {
    const body = await readBody(event);
    const { foto_id } = body ?? {};
    if (!foto_id) throw createError({ statusCode: 400, statusMessage: 'foto_id é obrigatório' });

    // Busca cloudflare_image_id antes de deletar do banco
    const foto = await svc.getFoto(Number(foto_id), sessaoId);
    if (foto) {
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      const apiKey = process.env.CLOUDFLARE_API_KEY;
      if (accountId && apiKey) {
        await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${foto.cloudflare_image_id}`,
          { method: 'DELETE', headers: { Authorization: `Bearer ${apiKey}` } },
        ).catch(() => {}); // falha silenciosa para não bloquear a remoção do banco
      }
    }

    await svc.deleteFoto(Number(foto_id), sessaoId);
    await purgeCache(event, [
      `/api/cliente/sessoes/${sessaoId}/fotos`,
      `/api/cliente/sessoes/${sessaoId}/selecao`,
    ]);
    return { success: true };
  }

  if (getMethod(event) === 'PATCH') {
    const body = await readBody(event);
    const capa_foto_id = body?.capa_foto_id ?? null;
    await svc.setCapa(sessaoId, capa_foto_id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
