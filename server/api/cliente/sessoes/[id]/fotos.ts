import { defineEventHandler, createError, getRouterParam } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { SessaoService } from '~/server/services/SessaoService';

export default defineEventHandler(async (event) => {
  const clienteId = await getAuthenticatedCliente(event);
  const svc = new SessaoService(getOrm(event));
  const sessaoId = Number(getRouterParam(event, 'id'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const sessao = await svc.getById(sessaoId);
  if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

  if (sessao.cliente_id !== clienteId) {
    throw createError({ statusCode: 403, statusMessage: 'Acesso negado' });
  }

  if (sessao.status === 'aguardando_fotos') {
    throw createError({ statusCode: 403, statusMessage: 'Fotos ainda não disponíveis' });
  }

  // Se há uma leva de seleção aberta, exibe apenas as fotos ainda não entregues
  const loteAtivo = await svc.getActiveLote(sessaoId);
  if (loteAtivo) {
    return svc.fotosDisponiveis(sessaoId);
  }

  return svc.listFotos(sessaoId);
});
