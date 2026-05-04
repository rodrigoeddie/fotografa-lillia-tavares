/**
 * useNotifications
 *
 * Composable para notificações in-app + Web Push.
 * Usado em admin e área do cliente.
 *
 * @param tipo 'admin' | 'cliente'
 * @param fetchFn função autenticada para fazer fetch (adminFetch ou $fetch para cliente)
 */

export interface Notificacao {
  id: number;
  tipo: string;
  destinatario_id: number | null;
  titulo: string;
  mensagem: string | null;
  lida: number;
  criado_em: string;
}

export function useNotifications(tipo: 'admin' | 'cliente', fetchFn?: (url: string, opts?: any) => Promise<any>) {
  const notificacoes = ref<Notificacao[]>([]);
  const unread = ref(0);
  const loading = ref(false);
  const open = ref(false);

  const apiUrl = tipo === 'admin' ? '/api/admin/notificacoes' : '/api/cliente/notificacoes';
  const pushApiUrl = '/api/push/subscribe';

  async function load() {
    loading.value = true;
    try {
      const data = fetchFn ? await fetchFn(apiUrl) : await $fetch<any>(apiUrl);
      notificacoes.value = data.notificacoes ?? [];
      unread.value = data.unread ?? 0;
    } catch {
      // silently fail — notifications are non-critical
    } finally {
      loading.value = false;
    }
  }

  async function markAllRead() {
    try {
      if (fetchFn) await fetchFn(apiUrl, { method: 'POST' });
      else await $fetch<any>(apiUrl, { method: 'POST' });
      notificacoes.value = notificacoes.value.map((n) => ({ ...n, lida: 1 }));
      unread.value = 0;
    } catch {}
  }

  function toggleOpen() {
    open.value = !open.value;
    if (open.value && unread.value > 0) {
      markAllRead();
    }
  }

  // ─── Web Push ──────────────────────────────────────────────────────────────

  async function subscribeWebPush() {
    if (!import.meta.client) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    try {
      const reg = await navigator.serviceWorker.ready;

      // Get VAPID public key
      const config = await $fetch<{ vapidPublicKey?: string }>('/api/push/vapid-key').catch(() => ({}));
      const vapidPublicKey = (config as any).vapidPublicKey;
      if (!vapidPublicKey) return;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(vapidPublicKey) as unknown as ArrayBuffer,
      });

      const json = sub.toJSON();
      const body = {
        endpoint: sub.endpoint,
        p256dh: json.keys?.p256dh ?? '',
        auth: json.keys?.auth ?? '',
      };
      if (fetchFn) await fetchFn(pushApiUrl, { method: 'POST', body });
      else await $fetch<any>(pushApiUrl, { method: 'POST', body });
    } catch {
      // Push subscription failed — non-critical
    }
  }

  async function requestPushPermission() {
    if (!import.meta.client) return false;
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') {
      await subscribeWebPush();
      return true;
    }
    if (Notification.permission === 'denied') return false;

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await subscribeWebPush();
      return true;
    }
    return false;
  }

  return {
    notificacoes,
    unread,
    loading,
    open,
    load,
    markAllRead,
    toggleOpen,
    requestPushPermission,
  };
}

function urlB64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}
