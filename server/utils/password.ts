/**
 * PBKDF2-SHA256 password hashing — funciona em Cloudflare Workers e Node.js
 * via Web Crypto API.
 *
 * Parâmetros OWASP 2024: PBKDF2-SHA256, 100 000 iterações, 32 bytes de saída.
 */

const ITERATIONS = 100_000;
const KEY_LENGTH  = 32; // bytes
const HASH        = 'SHA-256';

function b64urlEncode(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function b64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function derive(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: HASH, salt, iterations: ITERATIONS },
    keyMaterial,
    KEY_LENGTH * 8,
  );
}

/** Gera hash PBKDF2 de uma senha. Retorna { hash, salt } em base64url. */
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await derive(password, salt);
  return { hash: b64urlEncode(derived), salt: b64urlEncode(salt.buffer) };
}

/** Verifica senha contra hash e salt armazenados. Comparação em tempo constante. */
export async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  const salt    = b64urlDecode(storedSalt);
  const derived = new Uint8Array(await derive(password, salt));
  const stored  = b64urlDecode(storedHash);

  if (derived.length !== stored.length) return false;

  // Comparação em tempo constante para evitar timing attacks
  let diff = 0;
  for (let i = 0; i < derived.length; i++) {
    diff |= derived[i]! ^ stored[i]!;
  }
  return diff === 0;
}
