import { defineEventHandler, readBody, createError } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { generateR2PutPresignedUrl } from '~/server/utils/r2-presign';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);

  const body = await readBody(event);
  const { filename, content_type } = body ?? {};

  if (!filename) throw createError({ statusCode: 400, statusMessage: 'filename é obrigatório' });

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw createError({ statusCode: 500, statusMessage: 'R2 não configurado' });
  }

  // Chave no R2: entregas/{timestamp}/{filename} para evitar colisões
  const key = `entregas/${Date.now()}/${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  const url = await generateR2PutPresignedUrl({
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    key,
    contentType: content_type || 'application/zip',
    expiresIn: 7200, // 2 horas (arquivos grandes podem demorar)
  });

  return { url, key };
});
