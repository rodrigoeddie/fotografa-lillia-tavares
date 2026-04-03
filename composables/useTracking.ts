/**
 * useTracking — composable global para rastreamento de eventos via Google Analytics.
 *
 * Uso programático:
 *   const { trackEvent } = useTracking()
 *   trackEvent('nome-do-evento', { screen_name: 'Página X' })
 *
 * Uso declarativo (data-attributes no HTML):
 *   <button data-track-event="cta-whatsapp" data-track-screen="LP Corporativo">...</button>
 *   O plugin plugins/tracking.client.ts cuida dos cliques automaticamente.
 *
 * Atributos disponíveis:
 *   data-track-event   — nome do evento GA (obrigatório para tracking automático)
 *   data-track-screen  — sobrescreve o screen_name (opcional, padrão: nome da rota atual)
 *   data-track-params  — JSON com parâmetros extras (opcional), ex: '{"category":"ensaio"}'
 */
export const useTracking = () => {
  const route = useRoute();

  const trackEvent = (
    eventName: string,
    params?: Record<string, unknown>
  ) => {
    // gtag é definido pelo snippet inline no head; dataLayer.push é encaminhado ao Partytown worker
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      ;(window as any).gtag('event', eventName, {
        app_name: 'Site',
        screen_name: String(route.name || route.path),
        ...params,
      });
    }
  };

  return { trackEvent };
};
