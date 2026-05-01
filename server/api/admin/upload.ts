import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);

  const parts = await readMultipartFormData(event);
  if (!parts || parts.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
  }

  const filePart = parts.find(p => p.name === 'file');
  if (!filePart || !filePart.data) {
    throw createError({ statusCode: 400, statusMessage: 'File field is required' });
  }

  const accountId = (event.context as any).cloudflare?.env?.CLOUDFLARE_ACCOUNT_ID
    ?? process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiKey = (event.context as any).cloudflare?.env?.CLOUDFLARE_API_KEY
    ?? process.env.CLOUDFLARE_API_KEY;

  if (!accountId || !apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Cloudflare credentials not configured' });
  }

  const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;
  const formData = new FormData();
  const blob = new Blob([filePart.data], { type: filePart.type || 'image/jpeg' });
  formData.append('file', blob, filePart.filename || 'image.jpg');

  const response = await fetch(cfUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  const result = await response.json() as any;

  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'Cloudflare upload failed', data: result.errors });
  }

  return { id: result.result.id, filename: result.result.filename };
});
