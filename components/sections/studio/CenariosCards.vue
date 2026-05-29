<script setup lang="ts">
const configPublic = useRuntimeConfig().public;

interface CenarioCard {
  title: string;
  imageId: string;
  alt: string;
}

defineProps<{ cenarios: CenarioCard[] }>();

const imgSrc = (imageId: string) => configPublic.cloudflareURI + imageId + '/public';
</script>

<template>
  <div class="cenarios-cards">
    <div class="cards-grid">
      <NuxtLink
        v-for="cenario in cenarios"
        :key="cenario.title"
        to="/estudio-fotografico-em-mogi-das-cruzes/cenarios"
        class="card"
      >
        <div class="card__img-wrap">
          <nuxt-img
            :src="imgSrc(cenario.imageId)"
            :alt="cenario.alt"
            width="400"
            height="300"
            loading="lazy"
            class="card__img"
          />
        </div>
        <span class="card__title">{{ cenario.title }}</span>
      </NuxtLink>
    </div>

    <div class="cards-cta">
      <NuxtLink to="/estudio-fotografico-em-mogi-das-cruzes/cenarios" class="btn">
        <span>Ver todos os cenários</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cenarios-cards {
  padding: 40rem 0;
}

.cards-grid {
  display: grid;
  // grid-template-columns: repeat(auto-fill, minmax(260rem, 1fr));
  grid-template-columns: repeat(3, 1fr);
  gap: 16rem;
  padding: 0 0 30rem;

  @include m.max(sm) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10rem;
  }

  @include m.max(xs) {
    grid-template-columns: 1fr;
  }
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex-direction: column;
  text-decoration: none;
  background: white;
  overflow: hidden;
  display: flex;
  box-shadow:
    0 1px 0 #ECE4D2,
    0 14px 30px -12px rgba(42, 37, 32, 0.25),
    0 4px 10px -4px rgba(42, 37, 32, 0.10);

  &:hover {
    box-shadow:
        0 1px 0 #ECE4D2,
        0 28px 50px -16px rgba(42, 37, 32, 0.35),
        0 8px 18px -6px rgba(42, 37, 32, 0.15);

    .card__img {
      transform: scale(1.04);
    }
  }

  &__img-wrap {
    overflow: hidden;
    aspect-ratio: 4/3;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }

  &__title {
    padding: 12rem 14rem;
    font-size: 15rem;
    font-weight: 700;
    color: v.$green;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: v.$lato;
  }
}

.cards-cta {
  text-align: center;
  padding-top: 10rem;
}
</style>
