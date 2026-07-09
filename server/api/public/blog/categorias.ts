import { defineEventHandler } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { CategoriasService } from '~/server/services/CategoriasService';

/** GET /api/public/blog/categorias */
export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
  return new CategoriasService(getOrm(event)).listBlog(true);
});
