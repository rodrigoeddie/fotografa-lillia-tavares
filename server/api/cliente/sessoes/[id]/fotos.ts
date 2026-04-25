import { defineEventHandler, createError, getRouterParam } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import { getDB, dbGetSessaoById, dbListFotosBySessao } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  const clienteId = await getAuthenticatedCliente(event);
  const db = getDB(event);
  const sessaoId = Number(getRouterParam(event, 'id'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const sessao = await dbGetSessaoById(db, sessaoId);
  if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

  // Garante que o cliente só acessa suas próprias sessões
  if (sessao.cliente_id !== clienteId) {
    throw createError({ statusCode: 403, statusMessage: 'Acesso negado' });
  }

  if (sessao.status === 'aguardando_fotos') {
    throw createError({ statusCode: 403, statusMessage: 'Fotos ainda não disponíveis' });
  }

  const { results: fotos } = await dbListFotosBySessao(db, sessaoId);
  return fotos;
});
