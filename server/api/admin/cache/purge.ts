import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);

  const cf = (event.context as any).cloudflare;
  const zoneId = cf?.env?.CF_ZONE_ID as string | undefined;
  const apiToken = cf?.env?.CF_CACHE_API_TOKEN as string | undefined;

  /* GET = diagnóstico: responde se dá para purgar, sem purgar nada. */
  if (getMethod(event) === 'GET') {
    if (!zoneId || !apiToken) {
      return {
        ok: false,
        motivo: `Faltando ${!zoneId ? 'CF_ZONE_ID' : ''}${!zoneId && !apiToken ? ' e ' : ''}${!apiToken ? 'CF_CACHE_API_TOKEN' : ''} no ambiente.`,
      };
    }
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      const data = await res.json() as { success: boolean; result?: { name?: string }; errors?: { message?: string }[] };
      if (!data.success) {
        return { ok: false, motivo: data.errors?.map((e) => e.message).join('; ') || 'Token sem acesso à zona.' };
      }
      return { ok: true, zona: data.result?.name ?? '' };
    } catch (e: any) {
      return { ok: false, motivo: 'Não foi possível falar com a API da Cloudflare: ' + (e?.message ?? e) };
    }
  }

  if (getMethod(event) !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
  }

  if (!zoneId || !apiToken) {
    throw createError({ statusCode: 500, statusMessage: 'CF_ZONE_ID ou CF_CACHE_API_TOKEN não configurados' });
  }

  const body = await readBody(event);
  const { urls } = body ?? {};

  const payload: Record<string, unknown> = urls && Array.isArray(urls) && urls.length > 0
    ? { files: urls }
    : { purge_everything: true };

  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json() as { success: boolean; errors?: { message?: string }[] };
  if (!data.success) {
    const detalhe = data.errors?.map((e) => e.message).filter(Boolean).join('; ') || JSON.stringify(data.errors);
    throw createError({ statusCode: 502, statusMessage: 'Falha ao purgar cache: ' + detalhe });
  }

  return { success: true, urls: Array.isArray(urls) ? urls.length : 0 };
});
