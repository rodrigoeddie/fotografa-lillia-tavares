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

            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '4335671090015485');
            fbq('track', 'PageView');
          `,
        },
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'smartlook-script': ['innerHTML']
      },
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
          href: 'https://fonts.googleapis.com/css2?family=Lato:wght@400&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Lato:wght@900&display=swap'
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
    '@nuxt/ui',
  ],

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
    prerender: {
      autoSubfolderIndex: false,
      routes: [
        // Página inicial
        '/',

         // Páginas estáticas
        '/ensaio-fotografico',

        '/estudio',
        '/estudio/cenarios',
        '/estudio/cenarios/dia-das-maes-2025',

        '/preco-ensaio-fotografico',

        // Página dinâmicas
        '/ensaio-fotografico/corporativo',
        '/ensaio-fotografico/corporativo/vanessa-lima',
        '/ensaio-fotografico/corporativo/andresa-maia',
        '/ensaio-fotografico/corporativo/nelma-caroline',
        '/ensaio-fotografico/corporativo/camila-nogueira',
        '/ensaio-fotografico/corporativo/karoline-siqueira',
        '/ensaio-fotografico/corporativo/pollyanna-goncalves',
        '/ensaio-fotografico/corporativo/gustavo-okazaki',
        '/ensaio-fotografico/corporativo/bruna-freire',

        '/ensaio-fotografico/sensual-intimista',
        '/ensaio-fotografico/sensual-intimista/cris-borges',
        '/ensaio-fotografico/sensual-intimista/vanessa-lima',
        '/ensaio-fotografico/sensual-intimista/cris-pole-e-lira',

        '/ensaio-fotografico/dia-das-maes-2025',
        '/ensaio-fotografico/dia-das-maes-2025/lillia-tavares',
        '/ensaio-fotografico/dia-das-maes-2025/rosiney-de-melo',
      ],
    },
  },

  compatibilityDate: '2025-04-01',
})