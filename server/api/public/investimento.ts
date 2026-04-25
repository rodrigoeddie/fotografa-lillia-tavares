import { defineEventHandler } from 'h3';
import { getDB, dbListProdutos, dbListPacotesByProduto } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const db = getDB(event);
  const { results: produtos } = await dbListProdutos(db);
  const result = await Promise.all(
    produtos
      .filter((p) => p.active === 1)
      .map(async (p) => {
        const { results: pacotes } = await dbListPacotesByProduto(db, p.id);
        return {
          ...p,
          includes: p.includes ? JSON.parse(p.includes) : [],
          pacotes: pacotes.map((pk) => ({
            ...pk,
            features: pk.features ? JSON.parse(pk.features) : [],
          })),
        };
      }),
  );
  return result;
});
