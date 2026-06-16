import { defineEventHandler, createError, getQuery } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { SessaoService } from '~/server/services/SessaoService';
import { PagamentoService } from '~/server/services/PagamentoService';

export default defineEventHandler(async (event) => {
  const clienteId = await getAuthenticatedCliente(event);
  const orm = getOrm(event);
  const pagSvc = new PagamentoService(orm);
  const sessSvc = new SessaoService(orm);

  const { checkout_id } = getQuery(event);
  if (!checkout_id || typeof checkout_id !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'checkout_id obrigatório' });
  }

  const pagamento = await pagSvc.getByCheckoutId(checkout_id);
  if (!pagamento) throw createError({ statusCode: 404, statusMessage: 'Pagamento não encontrado' });

  /* Valida que o pagamento pertence ao cliente autenticado */
  const sessao = await sessSvc.getById(pagamento.sessao_id);
  if (!sessao || sessao.cliente_id !== clienteId) {
    throw createError({ statusCode: 403, statusMessage: 'Acesso negado' });
  }

  /* Se já estiver pago, retorna direto */
  if (pagamento.status === 'pago') {
    return { status: 'pago', sessao_id: pagamento.sessao_id };
  }

  /* Consulta status atualizado na SumUp */
  const apiKey = process.env.SUMUP_API_KEY;
  if (apiKey) {
    try {
      const sumup = await pagSvc.fetchSumupCheckoutStatus(apiKey, checkout_id);
      const status = sumup.status?.toUpperCase();

      if (status === 'PAID') {
        /* Defesa em profundidade: confere se o valor pago bate com o esperado.
           Se houver divergência (config de preço/moeda errada), NÃO marca como pago —
           deixa pendente para revisão manual. Só checa quando a SumUp informa amount. */
        const pagoCents = sumup.amount != null ? Math.round(sumup.amount * 100) : null;
        const moedaOk = !sumup.currency || sumup.currency.toUpperCase() === 'BRL';
        if ((pagoCents != null && pagoCents !== pagamento.valor_cents) || !moedaOk) {
          console.error(
            `[pagamento] divergência de valor checkout=${checkout_id} ` +
            `esperado=${pagamento.valor_cents} pago=${pagoCents} moeda=${sumup.currency}`,
          );
          return { status: 'pendente', sessao_id: pagamento.sessao_id };
        }
        const txId = sumup.transactions?.[0]?.id;
        await pagSvc.updateStatus(checkout_id, 'pago', txId);
        return { status: 'pago', sessao_id: pagamento.sessao_id };
      }
      if (status === 'FAILED' || status === 'CANCELLED') {
        await pagSvc.updateStatus(checkout_id, 'cancelado');
        return { status: 'cancelado', sessao_id: pagamento.sessao_id };
      }
    } catch {
      /* Continua com status local se SumUp estiver indisponível */
    }
  }

  return { status: pagamento.status, sessao_id: pagamento.sessao_id };
});
