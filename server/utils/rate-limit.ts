import type { H3Event } from 'h3';
import { createError, getHeader } from 'h3';

interface RateLimitOptions {
  limit: number;      // máximo de requisições na janela
  windowSec: number;  // tamanho da janela em segundos
}

/**
 * Rate limiting por IP usando KV (binding RATE_LIMIT em wrangler.toml).
 *
 * Janela fixa: um contador por (escopo, IP, janela) com TTL. KV é eventualmente
 * consistente entre PoPs — serve para frear brute force, não para contagem exata.
 * Fail-open quando o binding não existe (dev local sem KV) para não derrubar o site.
 */
export async function rateLimit(event: H3Event, scope: string, opts: RateLimitOptions): Promise<void> {
  const kv = (event.context as any).cloudflare?.env?.RATE_LIMIT;
  if (!kv) return;

  const ip =
    getHeader(event, 'cf-connecting-ip') ||
    getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  const windowId = Math.floor(Date.now() / 1000 / opts.windowSec);
  const key = `rl:${scope}:${ip}:${windowId}`;

  const current = Number(await kv.get(key)) || 0;
  if (current >= opts.limit) {
    throw createError({ statusCode: 429, statusMessage: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' });
  }

  /* TTL mínimo aceito pelo KV é 60s */
  await kv.put(key, String(current + 1), { expirationTtl: Math.max(opts.windowSec, 60) });
}
