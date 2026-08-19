<script setup lang="ts">
import { NuxtLink } from '#components';

const cfImg = useCfImg();

const { pagina, servicos, bioParagrafos } = await useSobreConteudo();
</script>

<template>
  <div class="sobre-page">
    <div class="container">

      <header class="sobre-header">
        <h1 class="big-title green centered">
          {{ pagina.titulo }}
        </h1>
      </header>

      <!-- Bio -->
      <div class="sobre-bio">
        <div v-if="pagina.imagem_cf_id" class="sobre-bio__image">
          <nuxt-img
            provider="cloudflare"
            :src="cfImg(pagina.imagem_cf_id)"
            :alt="pagina.imagem_alt || 'Fotógrafa Lillia Tavares'"
            :width="pagina.imagem_width || 935"
            :height="pagina.imagem_height || 935"
            sizes="100vw sm:50vw md:935px"
            format="webp"
            placeholder
            class="img-sobre"
          />
        </div>

        <div class="description">
          <p v-for="(paragrafo, i) in bioParagrafos" :key="i">{{ paragrafo }}</p>
        </div>
      </div>

      <!-- Serviços -->
      <section v-if="servicos.length" class="sobre-servicos">
        <h2 v-if="pagina.servicos_titulo" class="title">{{ pagina.servicos_titulo }}</h2>

        <div class="servicos-grid">
          <component
            :is="servico.cta_url ? NuxtLink : 'div'"
            v-for="servico in servicos"
            :key="servico.id"
            :to="servico.cta_url || undefined"
            class="servico-card"
            :class="{ 'servico-card--principal': servico.destaque === 1 }"
            data-ani-type="fade-up"
          >
            <span v-if="servico.tag" class="servico-card__tag">{{ servico.tag }}</span>
            <h3 class="servico-card__titulo">{{ servico.titulo }}</h3>
            <p v-if="servico.subtitulo" class="servico-card__subtitulo">{{ servico.subtitulo }}</p>
            <p v-if="servico.descricao" class="servico-card__desc">{{ servico.descricao }}</p>
            <p v-if="servico.descricao_extra">{{ servico.descricao_extra }}</p>
            <br v-if="servico.descricao_extra">

            <span v-if="servico.cta_url && servico.cta_label" class="servico-card__cta">{{ servico.cta_label }}</span>

            <NuxtLink
              v-if="servico.sub_link_url && servico.sub_link_label"
              :to="servico.sub_link_url"
              class="servico-card__sub-link"
            >
              {{ servico.sub_link_label }}
            </NuxtLink>
          </component>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sobre-page {
  font-size: 19rem;
}

.title {
  color: v.$green;
  display: block;
  text-align: center;
  padding-bottom: 0;
}

.sobre-bio {
  margin-bottom: v.$bigSpace;
  background: #fcfaf1;
  display: flex;
    box-shadow:
      0 1px 0 #ECE4D2,
      0 14px 30px -12px rgba(42, 37, 32, 0.15),
      0 4px 10px -4px rgba(42, 37, 32, 0.5);

  @include m.max(md) {
    flex-direction: column;
  }
  
  .sobre-bio__image {
    position: relative;
    width: 400rem;
    flex-shrink: 0;
  
    @include m.max(md) {
      height: 80dvw;
      width: 100%;
    }
  
    .img-sobre {
      position: absolute;
      object-fit: cover;
      display: block;
      height: 100%;
      width: 100%;
    }
  }
  
  .description {
    flex-direction: column;
    padding: v.$bigSpace;
    display: flex;
    gap: 20rem;
  }
}

// ── Serviços ──────────────────────────────────────────────────
.sobre-servicos {
  margin-bottom: v.$bigSpace;
}

.servicos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rem;

  @include m.max(sm) {
    grid-template-columns: 1fr;
  }
}

.servico-card {
  display: flex;
  flex-direction: column;
  padding: 32rem;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 4rem;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.25s ease, transform 0.25s ease;

  &:hover {
    box-shadow: 0 4rem 20rem rgba(0, 0, 0, 0.1);
    transform: translateY(-32rem);
  }

  // Card principal ocupa a largura toda
  &--principal {
    grid-column: 1 / -1;
    background: v.$green;
    border-color: v.$green;
    color: #fff;

    .servico-card__titulo {
      color: #fff;
      font-size: 30rem;
    }

    .servico-card__desc {
      color: white;
    }

    .servico-card__cta {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.5);

      &::after {
        color: #fff;
      }
    }
  }
}

.servico-card__tag {
  display: inline-block;
  font-size: 12rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 5rem 8rem;
  border-radius: 32rem;
  margin-bottom: 16rem;
  width: fit-content;
}

.servico-card__titulo {
  font-size: 27rem;
  font-weight: 700;
  color: v.$green;
  margin-bottom: 8rem;
}

.servico-card__subtitulo {
  font-size: 19rem;
  color: #888;
  margin-bottom: 14rem;
}

.servico-card__desc {
  line-height: 1.65;
  color: #555;
  flex: 1;
  margin-bottom: 24rem;
}

.servico-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 8rem;
  font-size: 19rem;
  font-weight: 600;
  color: v.$green;
  border-bottom: 1px solid v.$green;
  padding-bottom: 0.32rem;
  width: fit-content;
  margin-top: auto;

  &::after {
    content: '→';
  }
}

.servico-card__sub-link {
  display: inline-flex;
  align-items: center;
  gap: 8rem;
  font-size: 19rem;
  font-weight: 600;
  color: v.$red;
  text-decoration: none;
  margin-top: auto;
  width: fit-content;

  &::before {
    content: '→';
  }

  &:hover {
    text-decoration: underline;
  }
}

// ── CTA Final ─────────────────────────────────────────────────
.sobre-cta {
  text-align: center;
  padding: 3rem 32rem;
  background: #f9f9f9;
  border-radius: 8rem;
  margin-bottom: v.$bigSpace;

  h2 {
    font-size: 32rem;
    font-weight: 600;
    color: v.$green;
    margin-bottom: 1rem;

    @include m.max(sm) {
      font-size: 24rem;
    }
  }

  p {
    font-size: 1.125rem;
    color: #666;
    margin-bottom: 32rem;

    @include m.max(sm) {
      font-size: 1rem;
    }
  }

  &__button {
    display: inline-block;
    padding: 1rem 2.5rem;
    background: v.$red;
    color: #fff;
    text-decoration: none;
    border-radius: 4rem;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      background: v.$dark-red;
      transform: translateY(-32rem);
      box-shadow: 0 4rem 132rem rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
