import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import {
  getDB,
  dbGetSessaoById,
  dbGetSelecoesBySessao,
  dbUpsertSelecao,
  dbUpdateSessaoStatus,
  dbListFotosBySessao,
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
    const { results } = await dbGetSelecoesBySessao(db, sessaoId);
    const selecionadas = results.filter((r) => r.selecionada === 1);
    const extras = Math.max(0, selecionadas.length - sessao.fotos_incluidas);

    return {
      sessao: {
        id: sessao.id,
        nome_sessao: sessao.nome_sessao,
        produto_tipo: sessao.produto_tipo,
        fotos_incluidas: sessao.fotos_incluidas,
        preco_foto_extra: sessao.preco_foto_extra,
        status: sessao.status,
      },
      fotos: results,
      selecionadas: selecionadas.length,
      extras,
      valor_extras: extras * sessao.preco_foto_extra,
    };
  }

  if (getMethod(event) === 'POST') {
    // Impede nova seleção se já concluída
    if (sessao.status === 'selecao_concluida' || sessao.status === 'entregue') {
      throw createError({ statusCode: 409, statusMessage: 'Seleção já finalizada' });
    }
    if (sessao.status === 'aguardando_fotos') {
      throw createError({ statusCode: 403, statusMessage: 'Fotos ainda não disponíveis' });
    }

    const body = await readBody(event);
    const { selecoes, finalizar } = body ?? {};

    if (!Array.isArray(selecoes)) {
      throw createError({ statusCode: 400, statusMessage: 'selecoes deve ser um array' });
    }

    // Valida que as fotos pertencem à sessão
    const { results: fotosValidas } = await dbListFotosBySessao(db, sessaoId);
    const fotoIdsValidos = new Set(fotosValidas.map((f) => f.id));

    for (const sel of selecoes) {
      if (!fotoIdsValidos.has(Number(sel.foto_id))) continue; // ignora foto_id inválido
      await dbUpsertSelecao(db, sessaoId, Number(sel.foto_id), Boolean(sel.selecionada), sel.comentario ?? '');
    }

    if (finalizar) {
      await dbUpdateSessaoStatus(db, sessaoId, 'selecao_concluida');
    }

    return { success: true, finalizado: !!finalizar };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
