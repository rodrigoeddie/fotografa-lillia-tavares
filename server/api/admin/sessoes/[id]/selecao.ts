import { defineEventHandler, createError, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbGetSessaoById, dbGetSelecoesBySessao } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);
  const sessaoId = Number(getRouterParam(event, 'id'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const sessao = await dbGetSessaoById(db, sessaoId);
  if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

  const { results } = await dbGetSelecoesBySessao(db, sessaoId);

  const selecionadas = results.filter((r) => r.selecionada === 1);

  return {
    sessao,
    fotos: results,
    total: results.length,
    selecionadas: selecionadas.length,
    extras: Math.max(0, selecionadas.length - sessao.fotos_incluidas),
    valor_extras:
      Math.max(0, selecionadas.length - sessao.fotos_incluidas) * sessao.preco_foto_extra,
  };
});
