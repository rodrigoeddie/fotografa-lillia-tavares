import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import {
  getDB,
  dbGetSessaoById,
  dbGetSelecoesByLote,
  dbUpsertSelecao,
  dbUpdateSessaoStatus,
  dbGetActiveLoteBySessao,
  dbGetFotosDisponiveis,
  dbUpdateLoteStatus,
  dbCreateLote,
  dbListProdutos,
  dbListPacotesByProduto,
} from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  const clienteId = await getAuthenticatedCliente(event);
  const db = getDB(event);
  const sessaoId = Number(getRouterParam(event, 'id'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const sessao = await dbGetSessaoById(db, sessaoId);
  if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });
  if (sessao.cliente_id !== clienteId) throw createError({ statusCode: 403, statusMessage: 'Acesso negado' });

  if (getMethod(event) === 'GET') {
    let lote = await dbGetActiveLoteBySessao(db, sessaoId);

    // Resolve nome do pacote
    const { results: todosProdutos } = await dbListProdutos(db);
    const produto = todosProdutos.find((p) => p.title === sessao.produto_tipo);
    let pacote_titulo: string | null = null;
    if (produto) {
      const { results: pacotes } = await dbListPacotesByProduto(db, produto.id);
      pacote_titulo = pacotes[sessao.pacote_index]?.title ?? null;
    }

    // Se não há lote ativo mas a sessão já tem fotos disponíveis, cria o lote automaticamente
    if (!lote && sessao.status !== 'aguardando_fotos') {
      const result = await dbCreateLote(db, sessaoId);
      const loteId = result.meta.last_row_id as number;
      lote = await dbGetActiveLoteBySessao(db, sessaoId);
    }

    if (!lote) {
      return {
        sessao: {
          id: sessao.id,
          nome_sessao: sessao.nome_sessao,
          produto_tipo: sessao.produto_tipo,
          pacote_titulo,
          fotos_incluidas: sessao.fotos_incluidas,
          preco_foto_extra: sessao.preco_foto_extra,
          status: sessao.status,
        },
        lote: null,
        fotos: [],
        selecionadas: 0,
        extras: 0,
        valor_extras: 0,
      };
    }

    const { results } = await dbGetSelecoesByLote(db, lote.id);
    const selecionadas = results.filter((r) => r.selecionada === 1);
    const extrasCount = Math.max(0, selecionadas.length - sessao.fotos_incluidas);

    return {
      sessao: {
        id: sessao.id,
        nome_sessao: sessao.nome_sessao,
        produto_tipo: sessao.produto_tipo,
        pacote_titulo,
        fotos_incluidas: sessao.fotos_incluidas,
        preco_foto_extra: sessao.preco_foto_extra,
        status: sessao.status,
      },
      lote,
      fotos: results,
      selecionadas: selecionadas.length,
      extras: extrasCount,
      valor_extras: extrasCount * sessao.preco_foto_extra,
    };
  }

  if (getMethod(event) === 'POST') {
    if (sessao.status === 'aguardando_fotos') {
      throw createError({ statusCode: 403, statusMessage: 'Fotos ainda não disponíveis' });
    }

    const lote = await dbGetActiveLoteBySessao(db, sessaoId);
    if (!lote) {
      throw createError({ statusCode: 409, statusMessage: 'Nenhuma leva de seleção aberta no momento' });
    }

    const body = await readBody(event);
    const { selecoes, finalizar } = body ?? {};

    if (!Array.isArray(selecoes)) {
      throw createError({ statusCode: 400, statusMessage: 'selecoes deve ser um array' });
    }

    // Apenas fotos disponíveis (não entregues) são aceitas
    const { results: fotosDisponiveis } = await dbGetFotosDisponiveis(db, sessaoId);
    const fotoIdsValidos = new Set(fotosDisponiveis.map((f) => f.id));

    for (const sel of selecoes) {
      if (!fotoIdsValidos.has(Number(sel.foto_id))) continue;
      await dbUpsertSelecao(db, lote.id, Number(sel.foto_id), Boolean(sel.selecionada), sel.comentario ?? '');
    }

    if (finalizar) {
      await dbUpdateLoteStatus(db, lote.id, 'selecao_concluida');
      await dbUpdateSessaoStatus(db, sessaoId, 'selecao_concluida');
    }

    return { success: true, finalizado: !!finalizar };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});

