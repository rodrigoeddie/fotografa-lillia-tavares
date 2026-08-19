import { defineEventHandler } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { SobreService } from '~/server/services/SobreService';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const svc = new SobreService(getOrm(event));
  return svc.getConteudo(true);
});
