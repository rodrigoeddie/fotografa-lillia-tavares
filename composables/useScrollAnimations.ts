import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Composable que inicializa as animações de scroll baseadas em data-attributes.
 *
 * ## Uso
 * Adicione `data-ani-type` em qualquer elemento HTML:
 *
 * ```html
 * <div data-ani-type="fade">...</div>
 * <div data-ani-type="fade-up">...</div>
 * <div data-ani-type="fade-down">...</div>
 * <div data-ani-type="fade-left">...</div>
 * <div data-ani-type="fade-right">...</div>
 * <div data-ani-type="zoom-in">...</div>
 * <div data-ani-type="zoom-out">...</div>
 * <div data-ani-type="polaroid">...</div>  ← efeito 3D foto impressa
 * <div data-ani-type="reveal-up">...</div>
 * <div data-ani-type="reveal-left">...</div>
 * <div data-ani-type="blur-in">...</div>
 * ```
 *
 * ## Atributos opcionais
 * - `data-ani-delay="0.2"`    → delay em segundos (padrão: 0)
 * - `data-ani-duration="0.8"`  → duração em segundos (padrão: 0.8)
 * - `data-ani-stagger="0.15"`  → stagger entre filhos (quando usado em container)
 * - `data-ani-ease="power3.out"` → easing customizado (padrão: power2.out)
 *
 * Após a animação completar, a classe `animated` é adicionada ao elemento.
 *
 * ## Exemplo: Elementos lado a lado com delay sequencial
 * ```html
 * <div data-ani-type="fade-up">Aparece primeiro</div>
 * <div data-ani-type="fade-up" data-ani-delay="0.15">Aparece segundo</div>
 * <div data-ani-type="fade-up" data-ani-delay="0.3">Aparece terceiro</div>
 * ```
 *
 * ## Exemplo: Stagger em lista de cards (filhos animados)
 * ```html
 * <div data-ani-type="fade-up" data-ani-stagger="0.12">
 *   <div class="card">...</div>
 *   <div class="card">...</div>
 *   <div class="card">...</div>
 * </div>
 * ```
 */

// ─── Animações disponíveis ──────────────────────────────────────────

interface AnimationConfig {
  from: gsap.TweenVars
  to: gsap.TweenVars
  /** Easing padrão caso data-ani-ease não seja informado */
  ease?: string
  /** Duração padrão caso data-ani-duration não seja informado */
  duration?: number
}

const ANIMATIONS: Record<string, AnimationConfig> = {
  // Fades simples
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  'fade-up': {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0 },
  },
  'fade-down': {
    from: { opacity: 0, y: -40 },
    to: { opacity: 1, y: 0 },
  },
  'fade-left': {
    from: { opacity: 0, x: 60 },
    to: { opacity: 1, x: 0 },
  },
  'fade-right': {
    from: { opacity: 0, x: -60 },
    to: { opacity: 1, x: 0 },
  },

  // Zoom
  'zoom-in': {
    from: { opacity: 0, scale: 0.85 },
    to: { opacity: 1, scale: 1 },
  },
  'zoom-out': {
    from: { opacity: 0, scale: 1.15 },
    to: { opacity: 1, scale: 1 },
  },

  // Reveal (clip-path)
  'reveal-up': {
    from: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
    to: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' },
  },
  'reveal-left': {
    from: { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' },
    to: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' },
  },

  // Blur (desfoque suave — bom para fotografia)
  'blur-in': {
    from: { opacity: 0, filter: 'blur(12px)' },
    to: { opacity: 1, filter: 'blur(0px)' },
  },

  // ★ Polaroid — canto inferior-direito curvado que se endireita
  // transformOrigin no canto superior-esquerdo ancora esse ponto;
  // rotateX negativo levanta a borda inferior, rotateY positivo levanta a borda direita.
  // O resultado visual é um canto inferior-direito "descascando" que se corrige.
  polaroid: {
    ease: 'power3.out',
    duration: .6,
    from: {
      opacity: 0,
      rotateX: -14,
      rotateY: 18,
      skewX: -3,
      transformPerspective: 700,
      transformOrigin: 'top left',
      boxShadow: '14px 18px 40px rgba(0,0,0,0.40), 4px 4px 0 rgba(0,0,0,0.08)',
    },
    to: {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      skewX: 0,
      transformPerspective: 700,
      transformOrigin: 'top left',
      boxShadow: '0px 4px 14px rgba(0,0,0,0.12)',
    },
  },

  // Variação — canto inferior-esquerdo curvado (foto entra da esquerda)
  'polaroid-left': {
    ease: 'power3.out',
    duration: 1.1,
    from: {
      opacity: 0,
      rotateX: -14,
      rotateY: -18,
      skewX: 3,
      x: -30,
      transformPerspective: 700,
      transformOrigin: 'top right',
      boxShadow: '-14px 18px 40px rgba(0,0,0,0.40), -4px 4px 0 rgba(0,0,0,0.08)',
    },
    to: {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      skewX: 0,
      x: 0,
      transformPerspective: 700,
      transformOrigin: 'top right',
      boxShadow: '0px 4px 14px rgba(0,0,0,0.12)',
    },
  },

  // Variação — canto inferior-direito curvado (foto entra da direita)
  'polaroid-right': {
    ease: 'power3.out',
    duration: 1.1,
    from: {
      opacity: 0,
      rotateX: -14,
      rotateY: 18,
      skewX: -3,
      x: 30,
      transformPerspective: 700,
      transformOrigin: 'top left',
      boxShadow: '14px 18px 40px rgba(0,0,0,0.40), 4px 4px 0 rgba(0,0,0,0.08)',
    },
    to: {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      skewX: 0,
      x: 0,
      transformPerspective: 700,
      transformOrigin: 'top left',
      boxShadow: '0px 4px 14px rgba(0,0,0,0.12)',
    },
  },
}

// ─── Composable ─────────────────────────────────────────────────────

export function useScrollAnimations() {
  /**
   * Processa elementos agrupados via `data-ani-batch`.
   *
   * Todos os elementos com o mesmo valor de `data-ani-batch` são gerenciados
   * por uma única instância de ScrollTrigger.batch(), muito mais eficiente
   * para grids e listas longas.
   *
   * Atributos suportados no elemento:
   * - `data-ani-type`         → tipo de animação (igual ao individual)
   * - `data-ani-batch`        → chave do grupo (ex: "reviews-grid")
   * - `data-ani-stagger`      → intervalo entre cada elemento do batch (padrão: 0.08)
   * - `data-ani-duration`     → duração (padrão do tipo ou 0.8)
   * - `data-ani-ease`         → easing (padrão do tipo ou power2.out)
   * - `data-ani-batch-max`    → máx. elementos por disparo do batch (padrão: 4)
   *
   * ## Exemplo
   * ```html
   * <article data-ani-type="fade-up" data-ani-batch="reviews">...</article>
   * <article data-ani-type="fade-up" data-ani-batch="reviews">...</article>
   * ```
   */
  function initBatches(container: Document | HTMLElement) {
    const batchEls = Array.from(
      container.querySelectorAll<HTMLElement>('[data-ani-batch]:not([data-ani-initialized])')
    )
    if (batchEls.length === 0) return

    // Agrupa por valor de data-ani-batch
    const groups = new Map<string, HTMLElement[]>()
    batchEls.forEach((el) => {
      const key = el.dataset.aniBatch!
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(el)
    })

    groups.forEach((els) => {
      // Usa o primeiro elemento para ler as configurações do grupo
      const first = els[0]
      if (!first) return

      const type = first.dataset.aniType || 'fade'
      const config = ANIMATIONS[type]
      if (!config) {
        console.warn(`[useScrollAnimations] Tipo desconhecido: "${type}"`)
        return
      }

      const stagger  = parseFloat(first.dataset.aniStagger  || '0.08')
      const duration = parseFloat(first.dataset.aniDuration ?? String(config.duration ?? 0.8))
      const ease     = first.dataset.aniEase || config.ease || 'power2.out'
      const batchMax = parseInt(first.dataset.aniBatchMax   || '4')

      const fromVars = { ...config.from, opacity: 0 }
      const toVars   = { ...config.to,   opacity: 1 }

      // Estado inicial em todos os elementos do grupo de uma vez
      gsap.set(els, fromVars)
      els.forEach((el) => { el.dataset.aniInitialized = 'true' })

      // Uma única instância de ScrollTrigger para todo o grupo
      ScrollTrigger.batch(els, {
        start: 'top 88%',
        batchMax,
        onEnter: (batch) => {
          gsap.to(batch, {
            ...toVars,
            duration,
            ease,
            stagger,
            onComplete() {
              // Adiciona .animated ao último do batch
              ;(batch as HTMLElement[]).forEach((el) => el.classList.add('animated'))
            },
          })
        },
      })
    })
  }

  /**
   * Busca todos os elementos com [data-ani-type] dentro de `root`
   * (ou document) e registra as animações com ScrollTrigger.
   *
   * Elementos com `data-ani-batch` são processados pelo initBatches().
   * Chamar múltiplas vezes é seguro — elementos já animados são ignorados.
   */
  function init(root?: HTMLElement | null) {
    if (import.meta.server) return

    const container = root || document

    // Processa grupos (batch) antes dos individuais
    initBatches(container)

    // Elementos individuais (sem data-ani-batch)
    const elements = container.querySelectorAll<HTMLElement>('[data-ani-type]:not([data-ani-batch]):not([data-ani-initialized])')

    elements.forEach((el) => {
      el.dataset.aniInitialized = 'true'

      const type = el.dataset.aniType || 'fade'
      const config = ANIMATIONS[type]
      if (!config) {
        console.warn(`[useScrollAnimations] Tipo desconhecido: "${type}"`)
        return
      }

      const delay = parseFloat(el.dataset.aniDelay || '0')
      const duration = parseFloat(el.dataset.aniDuration ?? String(config.duration ?? 0.8))
      const stagger = parseFloat(el.dataset.aniStagger || '0')
      const ease = el.dataset.aniEase || config.ease || 'power2.out'

      // Se tem stagger, anima os filhos diretos
      const targets = stagger > 0 ? el.children : el

      // Garante que todo elemento comece invisível
      const fromVars = { ...config.from, opacity: 0 }
      const toVars = { ...config.to, opacity: 1 }

      gsap.set(targets, fromVars)

      gsap.to(targets, {
        ...toVars,
        duration,
        delay,
        ease,
        stagger: stagger > 0 ? stagger : undefined,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
        onComplete: () => {
          el.classList.add('animated')
        },
      })
    })
  }

  /**
   * Atualiza o ScrollTrigger — útil após mudanças no DOM.
   */
  function refresh() {
    if (import.meta.server) return
    ScrollTrigger.refresh()
  }

  /**
   * Remove todas as animações gerenciadas pelo ScrollTrigger.
   */
  function cleanup() {
    if (import.meta.server) return
    ScrollTrigger.getAll().forEach((st) => st.kill())
  }

  return { init, refresh, cleanup }
}
