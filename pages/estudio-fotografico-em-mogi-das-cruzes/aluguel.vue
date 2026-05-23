<script lang="ts" setup>
usePageSeo('static', '/estudio-fotografico-em-mogi-das-cruzes/aluguel');

const configPublic = useRuntimeConfig().public;

const { data: rawData } = await useFetch('/api/public/cenarios?slug=estudio');

const cenarioCards = computed(() => {
  const pagina = rawData.value as any;
  if (!pagina?.cenarios) return [];
  return (pagina.cenarios as any[])
    .slice()
    .sort((a: any, b: any) => a.ordem - b.ordem)
    .map((c: any) => ({
      title: c.titulo as string,
      imageId: c.imagem_bg_cf_id as string,
      alt: (c.imagem_bg_alt ?? '') as string,
    }));
});

const partners = [
  {
    name: "Shoebiz",
    site: "https://www.shoebiz.com.br/",
    instagram: "https://www.instagram.com/shoebiz_official/",
    instagramHandle: "@shoebiz_official",
    // TODO: adicionar CF image IDs das campanhas fotografadas no estúdio
    campaignImages: [] as Array<{ imageId: string; alt: string }>,
  },
  {
    name: "LA'S CLOTHING®",
    site: "https://www.lasclothing.com.br",
    instagram: "https://www.instagram.com/las.clothing",
    instagramHandle: "@las.clothing",
    campaignImages: [] as Array<{ imageId: string; alt: string }>,
  },
];
</script>

<template>
  <div class="page-aluguel">

    <!-- Breadcrumb -->
    <div class="container">
      <BlocksBreadcrumb :items="[
        { label: 'Home', to: '/' },
        { label: 'Estúdio', to: '/estudio-fotografico-em-mogi-das-cruzes' },
        { label: 'Aluguel' },
      ]" />
    </div>

    <!-- Hero -->
    <section class="hero container" data-ani-type="fade-up">
      <h1 class="big-title green">
        Aluguel de Estúdio Fotográfico em Mogi das Cruzes
      </h1>
      <p class="hero__description">
        Nosso estúdio fotográfico está disponível para locação por hora ou diária.
        Ideal para fotógrafos, marcas, e-commerce e produções criativas.
        7 cenários modernos, fundo infinito em 4 cores e equipamentos disponíveis.
      </p>
      <NuxtLink to="/agende-seu-ensaio" class="btn btn-green hero__cta">
        <span>Solicitar orçamento</span>
      </NuxtLink>
    </section>

    <!-- Preços -->
    <section class="secao-precos" data-ani-type="fade-up">
      <div class="container">
        <h2 class="secao-titulo green">Valores</h2>
        <div class="precos-grid">
          <div class="preco-card">
            <span class="preco-card__label">Por hora</span>
            <span class="preco-card__valor">R$ 130</span>
          </div>
          <div class="preco-card preco-card--destaque">
            <span class="preco-card__label">Diária</span>
            <span class="preco-card__valor">R$ 800</span>
          </div>
        </div>
        <p class="precos-obs">
          Valores sujeitos a alteração. Entre em contato para confirmar disponibilidade e fechar sua reserva.
        </p>
        <NuxtLink to="/agende-seu-ensaio" class="btn btn-green">
          <span>Reservar minha data</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Cenários disponíveis (cards compactos) -->
    <section class="secao-cenarios" data-ani-type="fade-up">
      <div class="container">
        <h2 class="secao-titulo green">Cenários disponíveis</h2>
        <p class="secao-desc">
          Todos os cenários estão incluídos na locação.
        </p>
        <SectionsStudioCenariosCards :cenarios="cenarioCards" />
      </div>
    </section>

    <!-- Parceiros -->
    <section class="secao-parceiros" data-ani-type="fade-up">
      <div class="container">
        <h2 class="secao-titulo green">Parceiros</h2>
        <p class="secao-desc">
          Marcas que já utilizaram nosso espaço para campanhas e produções fotográficas.
        </p>

        <div class="parceiros-grid">
          <div v-for="partner in partners" :key="partner.name" class="parceiro-card">
            <h3 class="parceiro-card__nome">{{ partner.name }}</h3>
            <div class="parceiro-card__links">
              <a :href="partner.site" target="_blank" rel="noopener noreferrer" class="parceiro-link">
                <Icon name="icons:external" class="icon" />
                <span>Site oficial</span>
              </a>
              <a :href="partner.instagram" target="_blank" rel="noopener noreferrer" class="parceiro-link">
                <Icon name="mdi:instagram" class="icon" />
                <span>{{ partner.instagramHandle }}</span>
              </a>
            </div>

            <!-- Galeria de campanhas (preencher CF image IDs no script) -->
            <div v-if="partner.campaignImages.length" class="parceiro-card__galeria">
              <nuxt-img
                v-for="(img, i) in partner.campaignImages"
                :key="i"
                :src="configPublic.cloudflareURI + img.imageId + '/public'"
                :alt="img.alt"
                width="400"
                height="300"
                loading="lazy"
                class="parceiro-card__img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mapa -->
    <section class="secao-mapa">
      <SectionsStudioMap />
    </section>

  </div>
</template>

<style scoped lang="scss">
.page-aluguel {
  padding-bottom: 60rem;
}

// Hero
.hero {
  padding-top: 20rem;
  padding-bottom: 50rem;

  .big-title {
    padding-bottom: 20rem;
  }

  &__description {
    font-size: 20rem;
    line-height: 1.6;
    color: v.$green;
    max-width: 680rem;
    padding-bottom: 30rem;

    @include m.max(sm) {
      font-size: 16rem;
    }
  }
}

// Títulos de seção
.secao-titulo {
  font-size: 32rem;
  font-weight: 900;
  font-family: v.$lato;
  text-transform: uppercase;
  padding-bottom: 10rem;

  @include m.max(sm) {
    font-size: 24rem;
  }
}

.secao-desc {
  font-size: 18rem;
  color: #555;
  padding-bottom: 20rem;

  @include m.max(sm) {
    font-size: 15rem;
  }
}

// Preços
.secao-precos {
  background: v.$beige;
  padding: 50rem 0;
  text-align: center;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rem;
  }
}

.precos-grid {
  display: flex;
  gap: 20rem;
  justify-content: center;
  flex-wrap: wrap;
}

.preco-card {
  background: white;
  border-radius: 12rem;
  padding: 30rem 50rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rem;
  box-shadow: 0 2rem 10rem rgba(0, 0, 0, 0.08);
  min-width: 200rem;

  &--destaque {
    border: 2px solid v.$green;
  }

  &__label {
    font-size: 14rem;
    text-transform: uppercase;
    font-weight: 700;
    color: #888;
    letter-spacing: 1px;
  }

  &__valor {
    font-size: 42rem;
    font-weight: 900;
    color: v.$green;
    font-family: v.$lato;
  }
}

.precos-obs {
  font-size: 13rem;
  color: #888;
  max-width: 480rem;
  text-align: center;
}

// Cenários
.secao-cenarios {
  padding: 50rem 0 20rem;
}

// Parceiros
.secao-parceiros {
  padding: 50rem 0;
  background: white;
}

.parceiros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320rem, 1fr));
  gap: 30rem;

  @include m.max(sm) {
    grid-template-columns: 1fr;
  }
}

.parceiro-card {
  border: 1px solid #e8e4d8;
  border-radius: 10rem;
  padding: 24rem;

  &__nome {
    font-size: 22rem;
    font-weight: 900;
    color: v.$green;
    font-family: v.$lato;
    padding-bottom: 12rem;
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 8rem;
    padding-bottom: 16rem;
  }

  &__galeria {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180rem, 1fr));
    gap: 8rem;
    padding-top: 12rem;
  }

  &__img {
    width: 100%;
    height: auto;
    border-radius: 4rem;
    display: block;
  }
}

.parceiro-link {
  display: inline-flex;
  align-items: center;
  gap: 6rem;
  font-size: 15rem;
  color: v.$green;
  text-decoration: underline;

  .icon {
    font-size: 16rem;
    flex-shrink: 0;
  }

  &:hover {
    opacity: 0.75;
  }
}

// Mapa
.secao-mapa {
  padding-top: 10rem;
}
</style>
