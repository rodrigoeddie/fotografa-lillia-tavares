import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface AnimationConfig {
  from: gsap.TweenVars
  to: gsap.TweenVars
  ease?: string
  duration?: number
}

const ANIMATIONS: Record<string, AnimationConfig> = {
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
              ;(batch as HTMLElement[]).forEach((el) => el.classList.add('animated'))
            },
          })
        },
      })
    })
  }

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
          invalidateOnRefresh: true,
        },
        onComplete: () => {
          el.classList.add('animated')
        },
      })
    })

    // Aguarda o browser pintar e estabilizar o layout antes de calcular posições
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })
  }

  function refresh() {
    if (import.meta.server) return
    ScrollTrigger.refresh()
  }

  function cleanup() {
    if (import.meta.server) return
    ScrollTrigger.getAll().forEach((st) => st.kill())
    document.querySelectorAll<HTMLElement>('[data-ani-initialized]').forEach((el) => {
      delete el.dataset.aniInitialized
      gsap.set(el, { clearProps: 'all' })
    })
  }

  return { init, refresh, cleanup }
}
