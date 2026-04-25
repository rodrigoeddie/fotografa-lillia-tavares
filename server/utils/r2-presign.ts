/**
 * Gera presigned URL para PUT direto no R2 via S3 API compatível.
 * Implementa AWS Signature V4 com Web Crypto API (sem dependências externas).
 */

const REGION = 'auto'; // R2 usa 'auto'
const SERVICE = 's3';

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256(data: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return toHex(buf);
}

async function hmacSha256(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
}

async function deriveSigningKey(
  secretKey: string,
  dateStr: string,
  region: string,
  service: string,
): Promise<ArrayBuffer> {
  const kDate = await hmacSha256(new TextEncoder().encode(`AWS4${secretKey}`), dateStr);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  return hmacSha256(kService, 'aws4_request');
}

export interface R2PresignOptions {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  key: string;
  contentType?: string;
  expiresIn?: number; // segundos, default 3600
}

export async function generateR2PutPresignedUrl(opts: R2PresignOptions): Promise<string> {
  const {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    key,
    contentType = 'application/octet-stream',
    expiresIn = 3600,
  } = opts;

  const host = `${accountId}.r2.cloudflarestorage.com`;
  const endpoint = `https://${host}`;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const datetimeStr = now.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'; // YYYYMMDDTHHmmssZ

  const credentialScope = `${dateStr}/${REGION}/${SERVICE}/aws4_request`;
  const credential = `${accessKeyId}/${credentialScope}`;

  // Canonical request
  const canonicalUri = `/${bucketName}/${key.replace(/^\//, '')}`;
  const signedHeaders = 'host';

  const queryParams = new URLSearchParams({
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': credential,
    'X-Amz-Date': datetimeStr,
    'X-Amz-Expires': String(expiresIn),
    'X-Amz-SignedHeaders': signedHeaders,
  });
  // URLSearchParams sorts alphabetically which is required for canonical query string
  queryParams.sort();
  const canonicalQueryString = queryParams.toString();

  const canonicalHeaders = `host:${host}\n`;
  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    'UNSIGNED-PAYLOAD',
  ].join('\n');

  const requestHash = await sha256(canonicalRequest);
  const stringToSign = ['AWS4-HMAC-SHA256', datetimeStr, credentialScope, requestHash].join('\n');

  const signingKey = await deriveSigningKey(secretAccessKey, dateStr, REGION, SERVICE);
  const signatureBuffer = await hmacSha256(signingKey, stringToSign);
  const signature = toHex(signatureBuffer);

  queryParams.set('X-Amz-Signature', signature);

  return `${endpoint}${canonicalUri}?${queryParams.toString()}`;
}

export async function generateR2GetPresignedUrl(opts: R2PresignOptions): Promise<string> {
  const {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    key,
    expiresIn = 86400, // 24 horas default para download
  } = opts;

  const host = `${accountId}.r2.cloudflarestorage.com`;
  const endpoint = `https://${host}`;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const datetimeStr = now.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';

  const credentialScope = `${dateStr}/${REGION}/${SERVICE}/aws4_request`;
  const credential = `${accessKeyId}/${credentialScope}`;

  const canonicalUri = `/${bucketName}/${key.replace(/^\//, '')}`;
  const signedHeaders = 'host';

  const queryParams = new URLSearchParams({
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': credential,
    'X-Amz-Date': datetimeStr,
    'X-Amz-Expires': String(expiresIn),
    'X-Amz-SignedHeaders': signedHeaders,
  });
  queryParams.sort();
  const canonicalQueryString = queryParams.toString();

  const canonicalHeaders = `host:${host}\n`;
  const canonicalRequest = [
    'GET',
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    'UNSIGNED-PAYLOAD',
  ].join('\n');

  const requestHash = await sha256(canonicalRequest);
  const stringToSign = ['AWS4-HMAC-SHA256', datetimeStr, credentialScope, requestHash].join('\n');

  const signingKey = await deriveSigningKey(secretAccessKey, dateStr, REGION, SERVICE);
  const signatureBuffer = await hmacSha256(signingKey, stringToSign);
  const signature = toHex(signatureBuffer);

  queryParams.set('X-Amz-Signature', signature);

  return `${endpoint}${canonicalUri}?${queryParams.toString()}`;
}

export async function deleteR2Object(opts: Omit<R2PresignOptions, 'contentType' | 'expiresIn'>): Promise<void> {
  const { accountId, accessKeyId, secretAccessKey, bucketName, key } = opts;

  const host = `${accountId}.r2.cloudflarestorage.com`;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const datetimeStr = now.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';

  const credentialScope = `${dateStr}/${REGION}/${SERVICE}/aws4_request`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
  const payloadHash = await sha256('');

  const canonicalUri = `/${bucketName}/${key.replace(/^\//, '')}`;
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${datetimeStr}\n`;
  const canonicalRequest = ['DELETE', canonicalUri, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');
  const requestHash = await sha256(canonicalRequest);
  const stringToSign = ['AWS4-HMAC-SHA256', datetimeStr, credentialScope, requestHash].join('\n');

  const signingKey = await deriveSigningKey(secretAccessKey, dateStr, REGION, SERVICE);
  const signatureBuffer = await hmacSha256(signingKey, stringToSign);
  const signature = toHex(signatureBuffer);

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`https://${host}${canonicalUri}`, {
    method: 'DELETE',
    headers: {
      Host: host,
      'x-amz-date': datetimeStr,
      'x-amz-content-sha256': payloadHash,
      Authorization: authorization,
    },
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`R2 DELETE failed: ${res.status}`);
  }
}
