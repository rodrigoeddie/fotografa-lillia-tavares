<script setup lang="ts">
    const configPublic = useRuntimeConfig().public;
    const cenariosUrl = "/estudio-fotografico-em-mogi-das-cruzes/cenarios";

    const cenarios = [
        {
            id: "a4ac25f9-9b44-43be-803f-601c72f14600",
            tag: "Lifestyle",
            title: "Set Quarto & Estar",
            desc: "Luz natural, tons quentes e clima intimista.",
            alt: "Set lifestyle com cama, sofá curvo bege, plantas e luz natural",
        },
        {
            id: "1a88f2d4-10c6-4c91-96a3-9ff4ac42fc00",
            tag: "Editorial",
            title: "Sala Editorial",
            desc: "Parede verde e galeria de quadros para um ar de revista.",
            alt: "Sala editorial com parede verde, galeria de quadros e sofá",
        },
        {
            id: "45bb3714-18c8-4b40-f986-5b0074589c00",
            tag: "Conforto",
            title: "Café & Recepção",
            desc: "Para você relaxar e se preparar com calma antes do clique.",
            alt: "Espaço de café e recepção com xícaras, canecas e cafeteira",
        },
    ];
</script>

<template>
  <section class="wrapper" aria-labelledby="amb-title">
    <div class="container">
      <div class="head" data-ani-type="fade-up">
        <span class="eyebrow">Conheça os cenários</span>
        <h2 id="amb-title" class="big-title centered">Ambientes pensados para cada história</h2>
        <p class="head-text">São 7 cenários no total. Estes são alguns dos espaços que você pode usar no seu ensaio.</p>
      </div>

      <div class="grid">
        <NuxtLink
          v-for="cenario in cenarios"
          :key="cenario.id"
          :to="cenariosUrl"
          class="card"
          data-ani-type="fade-up"
          data-ani-batch="ambientes"
          data-ani-stagger="0.07"
          data-ani-batch-max="3"
          :aria-label="cenario.title + ' — ver cenários'">
            <nuxt-img
              :src="configPublic.cloudflareURI + cenario.id + '/thumb'"
              width="612"
              height="459"
              class="img-cenario"
              :alt="cenario.alt"
              format="webp"
              loading="lazy"
              placeholder />
            <div class="overlay">
              <span class="tag">{{ cenario.tag }}</span>
              <h3 class="title">{{ cenario.title }}</h3>
              <p class="desc">{{ cenario.desc }}</p>
            </div>
        </NuxtLink>
      </div>

      <div class="foot">
        <NuxtLink :to="cenariosUrl" class="btn">
          <span>Ver todos os cenários</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.wrapper {
    background: white;
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
    grid-template-columns: repeat(3, 1fr);
    gap: 20rem;

    @include m.max(sm) {
        grid-template-columns: 1fr 1fr;
    }

    @include m.max(xs) {
        grid-template-columns: 1fr;
    }
}

.card {
    position: relative;
    border-radius: 14rem;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    display: block;

    .img-cenario {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    &:hover .img-cenario,
    &:focus-visible .img-cenario {
        transform: scale(1.05);
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(44, 42, 21, 0.82) 0%, rgba(44, 42, 21, 0.15) 48%, transparent 75%);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 22rem;
    }

    .tag {
        align-self: flex-start;
        margin-bottom: auto;
        background: rgba(255, 255, 255, 0.94);
        color: v.$green;
        font-size: 11rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 5rem 11rem;
        border-radius: 999px;
    }

    .title {
        color: white;
        font-family: v.$lato;
        font-size: 18rem;
        font-weight: 900;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    .desc {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14rem;
        margin-top: 3rem;
    }
}

.foot {
    display: flex;
    justify-content: center;
    margin-top: 44rem;
}

@media (prefers-reduced-motion: reduce) {
    .card .img-cenario {
        transition: none;
    }

    .card:hover .img-cenario,
    .card:focus-visible .img-cenario {
        transform: none;
    }
}
</style>
