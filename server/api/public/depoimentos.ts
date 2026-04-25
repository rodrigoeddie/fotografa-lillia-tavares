import { defineEventHandler } from 'h3';
import { getDB, dbListDepoimentos } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const db = getDB(event);
  const { results } = await dbListDepoimentos(db);
  return results;
});
