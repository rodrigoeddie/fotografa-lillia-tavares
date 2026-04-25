import { defineEventHandler } from 'h3';
import { getDB, dbListFaqCategorias, dbListFaqPerguntasByCategoria } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const db = getDB(event);
  const { results: categorias } = await dbListFaqCategorias(db);
  const result = await Promise.all(
    categorias.map(async (c) => {
      const { results: perguntas } = await dbListFaqPerguntasByCategoria(db, c.id);
      return { ...c, perguntas };
    }),
  );
  return result;
});
