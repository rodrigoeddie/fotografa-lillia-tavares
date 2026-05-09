import { defineEventHandler } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { DepoimentoService } from '~/server/services/DepoimentoService';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  return new DepoimentoService(getOrm(event)).list();
});
