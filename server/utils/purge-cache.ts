import type { H3Event } from 'h3';

const SITE_BASE = 'https://fotografalilliatavares.com.br';

/**
 * Purga URLs específicas do cache CDN da Cloudflare.
 * Silenciosamente não faz nada em ambiente local (sem CF_ZONE_ID / CF_CACHE_API_TOKEN).
 * Falhas na purga não lançam erro — a mutação já foi persistida.
 */
export async function purgeCache(event: H3Event, paths: string[]): Promise<void> {
  const cf = (event.context as any).cloudflare;
  const zoneId = cf?.env?.CF_ZONE_ID as string | undefined;
  const apiToken = cf?.env?.CF_CACHE_API_TOKEN as string | undefined;

  if (!zoneId || !apiToken) return;

  const files = paths.map((p) => `${SITE_BASE}${p}`);

  try {
    await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files }),
    });
  } catch {
    // best-effort — não bloqueia a resposta da mutação
  }
}
