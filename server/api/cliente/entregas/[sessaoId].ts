import { defineEventHandler, createError, getRouterParam } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import { getDB, dbGetSessaoById, dbGetEntregaBySessao } from '~/server/utils/d1-client';
import { generateR2GetPresignedUrl } from '~/server/utils/r2-presign';

export default defineEventHandler(async (event) => {
  const clienteId = await getAuthenticatedCliente(event);
  const db = getDB(event);
  const sessaoId = Number(getRouterParam(event, 'sessaoId'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const sessao = await dbGetSessaoById(db, sessaoId);
  if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });
  if (sessao.cliente_id !== clienteId) throw createError({ statusCode: 403, statusMessage: 'Acesso negado' });

  const entrega = await dbGetEntregaBySessao(db, sessaoId);
  if (!entrega || !entrega.ativo || !entrega.r2_key) {
    throw createError({ statusCode: 404, statusMessage: 'Entrega não disponível' });
  }

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw createError({ statusCode: 500, statusMessage: 'R2 não configurado' });
  }

  const downloadUrl = await generateR2GetPresignedUrl({
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    key: entrega.r2_key,
    expiresIn: 24 * 3600, // 24 horas
  });

  return {
    cliente_nome: sessao.cliente_nome,
    nome_sessao: sessao.nome_sessao,
    bg_image_id: entrega.bg_image_id,
    mensagem: entrega.mensagem,
    nome_arquivo: entrega.nome_arquivo,
    download_url: downloadUrl,
  };
});
