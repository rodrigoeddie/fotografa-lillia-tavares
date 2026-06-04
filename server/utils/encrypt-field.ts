// AES-GCM (256-bit) via Web Crypto API — usado para armazenar senhas de acesso do cliente.
// Formato armazenado: "<iv_base64>.<ciphertext_base64>"
// Chave configurada em FIELD_ENCRYPT_KEY (32 bytes base64, gerado com: openssl rand -base64 32)

function bufToB64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''));
}

function b64ToBuf(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function importKey(keyB64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', b64ToBuf(keyB64), 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function encryptField(plain: string, keyB64: string): Promise<string> {
  const key = await importKey(keyB64);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plain));
  return `${bufToB64(iv)}.${bufToB64(ct)}`;
}

export async function decryptField(stored: string, keyB64: string): Promise<string | null> {
  try {
    const dot = stored.indexOf('.');
    if (dot === -1) return null;
    const key = await importKey(keyB64);
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: b64ToBuf(stored.slice(0, dot)) },
      key,
      b64ToBuf(stored.slice(dot + 1)),
    );
    return new TextDecoder().decode(plain);
  } catch {
    return null;
  }
}
