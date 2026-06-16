/**
 * JWT HS256 para sessões de admin — 8 horas de expiração.
 * Usa Web Crypto API (Cloudflare Workers + Node.js).
 */

const EXPIRY_SECONDS = 8 * 60 * 60; // 8 horas

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const arr = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...arr))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function b64urlEncode(obj: object): string {
  return b64url(new TextEncoder().encode(JSON.stringify(obj)));
}

function b64urlDecode(str: string): string {
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

export async function signAdminToken(username: string, adminRole: string, secret: string): Promise<string> {
  const now    = Math.floor(Date.now() / 1000);
  const header  = b64urlEncode({ alg: 'HS256', typ: 'JWT' });
  const payload = b64urlEncode({ sub: username, role: 'admin', adminRole, iat: now, exp: now + EXPIRY_SECONDS });
  const input   = `${header}.${payload}`;
  const key     = await hmacKey(secret);
  const sig     = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(input));
  return `${input}.${b64url(sig)}`;
}

/** Retorna { username, adminRole } se o token for válido, null caso contrário. */
export async function verifyAdminToken(token: string, secret: string): Promise<{ username: string; adminRole: string } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts as [string, string, string];

    const key      = await hmacKey(secret);
    const sigBytes = Uint8Array.from(b64urlDecode(sigB64), (c) => c.charCodeAt(0));
    const valid    = await crypto.subtle.verify(
      'HMAC', key, sigBytes,
      new TextEncoder().encode(`${headerB64}.${payloadB64}`),
    );
    if (!valid) return null;

    const payload = JSON.parse(b64urlDecode(payloadB64));
    if (payload.role !== 'admin') return null;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { username: payload.sub as string, adminRole: (payload.adminRole as string) ?? 'editor' };
  } catch {
    return null;
  }
}
