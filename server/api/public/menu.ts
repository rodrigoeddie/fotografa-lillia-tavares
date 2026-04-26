import { defineEventHandler } from 'h3';
import { getDB, dbListMenu } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
  const db = getDB(event);
  const { results } = await dbListMenu(db);
  return results;
});
