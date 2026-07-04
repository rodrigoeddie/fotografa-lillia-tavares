<script setup lang="ts">
    const configPublic = useRuntimeConfig().public;
    const whatsappUrl = configPublic.whatsappUrl;
    const visibleRef = ref(false);
    const indexRef = ref(0);

    const cards = [
        {
            id: "5521a1b8-36d3-4c93-b93b-f2bf8c6be200",
            variant: "azul",
            name: "Azul marinho",
            desc: "Profundo e sofisticado — ideal para corporativo e editorial.",
            alt: "Mulher de blazer marinho fotografada sobre fundo infinito azul marinho",
        },
        {
            id: "993be2e4-4a5a-498c-8957-43909448c300",
            variant: "bege",
            name: "Bege",
            desc: "Quente e atemporal — combina com tons de pele e clima acolhedor.",
            alt: "Mulher de blazer bege fotografada sobre fundo infinito bege",
        },
        {
            id: "f6d249c4-f1bb-40db-7264-09ca91888d00",
            variant: "grafite",
            name: "Cinza grafite",
            desc: "Dramático e moderno — realça contornos e dá ar de revista.",
            alt: "Homem de camisa branca fotografado sobre fundo infinito cinza grafite",
        },
        {
            id: "e565d57c-cc18-40a3-ffcc-3eeba2da3100",
            variant: "branco",
            name: "Branco / cinza claro",
            desc: "Limpo e luminoso — clássico para retratos e looks claros.",
            alt: "Mulher de blusa branca fotografada sobre fundo infinito branco e cinza claro",
        },
    ];

    const imgs = cards.map((c) => ({
        src: configPublic.cloudflareURI + c.id + "/retrato",
        title: "",
    }));

    const showImg = (index) => {
        indexRef.value = index;
        visibleRef.value = true;
    };

    const onHide = () => (visibleRef.value = false);
</script>

<template>
  <section class="wrapper" id="fundo-infinito" aria-labelledby="fi-title">
    <div class="container">
      <div class="head" data-ani-type="fade-up">
        <span class="eyebrow">Fundo infinito fotográfico</span>
        <h2 id="fi-title" class="big-title centered">Quatro cores para harmonizar com o seu estilo</h2>
        <p class="head-text">O fundo infinito elimina linhas e sombras e deixa toda a atenção em você. Veja como cada cor transforma o clima do ensaio.</p>
      </div>

      <div class="grid">
        <article
          v-for="(card, i) in cards"
          :key="card.id"
          class="card"
          :class="card.variant"
          data-ani-type="fade-up"
          data-ani-batch="fundos"
          data-ani-stagger="0.07"
          data-ani-batch-max="4">
            <div class="photo">
              <nuxt-img
                :src="configPublic.cloudflareURI + card.id + '/retrato'"
                width="300"
                height="400"
                class="img-fundo"
                :alt="card.alt"
                @click="() => showImg(i)"
                loading="lazy"
                placeholder
                format="avif" />
            </div>
            <div class="meta">
              <span class="swatch" aria-hidden="true"></span>
              <div>
                <h3 class="name">{{ card.name }}</h3>
                <p class="desc">{{ card.desc }}</p>
              </div>
            </div>
        </article>
      </div>

      <p class="note">
        Não sabe qual combina com o seu ensaio?
        <a :href="whatsappUrl" target="_blank" rel="noopener">A gente te ajuda a escolher.</a>
      </p>
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
.wrapper {
    background: #faf8f1;
    padding: clamp(56rem, 7vw, 96rem) 0;
}

.head {
    max-width: 720rem;
    margin: 0 auto 48rem;
    text-align: center;

    .eyebrow {
        display: inline-block;
        font-size: 12rem;
        font-weight: 900;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: v.$rose-deep;
        margin-bottom: 14rem;
    }

    .big-title {
        padding-top: 0;
    }

    .head-text {
        font-size: 17rem;
        line-height: 1.65;
        color: v.$green;
        margin-top: 12rem;
    }
}

.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rem;

    @include m.max(md) {
        grid-template-columns: repeat(2, 1fr);
    }

    @include m.max(xs) {
        gap: 12rem;
    }
}

.card {
    border-radius: 14rem;
    overflow: hidden;
    padding: 20rem;
    display: flex;
    flex-direction: column;
    @include m.card-shadow;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover,
    &:focus-within {
        transform: translateY(-6rem);
        @include m.card-shadow-hover;
    }

    .photo {
        aspect-ratio: 3 / 4;
        overflow: hidden;
        border-radius: 8rem;

        .img-fundo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            cursor: zoom-in;
        }
    }

    .meta {
        padding: 16rem 2rem 2rem;
        display: flex;
        align-items: flex-start;
        gap: 12rem;
    }

    .swatch {
        width: 22rem;
        height: 22rem;
        border-radius: 50%;
        flex-shrink: 0;
        margin-top: 2rem;
        border: 2px solid rgba(255, 255, 255, 0.7);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    }

    .name {
        font-family: v.$lato;
        font-size: 16rem;
        font-weight: 900;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        line-height: 1.2;
    }

    .desc {
        font-size: 14rem;
        line-height: 1.45;
        margin-top: 4rem;
    }

    &.azul {
        background: v.$fundo-azul;
        color: white;
        .swatch { background: v.$fundo-azul; }
    }

    &.grafite {
        background: v.$fundo-grafite;
        color: white;
        .swatch { background: v.$fundo-grafite; }
    }

    &.bege {
        background: v.$fundo-bege;
        color: #3a2f23;
        .swatch { background: v.$fundo-bege; }
    }

    &.branco {
        background: v.$fundo-branco;
        color: v.$dark-green;
        .swatch { background: v.$fundo-branco; }
    }
}

.note {
    text-align: center;
    margin-top: 40rem;
    font-size: 16rem;
    color: v.$green;

    a {
        color: v.$rose-deep;
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 3px;

        &:hover {
            color: v.$green;
        }
    }
}

@media (prefers-reduced-motion: reduce) {
    .card {
        transition: none;

        &:hover,
        &:focus-within {
            transform: none;
        }
    }
}
</style>
