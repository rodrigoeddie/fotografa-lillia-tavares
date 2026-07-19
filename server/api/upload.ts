import { defineEventHandler, createError, getHeader, getRequestWebStream } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';

/**
 * Upload para Cloudflare Images.
 *
 * O corpo multipart é repassado por STREAMING direto para a API do CF Images,
 * sem bufferizar/re-encodar no Worker — reparsear + reconstruir o FormData de
 * uma foto grande estoura o limite de CPU/memória do Worker (Error 1102).
 * A validação de tamanho/tipo fica a cargo do próprio CF Images.
 */
export default defineEventHandler(async (event) => {
  await validateAdminToken(event);

  const contentType = getHeader(event, 'content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    throw createError({ statusCode: 400, statusMessage: 'Esperado multipart/form-data' });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiKey = process.env.CLOUDFLARE_API_KEY;
  if (!accountId || !apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Cloudflare credentials not configured' });
  }

  const body = getRequestWebStream(event);
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Corpo da requisição ausente' });
  }

  const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'content-type': contentType,
  };
  const contentLength = getHeader(event, 'content-length');
  if (contentLength) headers['content-length'] = contentLength;

  try {
    const response = await fetch(cfUrl, {
      method: 'POST',
      headers,
      body,
      // streaming de request body exige duplex 'half'
      duplex: 'half',
    } as RequestInit);

    const result = await response.json() as any;

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
