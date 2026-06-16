import { defineEventHandler, readRawBody, getHeader, createError } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { PagamentoService } from '~/server/services/PagamentoService';

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
    return hex === signature.toLowerCase().replace('sha256=', '');
  } catch {
    return false;
  }
}

export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event) ?? '';
  const signature = getHeader(event, 'x-signature') ?? getHeader(event, 'x-payload-signature') ?? '';
  const secret = process.env.SUMUP_WEBHOOK_SECRET ?? '';

  if (secret && signature) {
    const valid = await validateHmac(secret, rawBody, signature);
    if (!valid) throw createError({ statusCode: 401, statusMessage: 'Assinatura inválida' });
  }

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
  await pagSvc.updateStatus(checkoutId, status, transactionId);

  return { ok: true };
});
