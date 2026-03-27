import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { password } = body;

  if (!password) {
    throw createError({ statusCode: 400, statusMessage: 'Password is required' });
  }

  const expectedHash = process.env.KEYCMS;
  if (!expectedHash) {
    throw createError({ statusCode: 500, statusMessage: 'CMS key not configured' });
  }

  // SHA-512 hash using Web Crypto API (works on Cloudflare Workers + Node)
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  if (hashHex === expectedHash) {
    return { success: true, token: hashHex.slice(0, 64) };
  }

  throw createError({ statusCode: 401, statusMessage: 'Senha incorreta' });
});
