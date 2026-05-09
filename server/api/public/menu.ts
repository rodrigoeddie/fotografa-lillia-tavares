import { defineEventHandler } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { MenuService } from '~/server/services/MenuService';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
  const svc = new MenuService(getOrm(event));
  return svc.list();
});
