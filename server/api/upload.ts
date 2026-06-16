
import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

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

  if (filePart.data.length > MAX_UPLOAD_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Arquivo excede o limite de 15 MB' });
  }
  if (filePart.type && !ALLOWED_TYPES.includes(filePart.type)) {
    throw createError({ statusCode: 415, statusMessage: 'Tipo de arquivo não permitido' });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiKey = process.env.CLOUDFLARE_API_KEY;

  if (!accountId || !apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Cloudflare credentials not configured' });
  }

  const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;

  const formData = new FormData();
  const blob = new Blob([filePart.data], { type: filePart.type || 'image/jpeg' });
  formData.append('file', blob, filePart.filename || 'image.jpg');

  try {
    const response = await fetch(cfUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cloudflare upload failed',
        data: result.errors,
      });
    }

    return result;
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload image',
      data: { details: error.message },
    });
  }
});
