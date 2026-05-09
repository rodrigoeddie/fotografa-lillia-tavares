/**
 * VAPID Web Push via crypto.subtle — compatível com Cloudflare Workers
 *
 * Gere as chaves uma vez com: npx web-push generate-vapid-keys
 * Depois: wrangler secret put VAPID_PUBLIC_KEY && wrangler secret put VAPID_PRIVATE_KEY
 */

import type { H3Event } from 'h3';
import type { ORM } from './d1-client';
import { NotificacaoService } from '~/server/services/NotificacaoService';

// ─── Helpers VAPID ────────────────────────────────────────────────────────────

function base64UrlDecode(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  return new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function getVapidPrivateKey(privateKeyB64url: string): Promise<CryptoKey> {
  const keyData = base64UrlDecode(privateKeyB64url);
  return crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  );
}

async function signVapidJwt(
  audience: string,
  subject: string,
  privateKeyB64url: string,
): Promise<string> {
  const header = base64UrlEncode(new TextEncoder().encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify({ aud: audience, exp: now + 12 * 3600, sub: subject })),
  );
  const signingInput = `${header}.${payload}`;
  const privateKey = await getVapidPrivateKey(privateKeyB64url);
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    privateKey,
    new TextEncoder().encode(signingInput),
  );
  return `${signingInput}.${base64UrlEncode(signature)}`;
}

// ─── Encrypt push payload (AES-GCM / ECDH) ────────────────────────────────────

async function encryptPushPayload(
  payload: string,
  p256dhB64: string,
  authB64: string,
): Promise<{ ciphertext: ArrayBuffer; salt: Uint8Array; serverPublicKey: ArrayBuffer }> {
  const p256dh = base64UrlDecode(p256dhB64);
  const authBytes = base64UrlDecode(authB64);

  const clientPublicKey = await crypto.subtle.importKey(
    'raw', p256dh, { name: 'ECDH', namedCurve: 'P-256' }, true, [],
  );

  const serverKeyPair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const serverPublicKey = await crypto.subtle.exportKey('raw', serverKeyPair.publicKey);

  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: clientPublicKey },
    serverKeyPair.privateKey,
    256,
  );

  const salt = crypto.getRandomValues(new Uint8Array(16));

  // HKDF for auth secret
  const authInfo = new TextEncoder().encode('Content-Encoding: auth\0');
  const prk = await crypto.subtle.importKey('raw', sharedSecret, { name: 'HKDF' }, false, ['deriveBits']);
  const authSecret = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: authBytes, info: authInfo },
    prk,
    256,
  );

  // HKDF for content encryption key and nonce
  const serverPubKeyRaw = new Uint8Array(serverPublicKey);
  const context = new Uint8Array([
    ...new TextEncoder().encode('P-256\0'),
    0, 65, ...p256dh,
    0, 65, ...serverPubKeyRaw,
  ]);
  const keyInfo = new Uint8Array([...new TextEncoder().encode('Content-Encoding: aesgcm\0'), ...context]);
  const nonceInfo = new Uint8Array([...new TextEncoder().encode('Content-Encoding: nonce\0'), ...context]);

  const hkdfKey = await crypto.subtle.importKey('raw', authSecret, { name: 'HKDF' }, false, ['deriveBits']);
  const [keyBits, nonceBits] = await Promise.all([
    crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info: keyInfo }, hkdfKey, 128),
    crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info: nonceInfo }, hkdfKey, 96),
  ]);

  const aesKey = await crypto.subtle.importKey('raw', keyBits, { name: 'AES-GCM' }, false, ['encrypt']);

  const encoded = new TextEncoder().encode(payload);
  const padded = new Uint8Array(encoded.length + 2);
  padded.set(encoded, 2); // 2-byte padding length prefix = 0

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonceBits },
    aesKey,
    padded,
  );

  return { ciphertext, salt, serverPublicKey };
}

// ─── Send a push notification to a single subscription ────────────────────────

export async function sendPushToSubscriptionRaw(
  sub: { endpoint: string; p256dh: string; auth: string },
  title: string,
  body: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string,
): Promise<boolean> {
  try {
    const url = new URL(sub.endpoint);
    const audience = `${url.protocol}//${url.host}`;

    const jwt = await signVapidJwt(audience, vapidSubject, vapidPrivateKey);

    const payload = JSON.stringify({ title, body, icon: '/favicon.ico' });
    const { ciphertext, salt, serverPublicKey } = await encryptPushPayload(payload, sub.p256dh, sub.auth);

    const res = await fetch(sub.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `vapid t=${jwt},k=${vapidPublicKey}`,
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aesgcm',
        Encryption: `salt=${base64UrlEncode(salt.buffer)}`,
        'Crypto-Key': `dh=${base64UrlEncode(serverPublicKey)};p256ecdsa=${vapidPublicKey}`,
        TTL: '86400',
      },
      body: ciphertext,
    });

    // 404/410 = subscription expired
    return res.status < 400 || (res.status !== 404 && res.status !== 410);
  } catch {
    return false;
  }
}

// ─── Public helper ─────────────────────────────────────────────────────────────

export async function sendPushNotifications(
  event: H3Event,
  db: ORM,
  tipo: 'admin' | 'cliente',
  destinatarioId: number | null,
  title: string,
  body: string,
): Promise<void> {
  const config = (event.context as any).cloudflare?.env;
  const vapidPublicKey: string | undefined = config?.VAPID_PUBLIC_KEY;
  const vapidPrivateKey: string | undefined = config?.VAPID_PRIVATE_KEY;
  const vapidSubject: string = config?.VAPID_SUBJECT ?? 'mailto:contato@fotografalilliatavares.com.br';

  if (!vapidPublicKey || !vapidPrivateKey) return; // VAPID not configured yet

  const svc = new NotificacaoService(db);
  const subs = await svc.listPushSubscriptions(tipo, destinatarioId);

  await Promise.all(
    subs.map(async (sub) => {
      const ok = await sendPushToSubscriptionRaw(sub, title, body, vapidPublicKey, vapidPrivateKey, vapidSubject);
      if (!ok) {
        await svc.deletePushSubscription(sub.endpoint);
      }
    }),
  );
}
