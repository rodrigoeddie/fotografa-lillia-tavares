import type { H3Event } from 'h3';

export async function deleteCfImages(event: H3Event, imageIds: (string | null | undefined)[]): Promise<void> {
  const ids = imageIds.filter(Boolean) as string[];
  if (!ids.length) return;

  const accountId = (event.context as any).cloudflare?.env?.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiKey = (event.context as any).cloudflare?.env?.CLOUDFLARE_API_KEY || process.env.CLOUDFLARE_API_KEY;
  if (!accountId || !apiKey) return;

  await Promise.all(
    ids.map((id) =>
      fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${apiKey}` } },
      ).catch(() => {}),
    ),
  );
}
