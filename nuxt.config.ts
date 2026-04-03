// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath, URL } from 'node:url'
import { definePerson } from 'nuxt-schema-org/schema';

const siteConfig = {
  title: 'Fotógrafa Lillia Tavares',
  description: 'Lillia Tavares: Fotógrafa de retratos femininos que celebra a singularidade das mulheres. Destaque sua realeza com uma sessão única que empodera sua autoestima.',
  url: 'https://fotografalilliatavares.com.br'
};

export default defineNuxtConfig({
  siteConfig: siteConfig,
  debug: false,
  sourcemap: false,

  imports: {
    dirs: ['composables/admin'],
  },

  site: {
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'pt-BR',
      },
      title: siteConfig.title,
      meta: [
        {
          name: 'description',
          content: siteConfig.description,
        },
        {
          name: 'theme-color',
          content: '#E3DECA',
        },
        {
          property: 'og:image',
          content: 'https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public',
        },
        {
          name: 'twitter:image',
          content: 'https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public',
        },
      ],
      link: [
        {
          rel: 'dns-prefetch',
          href: 'https://images.fotografalilliatavares.com.br'
        },
        {
          rel: 'preconnect',
          href: 'https://images.fotografalilliatavares.com.br'
        }
      ],

    },
  },

  schemaOrg: {
    identity: definePerson({
      // Basic Information, if applicable
      name: siteConfig.title,
      givenName: 'Lillia',
      familyName: 'Tavares',
      additionalName: 'de Oliveira', // middle name or other additional names
      alternateName: 'Lillia O. Tavares',

      // Profile Information, if applicable
      image: 'https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/9a8558fb-cbb6-46a8-cec5-636f21a9db00/public',
      description: 'Lillia Tavares: Fotógrafa de retratos femininos que celebra a singularidade das mulheres. Destaque sua realeza com uma sessão única que empodera sua autoestima.',
      jobTitle: 'Fotógrafa',

      // Contact & Social, if applicable
      email: 'fotografalilliatavares@gmail.com',
      url: siteConfig.url,
      sameAs: [
        'https://www.facebook.com/fotografalilliatavares',
        'https://www.instagram.com/fotografalilliatavares',
        'https://www.tiktok.com/@fotografalilliatavares',
        'https://wa.me/5511911159795',
      ],
    })
  },

  devtools: {
    enabled: false
  },

  modules: [
    'nuxt-easy-lightbox',
    'nuxt-schema-org',
    '@nuxtjs/device',
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxt/image',
    'nuxt-swiper',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/scripts'
  ],

  robots: {
    disallow: ['/admin/'],
  },

  sitemap: {
    sources: [
      '/api/__sitemap__/urls'
    ],
  },

  icon: {
    mode: 'svg',
    serverBundle: 'remote', // ícones buscados da CDN Iconify no SSR — não entra no Worker
    clientBundle: {
      scan: true,           // detecta automaticamente quais ícones o cliente usa
    },
    customCollections: [
      {
        prefix: 'icons',
        dir: './assets/icons',
        // if you want to include all the icons in nested directories:
        // recursive: true,
      },
    ],
  },

  image: {
    cloudflare: {
      baseURL: 'https://images.fotografalilliatavares.com.br'
    },
    quality: 90,
    format: ['webp'],
    densities: [1, 2],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  // og-image desativado: o site usa apenas URLs estáticas em useSeoMeta() — nunca
  // chamou defineOgImage(). O módulo bundlava 3.58 MB desnecessários:
  // resvg-js WASM (2.48 MB) + fontes Inter TTF (1.1 MB).
  ogImage: {
    enabled: false,
  },

  css: [
    '~/assets/styles/main.scss'
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:math";
            @use "sass:map";
            @use "sass:list";
            @use "@/assets/styles/_variables.scss" as v;
            @use "@/assets/styles/_mixins.scss" as m;
          `,
        }
      },

      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      }
    },
    build: {
      cssCodeSplit: true,
      cssMinify: 'lightningcss',
      sourcemap: false,
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-swiper': ['swiper'],
            'vendor-gsap': ['gsap', 'gsap/ScrollTrigger'],
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        'gsap',
        'gsap/ScrollTrigger',
        '@unhead/schema-org/vue',
        '@internationalized/date',
      ]
    },
  },

  postcss: {
    plugins: {
      'postcss-responsive-type': {},
      'postcss-preset-env': {}
    }
  },

  tailwindcss: {
    config: {
      // ...existing config...
    },
    viewer: false,
    exposeConfig: false,
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config',
    injectPosition: 'first'
  },

  runtimeConfig: {
    public: {
      cloudflareURI: 'https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/',
    }
  },

  content: {
    highlight: false,
    database: {
      type: 'd1',
      bindingName: 'DB'
    },
  },

  nitro: {
    preset: 'cloudflare-pages',
    minify: true,
    compressPublicAssets: true,
    compatibilityDate: '2026-02-19',

    // Stub do Shiki no bundle do Worker: highlight: false + pre-render = Shiki nunca é
    // chamado em runtime, mas ainda era importado estaticamente (2.9MB de WASM desnecessários).
    alias: (() => {
      const noop = fileURLToPath(new URL('./server/utils/shiki-noop.ts', import.meta.url))
      return {
        'shiki': noop,
        'shiki/wasm': noop,
        'shiki/engine/oniguruma': noop,
        'shiki/engine/javascript': noop,
        '@shikijs/core': noop,
        '@shikijs/vscode-textmate': noop,
        'vscode-oniguruma': noop,
      }
    })(),

    rollupConfig: {
      output: {
        manualChunks: undefined
      }
    },

    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/blog',
        '/ensaio-fotografico',
        '/estudio',
        '/estudio/cenarios',
      ],
      ignore: [
        /^\/precos-ensaios-fotograficos\/.+/
      ]
    },

    routeRules: {
      // Assets do build — nomes com hash, imutáveis
      '/_nuxt/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      },
      '/': { 
        prerender: true,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
      },
      '/blog/**': { 
        prerender: true,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
      },
      '/ensaio-fotografico/**': { 
        prerender: true,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
      },
      '/admin/**': {
        robots: 'noindex, nofollow',
        ssr: false, // admin renderiza client-side — remove componentes admin do Worker
      },
      '/api/**': { 
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
      },
      '/**': {
        headers: {
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
        }
      }
    }
  },

  compatibilityDate: '2026-03-17',

  experimental: {
    payloadExtraction: false,
    // Quando um chunk JS não é encontrado (ex: deployment parcial com hashes novos
    // e Worker antigo), o Nuxt recarrega a página automaticamente em vez de 500.
    emitRouteChunkError: 'automatic',
  },

  hooks: {
    // Garante que todas as páginas de conteúdo dinâmico sejam pré-renderizadas.
    // Sem isso, páginas de terceiro nível (/blog/cat/slug, /ensaio/cat/slug) caem
    // no Worker em runtime, que pode ter chunk hashes inconsistentes com os assets
    // estáticos — causando "Failed to fetch dynamically imported module".
    async 'nitro:config'(nitroConfig) {
      if (nitroConfig.dev) return

      const { promises: fsp } = await import('node:fs')
      const { join } = await import('node:path')

      const contentDir = join(process.cwd(), 'content')
      const routes: string[] = []

      // Strip prefixo numérico com ponto (ex: "01.corporativo" → "corporativo")
      // Mantém variantes com traço (ex: "05-sheila-lima" → "05-sheila-lima")
      function cleanSegment(name: string) {
        return name.replace(/^\d+\./, '').replace(/\.(json|md)$/, '')
      }

      async function walk(dir: string, urlBase: string) {
        let entries: import('fs').Dirent[]
        try { entries = await fsp.readdir(dir, { withFileTypes: true }) }
        catch { return }

        for (const entry of entries) {
          if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
          const clean = cleanSegment(entry.name)
          const url = `${urlBase}/${clean}`

          if (entry.isDirectory()) {
            await walk(join(dir, entry.name), url)
          } else if (entry.isFile() && /\.(json|md)$/.test(entry.name)) {
            // index.md/json = página de categoria, já listada em prerender.routes
            if (/^index\.(json|md)$/.test(entry.name)) continue
            routes.push(url)
          }
        }
      }

      await walk(join(contentDir, 'ensaio-fotografico'), '/ensaio-fotografico')
      await walk(join(contentDir, 'blog'), '/blog')

      nitroConfig.prerender = nitroConfig.prerender ?? {}
      nitroConfig.prerender.routes = [
        ...(nitroConfig.prerender.routes ?? []),
        ...routes,
      ]
    },
  },
})