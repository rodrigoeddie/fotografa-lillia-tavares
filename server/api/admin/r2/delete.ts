import { defineEventHandler, readBody, createError } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { deleteR2Object } from '~/server/utils/r2-presign';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);

  const body = await readBody(event);
  const { key } = body ?? {};
  if (!key || typeof key !== 'string') throw createError({ statusCode: 400, statusMessage: 'key é obrigatório' });

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw createError({ statusCode: 500, statusMessage: 'R2 não configurado' });
  }

  await deleteR2Object({ accountId, accessKeyId, secretAccessKey, bucketName, key });

  return { ok: true };
});
