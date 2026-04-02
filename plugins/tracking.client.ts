/**
 * Plugin de rastreamento global via data-attributes.
 *
 * Escuta cliques em qualquer elemento com [data-track-event] usando event delegation,
 * evitando a necessidade de @click em cada componente.
 *
 * Atributos suportados:
 *   data-track-event   — nome do evento GA (ex: "cta-whatsapp-hero")
 *   data-track-screen  — sobrescreve o screen_name (opcional)
 *   data-track-params  — JSON com parâmetros extras (opcional)
 *
 * Exemplos de uso no HTML:
 *   <a href="..." data-track-event="cta-whatsapp-lp" data-track-screen="LP Corporativo">
 *   <button data-track-event="envio-form" data-track-params='{"tipo":"corporativo"}'>
 */
export default defineNuxtPlugin(() => {
  const { gtag } = useGtag();
  const router = useRouter();

  document.addEventListener('click', (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-track-event]');
    if (!target) return;

    const eventName = target.dataset.trackEvent!;
    const screen =
      target.dataset.trackScreen ||
      String(router.currentRoute.value.name || router.currentRoute.value.path);

    let extra: Record<string, unknown> = {};
    if (target.dataset.trackParams) {
      try {
        extra = JSON.parse(target.dataset.trackParams);
      } catch {
        // JSON inválido — ignora parâmetros extras
      }
    }

    gtag('event', eventName, {
      app_name: 'Site',
      screen_name: screen,
      ...extra,
    });
  });
});
