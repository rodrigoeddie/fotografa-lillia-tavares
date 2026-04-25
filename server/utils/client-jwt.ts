/**
 * JWT HS256 usando Web Crypto API (funciona em Cloudflare Workers sem dependências externas).
 */

const ALGORITHM = 'HS256';
const EXPIRY_SECONDS = 30 * 24 * 60 * 60; // 30 dias

function base64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlEncode(obj: object): string {
  return base64url(new TextEncoder().encode(JSON.stringify(obj)));
}

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  return atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function signClientToken(clienteId: number, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64urlEncode({ alg: ALGORITHM, typ: 'JWT' });
  const payload = base64urlEncode({ sub: String(clienteId), iat: now, exp: now + EXPIRY_SECONDS });
  const signingInput = `${header}.${payload}`;
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput));
  return `${signingInput}.${base64url(signature)}`;
}

export async function verifyClientToken(token: string, secret: string): Promise<number | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts as [string, string, string];
    const signingInput = `${headerB64}.${payloadB64}`;
    const key = await hmacKey(secret);
    const sigBytes = Uint8Array.from(base64urlDecode(sigB64), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(signingInput));
    if (!valid) return null;
    const payload = JSON.parse(base64urlDecode(payloadB64));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return Number(payload.sub);
  } catch {
    return null;
  }
}
