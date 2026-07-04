<script setup lang="ts">
  const props = defineProps({
    fromStudio: {
      type: Boolean,
      required: false,
      default: false
    }
  });

  const configPublic = useRuntimeConfig().public;
  const visibleRef = ref(false);
  const indexRef = ref(0);
  const imgs = [
    {
      src: configPublic.cloudflareURI + "a4ac25f9-9b44-43be-803f-601c72f14600/thumb",
      title: ""
    },
    {
      src: configPublic.cloudflareURI + "45bb3714-18c8-4b40-f986-5b0074589c00/thumb",
      title: ""
    },
    {
      src: configPublic.cloudflareURI + "1a88f2d4-10c6-4c91-96a3-9ff4ac42fc00/thumb",
      title: ""
    },
    {
      src: configPublic.cloudflareURI + "c9f3cea1-c80c-4822-f585-144615c7ec00/thumb",
      title: ""
    },
  ];

  const showImg = (index) => {
    indexRef.value = index;
    visibleRef.value = true;
  };

  const onHide = () => (visibleRef.value = false);

  const containerRef = ref(null);
  const swiper = useSwiper(containerRef);
</script>

<template>
  <section class="hero-wrapper">
    <div class="hero">
      <div class="copy" data-ani-type="fade-right">
        <p class="kicker">Estúdio Fotográfico · Mogi das Cruzes, SP</p>

        <h1 class="hero-title">
          Um espaço feito para <em>revelar quem você é</em>
        </h1>

        <p class="lead">
          O estúdio está localizado em <a href="https://maps.app.goo.gl/2NPyJTUvUs9z12fW7" target="_blank" rel="noopener" class="lead-link">Mogi das Cruzes</a>, no coração da cidade, com ótimas opções para estacionamento e transportes.
        </p>

        <p class="lead">
          Oferecemos 7 cenários modernos e sofisticados, com fundo infinito fotográfico de várias cores, possibilitando diversas opções para o seu ensaio.
        </p>

        <ul class="tags" aria-label="Características do estúdio">
          <li class="tag">7 cenários exclusivos</li>
          <li class="tag">4 cores de fundo infinito</li>
          <li class="tag">Luz natural + artificial</li>
          <li class="tag">Atendimento particular</li>
        </ul>

        <div class="cta-row">
          <NuxtLink
            :to="fromStudio ? '/agende-seu-ensaio' : '/estudio-fotografico-em-mogi-das-cruzes'"
            class="btn">
            <span>Agende Seu Ensaio</span>
          </NuxtLink>

          <a href="#fundo-infinito" class="link-secondary">
            Conhecer os fundos
            <Icon name="icons:arrow-right" class="icon" />
          </a>
        </div>
      </div>

      <div class="media" data-ani-type="fade-left">
        <ClientOnly>
          <swiper-container
            class="wrap-images"
            ref="containerRef"
            :loop="false"
            :slides-per-view="1"
            :pagination="{ clickable: true }"
            :navigation="true">
              <swiper-slide class="item">
                <nuxt-img
                    :src='configPublic.cloudflareURI + "a4ac25f9-9b44-43be-803f-601c72f14600/thumb"'
                    width="612"
                    height="408"
                    @click="() => showImg(0)"
                    class="img-studio"
                    alt="Set de quarto do estúdio com cama de roupa bege, sofá curvo, plantas e luz natural pela cortina"
                    fetchpriority="high"
                    :preload="true"
                    loading="eager" />
                <span class="caption">Set lifestyle</span>
              </swiper-slide>

              <swiper-slide class="item">
                <nuxt-img
                  :src='configPublic.cloudflareURI + "45bb3714-18c8-4b40-f986-5b0074589c00/thumb"'
                  width="612"
                  height="408"
                  @click="() => showImg(1)"
                  class="img-studio"
                  alt="Espaço de café e recepção do estúdio, com xícaras, canecas e cápsulas de café"
                  loading="lazy" />
                <span class="caption">Café &amp; recepção</span>
              </swiper-slide>

              <swiper-slide class="item">
                <nuxt-img
                  :src='configPublic.cloudflareURI + "1a88f2d4-10c6-4c91-96a3-9ff4ac42fc00/thumb"'
                  width="612"
                  height="408"
                  @click="() => showImg(2)"
                  class="img-studio"
                  alt="Sala editorial com parede verde musgo, galeria de quadros, sofá e mesa central"
                  loading="lazy" />
                <span class="caption">Sala editorial</span>
              </swiper-slide>

              <swiper-slide class="item">
                <nuxt-img
                  :src='configPublic.cloudflareURI + "c9f3cea1-c80c-4822-f585-144615c7ec00/thumb"'
                  width="612"
                  height="408"
                  @click="() => showImg(3)"
                  class="img-studio"
                  alt="Fundo infinito do estúdio, com três rolos de papel de fundo nas cores branco, bege e azul"
                  loading="lazy" />
                <span class="caption">Fundo infinito</span>
              </swiper-slide>
          </swiper-container>
        </ClientOnly>
      </div>
    </div>

    <VueEasyLightbox
      :visible="visibleRef"
      :imgs="imgs"
      :index="indexRef"
      :rotateDisabled="true"
      :zoomDisabled="true"
      @hide="onHide"
    />
  </section>
</template>

<style scoped lang="scss">
  @use "sass:color";

  $body: color.adjust(v.$green, $lightness: -12%);

  .hero-wrapper {
    overflow: hidden;
    background: white;
  }

  .hero {
    display: grid;
    grid-template-columns: 1fr 1.05fr;
    align-items: stretch;

    @include m.max(sm) {
      grid-template-columns: 1fr;
    }
  }

  .copy {
    padding: clamp(40rem, 5vw, 72rem) clamp(24rem, 4vw, 56rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .kicker {
    font-size: 12rem;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: v.$rose-deep;
    margin-bottom: 16rem;
  }

  .hero-title {
    font-family: v.$lato;
    font-size: clamp(30rem, 3.4vw, 46rem);
    font-weight: 900;
    line-height: 1.12;
    text-transform: uppercase;
    letter-spacing: 0.01em;
    color: v.$green;
    margin-bottom: 24rem;

    em {
      font-style: normal;
      color: v.$rose-deep;
    }
  }

  .lead {
    font-size: 17rem;
    line-height: 1.7;
    max-width: 46ch;
    margin-bottom: 16rem;
    color: $body;

    .lead-link {
      color: v.$rose-deep;
      text-decoration: underline;
      text-underline-offset: 3px;
      transition: color 0.2s;

      &:hover {
        color: v.$green;
      }
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8rem;
    margin: 12rem 0 28rem;
    list-style: none;

    .tag {
      background: v.$cream-light;
      border: 1px solid #d7d6cd;
      color: $body;
      font-size: 13rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      padding: 6rem 13rem;
      border-radius: 999px;
    }
  }

  .cta-row {
    display: flex;
    align-items: center;
    gap: 20rem;
    flex-wrap: wrap;
  }

  .link-secondary {
    font-size: 15rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: $body;
    display: inline-flex;
    align-items: center;
    gap: 6rem;
    text-decoration: underline;
    text-decoration-color: #d7d6cd;
    text-underline-offset: 4px;
    transition: text-decoration-color 0.2s, gap 0.2s;

    &:hover,
    &:focus-visible {
      text-decoration-color: v.$green;
      gap: 10rem;
    }

    .icon {
      font-size: 15rem;
    }
  }

  .media {
    position: relative;
    overflow: hidden;
    background: v.$cream-light;
    min-height: 460rem;

    @include m.max(sm) {
      order: -1;
      min-height: 320rem;
    }
  }

  .wrap-images {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;

    .item {
      position: relative;
      height: 100%;

      .img-studio {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: zoom-in;
      }

      .caption {
        position: absolute;
        left: 16rem;
        bottom: 16rem;
        background: rgba(44, 42, 21, 0.78);
        color: white;
        font-size: 12rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 6rem 13rem;
        border-radius: 999px;
        backdrop-filter: blur(4px);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .link-secondary,
    .lead-link {
      transition: none;
    }
  }
</style>
