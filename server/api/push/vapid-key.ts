import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  const vapidPublicKey = (event.context as any).cloudflare?.env?.VAPID_PUBLIC_KEY ?? null;
  return { vapidPublicKey };
});
