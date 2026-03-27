import { defineEventHandler, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const perPage = parseInt(query.per_page as string) || 50;

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiKey = process.env.CLOUDFLARE_API_KEY;

  if (!accountId || !apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Cloudflare credentials not configured' });
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cloudflare API error',
        data: result.errors,
      });
    }

    const images = (result.result?.images ?? []);

    return {
      images: images.map((img: any) => ({
        id: img.id,
        filename: img.filename || '',
        uploaded: img.uploaded,
        variants: img.variants || [],
      })),
      count: result.result_info?.count ?? images.length,
      total_count: result.result_info?.total_count ?? images.length,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to list images',
      data: { details: error.message },
    });
  }
});
