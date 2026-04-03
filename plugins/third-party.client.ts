export default defineNuxtPlugin(() => {
  // ── Google Analytics 4 ───────────────────────────────────────────
  // @nuxt/scripts cuida do carregamento assíncrono e não bloqueante.
  useScriptGoogleAnalytics({ id: 'G-8L15WEPJQE' })

  // ── Meta Pixel ────────────────────────────────────────────────────
  // useScriptMetaPixel é o composable correto do @nuxt/scripts.
  // Carrega bundled + proxied pelo servidor (first-party mode),
  // sem CORS e sem vazamento de IP do usuário para a Meta.
  useScriptMetaPixel({ id: '4335671090015485' })

  // noscript fallback para usuários sem JavaScript
  useHead({
    noscript: [
      {
        innerHTML:
          '<img height="1" width="1" style="display:none" ' +
          'src="https://www.facebook.com/tr?id=4335671090015485&ev=PageView&noscript=1" />',
      },
    ],
  })

  // ── Smartlook ────────────────────────────────────────────────────
  // Cria a fila de comandos ANTES do script carregar para evitar o
  // TypeError "cannot read 'silent'" que acontecia antes.
  if (!(window as any).smartlook) {
    const api: any[] = []
    const sl = function (...args: any[]) { api.push(args) } as any
    sl.api = api
    ;(window as any).smartlook = sl
  }

  const { onLoaded } = useScript('https://web-sdk.smartlook.com/recorder.js', {
    // Carrega quando o browser estiver ocioso (não bloqueia o LCP)
    trigger: 'idle',
    async: true,
  })

  onLoaded(() => {
    ;(window as any).smartlook('init', '03d8d5209060cf01f72fb068bb5405e907929694', { region: 'eu' })
  })
})
