import { defineEventHandler } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { ProdutoService } from '~/server/services/ProdutoService';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  const list = await new ProdutoService(getOrm(event)).listAtivosComPacotes();
  return list.map((p) => ({
    ...p,
    includes: p.includes ? JSON.parse(p.includes) : [],
    pacotes: p.pacotes.map((pk) => ({
      ...pk,
      features: pk.features ? JSON.parse(pk.features) : [],
    })),
  }));
});
