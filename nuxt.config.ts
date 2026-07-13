// https://nuxt.com/docs/api/configuration/nuxt-config

// import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { definePerson } from 'nuxt-schema-org/schema';

const siteConfig = {
  title: 'Fotógrafa Lillia Tavares',
  description: 'Lillia Tavares: Fotógrafa de retratos femininos que celebra a singularidade das mulheres. Destaque sua realeza com uma sessão única que empodera sua autoestima.',
  url: 'https://fotografalilliatavares.com.br'
};

const whatsappUrl = 'https://wa.me/5511911159795';

// Content-Security-Policy do site inteiro.
// ⚠️ Ao ativar um novo serviço externo (Meta Pixel, Smartlook, outro embed),
// adicione o host aqui ANTES do deploy, senão o navegador bloqueia silenciosamente.
// 'unsafe-inline' em script-src é exigido pelo payload inline do Nuxt e pelos
// snippets de tracking; em style-src, pelos styles inline de componentes.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "connect-src 'self' https://*.google-analytics.com https://www.googletagmanager.com https://stats.g.doubleclick.net https://*.r2.cloudflarestorage.com https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com",
  "frame-src 'self' https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.instagram.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

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
      titleTemplate: '%s', // sem sufixo nenhum
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
          property: 'fb:app_id',
          content: '1304313054896815',
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
        },
        /* Preload das fontes do above-the-fold: garante que o Lato chega antes
           do primeiro paint (CSS é inline) — sem swap visível nem CLS. */
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/Lato-Regular.woff2',
          crossorigin: ''
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/Lato-Black.woff2',
          crossorigin: ''
        },
      ],

      // Polyfill for Import Maps — required by Nuxt 4 (#entry specifier).
      // Must load before the importmap (tagPriority -2) so browsers without
      // native importmap support (Safari < 16.4, older Android) can resolve it.
      script: [
        {
          src: '/assets/es-module-shims.js',
          tagPosition: 'head',
          tagPriority: -3,
          async: true,
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
        whatsappUrl,
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
    '@nuxt/scripts',
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxt/icon',
  ],

  robots: {
    disallow: ['/admin/', '/links', '/_nuxt/', '/cdn-cgi/', '/area-cliente/', '/orcamentos/'],
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
    quality: 80,
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
        'jszip',
        'swiper/element/bundle',
        'zod',
        'sweetalert2',
      ]
    },
  },

  runtimeConfig: {
    clientJwtSecret: process.env.CLIENT_JWT_SECRET,
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
    r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    r2BucketName: process.env.R2_BUCKET_NAME,
    public: {
      cloudflareURI: 'https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/',
      /* Base pública do Cloudflare Images via domínio custom (mesma conta do cloudflareURI).
         Consumir via useCfImg() — ver composables/useCfImg.ts. Sem barra final. */
      cfImageBase: 'https://images.fotografalilliatavares.com.br/images',
      /* URL canônica do site — fonte única em siteConfig.url. */
      siteUrl: siteConfig.url,
      whatsappUrl,
    }
  },

  nitro: {
    preset: 'cloudflare-pages',
    minify: true,
    compressPublicAssets: true,
    compatibilityDate: '2026-04-03',
    
    rollupConfig: {
      output: {
        manualChunks: undefined
      }
    },

    prerender: {
      crawlLinks: false,
      failOnError: false,
      routes: [],
    },

    routeRules: {
      '/': {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
        }
      },
      '/blog/**': {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
        }
      },
      '/ensaio-fotografico/**': {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
        }
      },
      '/admin/**': {
        robots: 'noindex, nofollow',
      },
      '/links': {
        robots: 'noindex, nofollow',
      },
      '/area-cliente/**': {
        robots: 'noindex, nofollow',
        ssr: true,
      },
      '/api/public/**': {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
      },
      '/api/cliente/**': {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      },
      '/api/admin/**': {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      },
      '/**': {
        headers: {
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
          'Content-Security-Policy': contentSecurityPolicy,
        }
      }
    }
  },

  compatibilityDate: '2026-04-03',
  
  experimental: {
    payloadExtraction: false,
    emitRouteChunkError: 'automatic',
  },

  features: {
    /* Inlina todo o CSS SSR no HTML — elimina requests render-blocking
       de folhas por componente no primeiro paint (Lighthouse FCP/LCP). */
    inlineStyles: true,
  },

  hooks: {
    // Keep the self-hosted es-module-shims polyfill in sync with the installed
    // npm package version every time the project is built.
    'build:before': () => {
      const src = resolve('./node_modules/es-module-shims/dist/es-module-shims.js')
      const dest = resolve('./public/assets/es-module-shims.js')
      mkdirSync(resolve('./public/assets'), { recursive: true })
      copyFileSync(src, dest)
    },
  },
})