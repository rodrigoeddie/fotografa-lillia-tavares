import { defineEventHandler, readBody, setHeader } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { LinktreeService } from '~/server/services/LinktreeService';

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store');
  const body = await readBody(event).catch(() => null);
  const chave = typeof body?.chave === 'string' ? body.chave.slice(0, 120) : '';
  if (!chave) return { ok: false };

  await new LinktreeService(getOrm(event)).recordClick(chave);
  return { ok: true };
});
