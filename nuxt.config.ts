// https://nuxt.com/docs/api/configuration/nuxt-config

import { definePerson } from 'nuxt-schema-org/schema';

const siteConfig = {
  title: 'Fotógrafa Lillia Tavares',
  description: 'Lillia Tavares: Fotógrafa de retratos femininos que celebra a singularidade das mulheres. Destaque sua realeza com uma sessão única que empodera sua autoestima.',
  url: 'https://fotografalilliatavares.com.br'
};

export default defineNuxtConfig({
  siteConfig: siteConfig,

  app: {
    head: {
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
      image: '/profile-photo.jpg',
      description: 'Lillia Tavares: Fotógrafa de retratos femininos que celebra a singularidade das mulheres. Destaque sua realeza com uma sessão única que empodera sua autoestima.',
      jobTitle: 'Fotógrafa',

      // Contact & Social, if applicable
      email: 'fotografalilliatavares@gmail.com',
      url: siteConfig.url,
      sameAs: [
        'https://www.instagram.com/fotografalilliatavares',
        'https://www.tiktok.com/@fotografalilliatavares',
        'https://wa.me/5511911159795',
      ],
    })
  },

  devtools: {
    enabled: true
  },

  modules: [
    'nitro-cloudflare-dev',
    '@nuxtjs/partytown',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
    '@nuxtjs/device',
    '@nuxt/content',
    // '@nuxthq/studio',
    // '@nuxt/sitemap',
    // '@nuxt/robots',
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
    }
  },

  nitro: {
    preset: 'cloudflare_pages'
  },

  compatibilityDate: "2024-09-19",
})
