import { defineEventHandler } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { LinktreeService } from '~/server/services/LinktreeService';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
  const svc = new LinktreeService(getOrm(event));
  return svc.getPublicTree();
});
