export default defineNuxtPlugin(() => {
  // ── Google Analytics 4 ───────────────────────────────────────────
  // @nuxt/scripts cuida do carregamento assíncrono e não bloqueante.
  useScriptGoogleAnalytics({ id: 'G-8L15WEPJQE' })

  // // ── Meta Pixel ────────────────────────────────────────────────────
  // useScriptMetaPixel({ id: '4335671090015485' })
  // useHead({
  //   noscript: [
  //     {
  //       innerHTML:
  //         '<img height="1" width="1" style="display:none" ' +
  //         'src="https://www.facebook.com/tr?id=4335671090015485&ev=PageView&noscript=1" />',
  //     },
  //   ],
  // })

  // // ── Smartlook ────────────────────────────────────────────────────
  // if (!(window as any).smartlook) {
  //   const api: any[] = []
  //   const sl = function (...args: any[]) { api.push(args) } as any
  //   sl.api = api
  //   ;(window as any).smartlook = sl
  // }

  // const { onLoaded } = useScript('https://web-sdk.smartlook.com/recorder.js', {
  //   trigger: 'idle',
  //   async: true,
  // })

  // onLoaded(() => {
  //   ;(window as any).smartlook('init', '03d8d5209060cf01f72fb068bb5405e907929694', { region: 'eu' })
  // })
})
