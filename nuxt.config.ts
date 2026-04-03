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
      ]
    },
  },

  postcss: {
    plugins: {
      'postcss-responsive-type': {},
      'postcss-preset-env': {}
    }
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
    compatibilityDate: '2026-04-03',
    
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

  compatibilityDate: '2026-04-03',
  
  experimental: {
    payloadExtraction: false,
  },
})