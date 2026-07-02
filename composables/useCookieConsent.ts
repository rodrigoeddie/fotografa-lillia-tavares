export interface ConsentPrefs {
  analytics: boolean;
  marketing: boolean;
  recording: boolean;
}

interface StoredConsent extends ConsentPrefs {
  date: string;
}

const COOKIE_KEY = 'lgpd_consent';
const VISITOR_KEY = 'lgpd_visitor_id';

/**
 * Fonte única do estado de consentimento LGPD.
 *
 * - `consent` é null até o usuário decidir (nenhum script não-essencial pode carregar).
 * - `save()` persiste no localStorage, registra a escolha no D1 (trilha de auditoria)
 *   e, em caso de revogação, limpa cookies de tracking e recarrega a página para
 *   descarregar os scripts já ativos.
 * - `manage()` reabre o banner (usado na página de privacidade).
 */
export function useCookieConsent() {
  const consent = useState<StoredConsent | null>('lgpd-consent', () => null);
  const manageRequested = useState<boolean>('lgpd-consent-manage', () => false);

  function load() {
    if (import.meta.server) return;
    try {
      const raw = localStorage.getItem(COOKIE_KEY);
      consent.value = raw ? JSON.parse(raw) : null;
    } catch {
      consent.value = null;
    }
  }

  function visitorId(): string {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  }

  async function save(prefs: ConsentPrefs) {
    const previous = consent.value;
    const stored: StoredConsent = { ...prefs, date: new Date().toISOString() };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(stored));
    consent.value = stored;

    await $fetch('/api/public/consent', {
      method: 'POST',
      body: { visitor_id: visitorId(), ...prefs },
    }).catch(() => { /* auditoria é best-effort — não bloqueia o usuário */ });

    const revoked =
      previous &&
      ((previous.analytics && !prefs.analytics) ||
        (previous.marketing && !prefs.marketing) ||
        (previous.recording && !prefs.recording));

    if (revoked) {
      clearTrackingCookies();
      window.location.reload();
    }
  }

  function manage() {
    manageRequested.value = true;
  }

  return { consent, manageRequested, load, save, manage };
}

/** Remove cookies conhecidos de GA4, Meta Pixel e Smartlook (best-effort). */
function clearTrackingCookies() {
  const bareDomain = window.location.hostname.replace(/^www\./, '');
  const domains = ['', `; domain=${bareDomain}`, `; domain=.${bareDomain}`];
  document.cookie.split(';').forEach((entry) => {
    const name = entry.split('=')[0]?.trim();
    if (!name) return;
    if (/^(_ga|_gid|_gat|_gcl|_fbp|_fbc|smartlook)/i.test(name)) {
      for (const domain of domains) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
      }
    }
  });
}
