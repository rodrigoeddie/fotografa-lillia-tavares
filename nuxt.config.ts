// https://nuxt.com/docs/api/configuration/nuxt-config

import { definePerson } from 'nuxt-schema-org/schema';

const siteConfig = {
  title: 'Fotógrafa Lillia Tavares',
  description: 'Lillia Tavares: Fotógrafa de retratos femininos que celebra a singularidade das mulheres. Destaque sua realeza com uma sessão única que empodera sua autoestima.',
  url: 'https://fotografalilliatavares.com.br'
};

export default defineNuxtConfig({
  siteConfig: siteConfig,
  debug: false,

  future: {
    compatibilityVersion: 4,
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
          content: 'https://www.fotografalilliatavares.com.br/share.webp?v3',
        },
        {
          name: 'twitter:image',
          content: 'https://www.fotografalilliatavares.com.br/share.webp?v3',
        },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;900&display=swap'
        },
        {
          rel: 'dns-prefetch',
          href: 'https://images.fotografalilliatavares.com.br'
        },
        {
          rel: 'preconnect',
          href: 'https://images.fotografalilliatavares.com.br'
        }
      ]
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

  modules: [// '@nuxtjs/partytown',
  'nuxt-easy-lightbox', 'nuxt-schema-org', '@nuxtjs/device', '@nuxt/content', '@nuxtjs/seo', '@nuxt/image', 'nuxt-swiper', 'nuxt-gtag', '@nuxt/ui', '@nuxt/icon', '@nuxt/scripts'],

  sitemap: {
    sources: [
      '/api/__sitemap__/urls'
    ],
  },

  icon: {
    mode: 'svg',
    customCollections: [
      {
        prefix: 'icons',
        dir: './assets/icons',
        // if you want to include all the icons in nested directories:
        // recursive: true,
      },
    ],
  },

  gtag: {
    id: 'G-8L15WEPJQE'
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

  ogImage: {
    compatibility: {
      runtime: {
        // Desabilita sharp para Cloudflare
        sharp: false
      }
    },
    // Força PNG como formato padrão
    defaults: {
      extension: 'png'
    }
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

  compatibilityDate: '2026-02-19',
  
  experimental: {
    payloadExtraction: false,
  },
})