import { defineEventHandler, createError, getRouterParam, getQuery } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { SessaoService } from '~/server/services/SessaoService';
import { calcExtras } from '~/server/utils/extras-calc';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new SessaoService(getOrm(event));
  const sessaoId = Number(getRouterParam(event, 'id'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const sessao = await svc.getById(sessaoId);
  if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

  const query = getQuery(event);
  let loteId = query.lote_id ? Number(query.lote_id) : null;

  if (!loteId) {
    const lotes = await svc.listLotes(sessaoId);
    if (!lotes.length) {
      return {
        sessao, lotes: [], fotos: [], total: 0, selecionadas: 0,
        extras: 0, preco_foto_extra: sessao.preco_foto_extra,
        desconto_percent: 0, valor_extras_bruto: 0, valor_extras: 0,
      };
    }
    loteId = lotes[lotes.length - 1]!.id;
  }

  const lote = await svc.getLoteById(loteId);
  if (!lote || lote.sessao_id !== sessaoId) throw createError({ statusCode: 404, statusMessage: 'Lote não encontrado' });

  const fotos = await svc.getSelecoesByLote(loteId);
  const todosLotes = await svc.listLotes(sessaoId);
  const selecionadas = fotos.filter((r) => r.selecionada === 1);

  const { extras, descontoPercent, valorExtrasBruto, valorExtras } = calcExtras(
    selecionadas.length, sessao.fotos_incluidas, sessao.preco_foto_extra,
  );

  return {
    sessao,
    lote,
    lotes: todosLotes,
    fotos,
    total: fotos.length,
    selecionadas: selecionadas.length,
    extras,
    preco_foto_extra: sessao.preco_foto_extra,
    desconto_percent: descontoPercent,
    valor_extras_bruto: valorExtrasBruto,
    valor_extras: valorExtras,
  };
});
