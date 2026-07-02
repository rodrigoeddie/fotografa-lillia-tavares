import { defineEventHandler, readRawBody, getHeader, createError } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { PagamentoService } from '~/server/services/PagamentoService';
import { rateLimit } from '~/server/utils/rate-limit';

/* Comparação em tempo constante para evitar timing attacks na verificação do HMAC. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function validateHmac(secret: string, rawBody: string, signature: string): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const signed = await crypto.subtle.sign('HMAC', key, enc.encode(rawBody));
    const hex = Array.from(new Uint8Array(signed)).map((b) => b.toString(16).padStart(2, '0')).join('');
    return timingSafeEqual(hex, signature.toLowerCase().replace('sha256=', '').trim());
  } catch {
    return false;
  }
}

export default defineEventHandler(async (event) => {
  /* Flood de webhooks forjados: 60 requisições por IP por minuto */
  await rateLimit(event, 'webhook-sumup', { limit: 60, windowSec: 60 });

  const rawBody = await readRawBody(event) ?? '';
  const signature = getHeader(event, 'x-signature') ?? getHeader(event, 'x-payload-signature') ?? '';
  const secret = process.env.SUMUP_WEBHOOK_SECRET ?? '';

  /* Fail-closed: sem secret configurado o webhook NÃO pode ser confiável.
     Recusa em vez de aceitar payloads não autenticados (que poderiam marcar
     qualquer pagamento como "pago" sem nenhuma cobrança real). */
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: 'Webhook não configurado' });
  }
  if (!signature) {
    throw createError({ statusCode: 401, statusMessage: 'Assinatura ausente' });
  }
  const valid = await validateHmac(secret, rawBody, signature);
  if (!valid) throw createError({ statusCode: 401, statusMessage: 'Assinatura inválida' });

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Payload inválido' });
  }

  /* SumUp pode enviar o checkout_id em diferentes campos dependendo do evento */
  const checkoutId: string | undefined =
    payload?.id ||
    payload?.checkout?.id ||
    payload?.payload?.id ||
    payload?.checkout_id;

  const transactionId: string | undefined =
    payload?.transaction_id ||
    payload?.transactions?.[0]?.id ||
    payload?.payload?.transaction_id;

  /* Normaliza status: SumUp envia PAID, FAILED, PENDING, etc. */
  const rawStatus: string = (
    payload?.status ||
    payload?.payload?.status ||
    payload?.event_type ||
    ''
  ).toUpperCase();

  let status: string;
  if (rawStatus === 'PAID' || rawStatus === 'SUCCESSFUL' || rawStatus === 'CHECKOUT_COMPLETED') {
    status = 'pago';
  } else if (rawStatus === 'FAILED' || rawStatus === 'CANCELLED' || rawStatus === 'CHECKOUT_CANCELLED') {
    status = 'cancelado';
  } else {
    /* Evento irrelevante — retorna 200 para não retentar */
    return { ok: true };
  }

  if (!checkoutId) return { ok: true };

  const orm = getOrm(event);
  const pagSvc = new PagamentoService(orm);

  if (status === 'pago') {
    /* Defesa em profundidade: confirma valor contra a SumUp (autoritativo) antes de
       marcar pago — não confia no amount do payload, que poderia divergir do esperado. */
    const pagamento = await pagSvc.getByCheckoutId(checkoutId);
    if (!pagamento) return { ok: true };

    const apiKey = process.env.SUMUP_API_KEY ?? '';
    if (apiKey) {
      try {
        const sumup = await pagSvc.fetchSumupCheckoutStatus(apiKey, checkoutId);
        const pagoCents = sumup.amount != null ? Math.round(sumup.amount * 100) : null;
        const moedaOk = !sumup.currency || sumup.currency.toUpperCase() === 'BRL';
        const statusOk = sumup.status?.toUpperCase() === 'PAID';
        if (!statusOk || (pagoCents != null && pagoCents !== pagamento.valor_cents) || !moedaOk) {
          console.error(
            `[webhook sumup] divergência checkout=${checkoutId} ` +
            `status=${sumup.status} esperado=${pagamento.valor_cents} pago=${pagoCents} moeda=${sumup.currency}`,
          );
          return { ok: true };
        }
        await pagSvc.updateStatus(checkoutId, 'pago', transactionId ?? sumup.transactions?.[0]?.id);
        return { ok: true };
      } catch {
        /* SumUp indisponível: não confirma agora — o retorno síncrono ou retry do
           webhook reconfirmam depois. Evita marcar pago sem validar o valor. */
        console.error(`[webhook sumup] falha ao reconsultar checkout=${checkoutId}`);
        return { ok: true };
      }
    }
    /* Sem API key não há como validar o valor — não confirma automaticamente. */
    console.error(`[webhook sumup] SUMUP_API_KEY ausente; pago não confirmado checkout=${checkoutId}`);
    return { ok: true };
  }

  await pagSvc.updateStatus(checkoutId, status, transactionId);
  return { ok: true };
});
