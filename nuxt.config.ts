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

  site: {
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
  },

  router: {
    middleware: ['force-reload']
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
        {
          itemprop: 'image',
          content: 'https://www.fotografalilliatavares.com.br/share.webp?v3',
        },
      ],
      script: [
        {
          type: 'text/javascript',
          innerHTML: `
            window.smartlook||(function(d) {
              var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
              var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
              c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
            })(document);
            smartlook('init', '03d8d5209060cf01f72fb068bb5405e907929694', { region: 'eu' });
          `,
        },
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'smartlook-script': ['innerHTML']
      },
    },
    // pageTransition: {
    //   name: 'page',
    //   mode: 'out-in'
    // }
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
    // '@nuxtjs/partytown',
    'nuxt-easy-lightbox',
    'nuxt-schema-org',
    '@nuxtjs/device',
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxt/image',
    'nuxt-swiper',
    'nuxt-icons',
    'nuxt-gtag',
  ],

  gtag: {
    id: 'G-8L15WEPJQE'
  },

  image: {
    cloudflare: {
      baseURL: 'https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/'
    },
    quality: 90,
    format: ['webp'],
    densities: [1, 2],
  },

  css: ['~/assets/styles/main.scss'],

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
      }
    }
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

  nitro: {
    preset: 'cloudflare_pages',
    prerender: {
      autoSubfolderIndex: false,
    },
  },

  //Comando da build: bun install && bun run generate

  compatibilityDate: '2024-11-01',
})