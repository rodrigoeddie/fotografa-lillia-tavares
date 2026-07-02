/**
 * Scripts de terceiros condicionados ao consentimento LGPD.
 *
 * NENHUM script não-essencial pode carregar antes do opt-in no banner de
 * cookies (useCookieConsent). Ao reativar Meta Pixel ou Smartlook, siga o
 * mesmo padrão do GA4: verificar a categoria correspondente do consentimento
 * (marketing / recording) dentro do watch.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const { consent, load } = useCookieConsent()
  load()

  let gaLoaded = false

  watch(consent, (c) => {
    // ── Google Analytics 4 — categoria "analytics" ─────────────────
    if (c?.analytics && !gaLoaded) {
      gaLoaded = true
      nuxtApp.runWithContext(() => {
        useScriptGoogleAnalytics({ id: 'G-8L15WEPJQE' })
      })
    }

    // ── Meta Pixel — categoria "marketing" (desativado) ────────────
    // if (c?.marketing && !pixelLoaded) {
    //   pixelLoaded = true
    //   nuxtApp.runWithContext(() => {
    //     useScriptMetaPixel({ id: '4335671090015485' })
    //     useHead({
    //       noscript: [
    //         {
    //           innerHTML:
    //             '<img height="1" width="1" style="display:none" ' +
    //             'src="https://www.facebook.com/tr?id=4335671090015485&ev=PageView&noscript=1" />',
    //         },
    //       ],
    //     })
    //   })
    // }

    // ── Smartlook — categoria "recording" (desativado) ─────────────
    // if (c?.recording && !smartlookLoaded) {
    //   smartlookLoaded = true
    //   nuxtApp.runWithContext(() => {
    //     if (!(window as any).smartlook) {
    //       const api: any[] = []
    //       const sl = function (...args: any[]) { api.push(args) } as any
    //       sl.api = api
    //       ;(window as any).smartlook = sl
    //     }
    //     const { onLoaded } = useScript('https://web-sdk.smartlook.com/recorder.js', {
    //       trigger: 'idle',
    //       async: true,
    //     })
    //     onLoaded(() => {
    //       ;(window as any).smartlook('init', '03d8d5209060cf01f72fb068bb5405e907929694', { region: 'eu' })
    //     })
    //   })
    // }
  }, { immediate: true })
})
