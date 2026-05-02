import { defineEventHandler, createError, getRouterParam } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import { getDB, dbGetSessaoById, dbListFotosBySessao, dbGetActiveLoteBySessao, dbGetFotosDisponiveis } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  const clienteId = await getAuthenticatedCliente(event);
  const db = getDB(event);
  const sessaoId = Number(getRouterParam(event, 'id'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const sessao = await dbGetSessaoById(db, sessaoId);
  if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

  if (sessao.cliente_id !== clienteId) {
    throw createError({ statusCode: 403, statusMessage: 'Acesso negado' });
  }

  if (sessao.status === 'aguardando_fotos') {
    throw createError({ statusCode: 403, statusMessage: 'Fotos ainda não disponíveis' });
  }

  // Se há uma leva de seleção aberta, exibe apenas as fotos ainda não entregues
  const loteAtivo = await dbGetActiveLoteBySessao(db, sessaoId);
  if (loteAtivo) {
    const { results } = await dbGetFotosDisponiveis(db, sessaoId);
    return results;
  }

  // Caso contrário (sem lote aberto), retorna todas as fotos
  const { results } = await dbListFotosBySessao(db, sessaoId);
  return results;
});

