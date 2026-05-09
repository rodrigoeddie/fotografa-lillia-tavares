import { defineEventHandler, getQuery } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { CenarioService } from '~/server/services/CenarioService';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const svc = new CenarioService(getOrm(event));
  const { slug } = getQuery(event);

  if (slug) {
    return svc.getPaginaComCenariosBySlug(String(slug));
  }
  return svc.listPaginasComCenarios();
});
