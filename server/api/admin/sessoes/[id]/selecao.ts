import { defineEventHandler, createError, getRouterParam, getQuery } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbGetSessaoById, dbGetSelecoesByLote, dbGetLoteById, dbListLotesBySessao } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);
  const sessaoId = Number(getRouterParam(event, 'id'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const sessao = await dbGetSessaoById(db, sessaoId);
  if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

  // Aceita ?lote_id=X para ver um lote específico; caso contrário usa o mais recente
  const query = getQuery(event);
  let loteId = query.lote_id ? Number(query.lote_id) : null;

  if (!loteId) {
    const { results: lotes } = await dbListLotesBySessao(db, sessaoId);
    if (!lotes.length) return { sessao, lotes: [], fotos: [], total: 0, selecionadas: 0, extras: 0, valor_extras: 0 };
    loteId = lotes[lotes.length - 1]!.id;
  }

  const lote = await dbGetLoteById(db, loteId);
  if (!lote || lote.sessao_id !== sessaoId) throw createError({ statusCode: 404, statusMessage: 'Lote não encontrado' });

  const { results } = await dbGetSelecoesByLote(db, loteId);
  const { results: todosLotes } = await dbListLotesBySessao(db, sessaoId);
  const selecionadas = results.filter((r) => r.selecionada === 1);

  return {
    sessao,
    lote,
    lotes: todosLotes,
    fotos: results,
    total: results.length,
    selecionadas: selecionadas.length,
    extras: Math.max(0, selecionadas.length - sessao.fotos_incluidas),
    valor_extras: Math.max(0, selecionadas.length - sessao.fotos_incluidas) * sessao.preco_foto_extra,
  };
});
