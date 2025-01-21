// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Fotografa Lillia Tavares',
      meta: [
        {
          name: 'description',
          content: 'Lillia Tavares: Fotógrafa de retratos femininos que celebra a singularidade das mulheres. Destaque sua realeza com uma sessão única que empodera sua autoestima.',
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

  devtools: {
    enabled: true
  },

  modules: [
    '@hexdigital/nuxt-datocms',
    '@nuxtjs/partytown',
    '@nuxtjs/device',
    "nuxt-datocms",
    '@nuxt/image',
    'nuxt-swiper',
    'nuxt-icons',
    'nuxt-gtag',
  ],

  gtag: {
    id: 'G-8L15WEPJQE'
  },

  image: {
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
      datoCmsToken: process.env.DATO_CMS_TOKEN,
    }
  },

  datocms: {
    publicReadOnlyToken: '6cded3639fc92a93f43e1572752f92',
  },

  compatibilityDate: '2024-07-05',
})