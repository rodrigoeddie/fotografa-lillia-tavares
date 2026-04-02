<script setup lang="ts">
const { data: sobre } = await useAsyncData('sobre-page', () => {
  return queryCollection('content').path('/pages/sobre').first()
});

if (!sobre.value) {
  throw createError({
    statusCode: 404,
    message: 'Página não encontrada'
  });
}

const pageData = computed(() => sobre.value as any);
</script>

<template>
  <div v-if="pageData" class="sobre-page">
    <div class="container">
      <header class="sobre-header">
        <h1 class="big-title green centered">
          <span class="box">
            Sobre a Fotógrafa
          </span>
          <span class="big">
            Lillia Tavares
          </span>
        </h1>
      </header>

      <div class="sobre-content">
        <div class="sobre-image">
          <nuxt-img
            provider="cloudflare"
            :src="`https://images.fotografalilliatavares.com.br/images/${pageData.image?.id || '5aaf1433-aaa7-42ed-7198-15626f964000'}/public`"
            :alt="pageData.image?.alt || 'Fotógrafa Lillia Tavares'"
            :width="pageData.image?.width || 935"
            :height="pageData.image?.height || 935"
            sizes="100vw sm:50vw md:935px"
            format="webp"
            placeholder
            class="img-sobre"
          />
        </div>

        <div class="sobre-text">
          <ContentRenderer :value="pageData" class="markdown-content" />
        </div>
      </div>

      <section class="sobre-cta">
        <h2>Vamos criar algo especial juntos?</h2>
        <p>Entre em contato e agende seu ensaio fotográfico.</p>
        <NuxtLink
          to="/precos-ensaios-fotograficos"
          class="sobre-cta__button"
          data-track-event="cta-ver-pacotes-sobre">
            <span>Ver Pacotes</span>
        </NuxtLink>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sobre-content {
  grid-template-columns: 1fr 1fr;
  margin-bottom: v.$bigSpace;
  border: 1px solid v.$green;
  background: white;
  display: grid;

  @include m.max(md) {
    grid-template-columns: 1fr;
  }
}

.sobre-image {
  @include m.max(md) {
    height: 80dvw;
  }

  .img-sobre {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

.sobre-text {
  padding: v.$bigSpace;
}

.sobre-cta {
  text-align: center;
  padding: 48rem 0;
  background: #f9f9f9;
  border-radius: 8rem;
  margin-top: 48rem;
  margin-bottom: v.$bigSpace;

  h2 {
    font-size: 32rem;
    font-weight: 600;
    color: v.$green;
    margin-bottom: 16rem;

    @include m.max(sm) {
      font-size: 24rem;
    }
  }

  p {
    font-size: 18rem;
    color: #666;
    margin-bottom: 32rem;

    @include m.max(sm) {
      font-size: 16rem;
    }
  }

  &__button {
    display: inline-block;
    padding: 16rem 40rem;
    background: v.$red;
    color: #fff;
    text-decoration: none;
    border-radius: 4rem;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      background: v.$dark-red;
      transform: translateY(-2rem);
      box-shadow: 0 4rem 12rem rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
