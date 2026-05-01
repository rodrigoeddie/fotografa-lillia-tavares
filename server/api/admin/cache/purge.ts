import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);

  if (getMethod(event) !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
  }

  const cf = (event.context as any).cloudflare;
  const zoneId = cf?.env?.CF_ZONE_ID as string | undefined;
  const apiToken = cf?.env?.CF_CACHE_API_TOKEN as string | undefined;

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

  const data = await res.json() as { success: boolean; errors?: unknown[] };
  if (!data.success) {
    throw createError({ statusCode: 502, statusMessage: 'Falha ao purgar cache: ' + JSON.stringify(data.errors) });
  }

  return { success: true };
});
