/**
 * Registra um clique de bloco do linktree. Usa navigator.sendBeacon (sobrevive
 * à navegação) com fallback para fetch keepalive. No-op no servidor.
 */
export function trackLinktreeClick(chave: string) {
  if (import.meta.server || !chave) return;
  const url = '/api/public/linktree/click';
  const payload = JSON.stringify({ chave });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
      return;
    }
  } catch { /* fallback abaixo */ }
  fetch(url, { method: 'POST', body: payload, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => {});
}
