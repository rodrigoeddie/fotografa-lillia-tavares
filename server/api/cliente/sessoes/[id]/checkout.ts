import { defineEventHandler, readBody, createError, getMethod, getRouterParam, getQuery } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { SessaoService } from '~/server/services/SessaoService';
import { PagamentoService } from '~/server/services/PagamentoService';
import { ProdutoService } from '~/server/services/ProdutoService';

function calcExtras(selecionadas: number, fotosIncluidas: number, precoFotoExtra: number) {
  const extras = Math.max(0, selecionadas - fotosIncluidas);
  const descontoPercent = Math.floor(extras / 5) * 5;
  const bruto = extras * precoFotoExtra;
  const valor = bruto * (1 - descontoPercent / 100);
  return { extras, descontoPercent, valorExtrasBruto: bruto, valorExtras: valor };
}

export default defineEventHandler(async (event) => {
  const clienteId = await getAuthenticatedCliente(event);
  const orm = getOrm(event);
  const svc = new SessaoService(orm);
  const pagSvc = new PagamentoService(orm);
  const sessaoId = Number(getRouterParam(event, 'id'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const sessao = await svc.getById(sessaoId);
  if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });
  if (sessao.cliente_id !== clienteId) throw createError({ statusCode: 403, statusMessage: 'Acesso negado' });

  const siteUrl = process.env.SITE_URL || 'https://fotografalilliatavares.com.br';
  const apiKey = process.env.SUMUP_API_KEY ?? '';
  const merchantCode = process.env.SUMUP_MERCHANT_CODE ?? '';

  /* ── GET: informações de pagamento para o lote ─────────────── */
  if (getMethod(event) === 'GET') {
    const query = getQuery(event);
    const loteId = Number(query.lote_id);
    if (!loteId) throw createError({ statusCode: 400, statusMessage: 'lote_id obrigatório' });

    const lote = await svc.getLoteById(loteId);
    if (!lote || lote.sessao_id !== sessaoId) throw createError({ statusCode: 404, statusMessage: 'Lote não encontrado' });

    const fotos = await svc.getSelecoesByLote(loteId);
    const selecionadas = fotos.filter((f) => f.selecionada === 1).length;
    const { extras, descontoPercent, valorExtrasBruto, valorExtras } = calcExtras(
      selecionadas, sessao.fotos_incluidas, sessao.preco_foto_extra,
    );

    const valorRestante = lote.numero_lote === 1 ? (sessao.valor_restante_pacote ?? 0) : 0;
    const valorTotal = valorExtras + valorRestante;

    /* Busca num_parcelas do pacote */
    let numParcelas = 1;
    const prodSvc = new ProdutoService(orm);
    const produtos = await prodSvc.list();
    const produto = produtos.find((p) => p.title === sessao.produto_tipo);
    if (produto) {
      const pacotes = await prodSvc.listPacotesByProduto(produto.id);
      numParcelas = pacotes[sessao.pacote_index]?.num_parcelas ?? 1;
    }

    const pagamento = await pagSvc.getByLote(loteId);

    return {
      lote_id: loteId,
      numero_lote: lote.numero_lote,
      selecionadas,
      extras,
      preco_foto_extra: sessao.preco_foto_extra,
      desconto_percent: descontoPercent,
      valor_extras_bruto: valorExtrasBruto,
      valor_extras: valorExtras,
      valor_restante_pacote: valorRestante,
      valor_total: valorTotal,
      num_parcelas: numParcelas,
      pagamento: pagamento ? { status: pagamento.status, criado_em: pagamento.criado_em } : null,
    };
  }

  /* ── POST: criar checkout SumUp ────────────────────────────── */
  if (getMethod(event) === 'POST') {
    if (!apiKey || !merchantCode) {
      throw createError({ statusCode: 503, statusMessage: 'Gateway de pagamento não configurado' });
    }

    const body = await readBody(event);
    const loteId = Number(body?.lote_id);
    if (!loteId) throw createError({ statusCode: 400, statusMessage: 'lote_id obrigatório' });

    const lote = await svc.getLoteById(loteId);
    if (!lote || lote.sessao_id !== sessaoId) throw createError({ statusCode: 404, statusMessage: 'Lote não encontrado' });
    if (lote.status === 'aguardando_selecao') {
      throw createError({ statusCode: 409, statusMessage: 'Finalize a seleção antes de pagar' });
    }

    const fotos = await svc.getSelecoesByLote(loteId);
    const selecionadas = fotos.filter((f) => f.selecionada === 1).length;
    const { valorExtras } = calcExtras(selecionadas, sessao.fotos_incluidas, sessao.preco_foto_extra);
    const valorRestante = lote.numero_lote === 1 ? (sessao.valor_restante_pacote ?? 0) : 0;
    /* Arredonda a 2 casas: a SumUp aceita no máximo 2 decimais e o cálculo de
       desconto com floats pode gerar resíduos (ex.: 451.2500000001). */
    const valorTotal = Math.round((valorExtras + valorRestante) * 100) / 100;

    if (valorTotal <= 0) {
      return { checkout_url: null, valor_total: 0, message: 'Nenhum valor a pagar para este lote.' };
    }

    const reference = `sessao-${sessaoId}-lote-${loteId}-${Date.now()}`;
    /* A SumUp não anexa o checkout_id no retorno; o front guarda o id (devolvido
       abaixo) no sessionStorage e o usa como fallback na página de retorno. */
    const returnUrl = `${siteUrl}/area-cliente/pagamento/retorno?sessao_id=${sessaoId}`;

    const descricao = lote.numero_lote === 1
      ? `Seleção ${sessao.nome_sessao} — extras + saldo do pacote`
      : `Seleção ${sessao.nome_sessao} — fotos extras`;

    const sumupCheckout = await pagSvc.createSumupCheckout({
      apiKey,
      merchantCode,
      amount: valorTotal,
      reference,
      description: descricao,
      returnUrl,
    });

    await pagSvc.create({
      sessaoId,
      loteId,
      sumupCheckoutId: sumupCheckout.id,
      valorCents: Math.round(valorTotal * 100),
      metodo: body?.metodo ?? null,
      descricao,
    });

    return {
      checkout_id: sumupCheckout.id,
      checkout_url: `https://pay.sumup.com/b2c/checkout?q=${sumupCheckout.id}`,
      valor_total: valorTotal,
    };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
