import { defineEventHandler } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { FaqService } from '~/server/services/FaqService';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  return new FaqService(getOrm(event)).listCategoriasComPerguntas();
});
