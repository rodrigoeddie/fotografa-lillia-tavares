
import { defineEventHandler, readBody } from 'h3';
import FormData from 'form-data';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token'); // Recupera o token do cookie

  if (!token || token !== 'your-auth-token') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  const body = await readBody(event);
  const { file, filename } = body;

  if (!file || !filename) {
    throw createError({ statusCode: 400, statusMessage: 'File and filename are required' });
  }

  const form = new FormData();
  form.append('file', file, filename);

  try {
    const response = await $fetch(process.env.CLOUDFLARE_IMAGES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
      body: form,
    });

    return response;
  } catch (error) {
    return { error: 'Failed to upload image', details: error };
  }
});
