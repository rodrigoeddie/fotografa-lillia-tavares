import { defineEventHandler, getQuery } from 'h3';
import { getDB, dbListCenarioPaginas, dbGetCenarioPaginaBySlug, dbListCenariosByPagina } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const db = getDB(event);
  const { slug } = getQuery(event);

  if (slug) {
    const pagina = await dbGetCenarioPaginaBySlug(db, slug as string);
    if (!pagina) return null;
    const { results: cenarios } = await dbListCenariosByPagina(db, pagina.id);
    return { ...pagina, cenarios };
  }

  const { results: paginas } = await dbListCenarioPaginas(db);
  const result = await Promise.all(
    paginas.map(async (p) => {
      const { results: cenarios } = await dbListCenariosByPagina(db, p.id);
      return { ...p, cenarios };
    }),
  );
  return result;
});
