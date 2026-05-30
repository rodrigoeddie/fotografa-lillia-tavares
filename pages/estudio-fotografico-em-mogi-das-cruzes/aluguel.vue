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

type CampaignImage = { imageId: string; alt: string; orientation: 'landscape' | 'portrait' };
type Campaign = { name: string; images: CampaignImage[] };

const partners = [
  {
    name: "Shoebiz",
    site: "https://www.shoebiz.com.br/",
    instagram: "https://www.instagram.com/shoebiz_official/",
    instagramHandle: "@shoebiz_official",
    campaigns: [
      {
        name: 'Campanha Dia dos Pais',
        images: [
          { imageId: '347bcde0-d1ad-4d22-5834-83a000119900', alt: 'pai e filho sentados olhando para a câmera', orientation: 'landscape' },
          { imageId: 'd82d77c0-1b65-4e10-4cb0-067f0c879d00', alt: 'pai e filho sentados no sofá se entre-olhando', orientation: 'portrait' },
          { imageId: 'fc45b48b-c975-49a4-9e76-e875c1d26e00', alt: 'pai e filho correndo para a câmera, vestindo blusa fina em tons de azul e calça jeans', orientation: 'portrait' },
          { imageId: '7e0940da-69d3-48e3-476b-f84bf95b6500', alt: 'pai de jaqueta marrom sentado em um banquinho preto, filho de jaqueta preta em pé ao lado', orientation: 'portrait' },
        ] as CampaignImage[],
      },
      {
        name: 'Campanha Dia dos Namorados',
        images: [
          { imageId: '3670746a-2471-4e27-a9c4-1acaca48c700', alt: 'Namorado e Namorada se entre-olhando sentados no sofá', orientation: 'landscape' },
          { imageId: '72aaa2f6-cf61-4766-6727-abf9964fd500', alt: 'Namorado e Namorada se abraçando', orientation: 'portrait' },
          { imageId: 'c210f5e0-31b3-4d72-530a-299e71d4ae00', alt: 'Namorado servindo café para a namorada sentada no sofá lendo um livro', orientation: 'portrait' },
          { imageId: '8780619f-d1ae-4be8-c82e-c19990871e00', alt: 'Namorado deitado no colo da namorada', orientation: 'portrait' },
        ] as CampaignImage[],
      },
    ] as Campaign[],
  },
  {
    name: "LA'S CLOTHING®",
    site: "https://www.lasclothing.com.br",
    instagram: "https://www.instagram.com/las.clothing",
    instagramHandle: "@las.clothing",
    campaigns: [] as Campaign[],
  },
];

function firstLandscapeIndex(images: CampaignImage[]) {
  return images.findIndex(img => img.orientation === 'landscape');
}
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
      <h1 class="big-title">
        Aluguel de Estúdio Fotográfico em Mogi das Cruzes
      </h1>
      <p class="description">
        Nosso estúdio fotográfico está disponível para locação por hora ou diária.
        Ideal para fotógrafos, marcas, e-commerce e produções criativas.
        7 cenários modernos, fundo infinito em 4 cores e equipamentos disponíveis.
      </p><br><br>
      <NuxtLink
          to="https://wa.me/5511911159795?text=Olá, vim pelo seu site e queria mais informações sobre aluguel do estúdio..."
          class="btn"
          target="_blank"
          aria-label="Entrar em contato via WhatsApp"
          rel="noopener noreferrer">
        <span>Solicitar orçamento</span>
      </NuxtLink>
    </section>

    <!-- Preços -->
    <section class="secao-precos" data-ani-type="fade-up">
      <div class="container">
        <h2 class="big-title">Valores</h2>
        <div class="precos-grid">
          <div class="preco-card">
            <span class="label">Por hora</span>
            <span class="valor">R$ 130</span>
          </div>
          <div class="preco-card destaque">
            <span class="label">Diária</span>
            <span class="valor">R$ 800</span>
          </div>
        </div>
        <p class="description">
          Valores sujeitos a alteração. Entre em contato para confirmar disponibilidade e fechar sua reserva.
        </p>
        <NuxtLink
          to="https://wa.me/5511911159795?text=Olá, vim pelo seu site e queria mais informações sobre aluguel do estúdio..."
          class="btn"
          target="_blank"
          aria-label="Entrar em contato via WhatsApp"
          rel="noopener noreferrer">
          <span>Reservar minha data</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Cenários disponíveis (cards compactos) -->
    <section class="secao-cenarios" data-ani-type="fade-up">
      <div class="container">
        <h2 class="big-title">Cenários disponíveis</h2>
        <p class="description">
          Todos os cenários estão incluídos na locação.
        </p>
        <SectionsStudioCenariosCards :cenarios="cenarioCards" />
      </div>
    </section>

    <!-- Parceiros -->
    <section class="secao-parceiros" data-ani-type="fade-up">
      <div class="container">
        <h2 class="big-title">Parceiros</h2>
        <p class="description">
          Marcas que já utilizaram nosso espaço para campanhas e produções fotográficas.
        </p>
        <br>

        <div class="parceiros-grid">
          <div v-for="partner in partners" :key="partner.name" class="parceiro-card">
            <h3 class="partner-name">{{ partner.name }}</h3>
            <div class="links">
              <a :href="partner.site" target="_blank" rel="noopener noreferrer" class="parceiro-link">
                <Icon name="icons:external" class="icon" />
                <span>Site oficial</span>
              </a>
              <a :href="partner.instagram" target="_blank" rel="noopener noreferrer" class="parceiro-link">
                <Icon name="mdi:instagram" class="icon" />
                <span>{{ partner.instagramHandle }}</span>
              </a>
            </div>

            <!-- Campanhas (preencher CF image IDs no script) -->
            <template v-if="partner.campaigns.length">
              <div
                v-for="campaign in partner.campaigns"
                :key="campaign.name"
                class="parceiro-campanha"
              >
                <h4 class="nome">{{ campaign.name }}</h4>
                <div class="parceiros-galeria">
                  <nuxt-img
                    v-for="(img, i) in campaign.images"
                    :key="i"
                    provider="cloudflare"
                    :src="'https://images.fotografalilliatavares.com.br/images/' + img.imageId + '/public'"
                    :alt="img.alt"
                    width="img.orientation == 'landscape' ? '1400' : '500'"
                    loading="lazy"
                    :class="['parceiro-card-img', { 'campain-hero': i === firstLandscapeIndex(campaign.images) }]"
                  />
                </div>
              </div>
            </template>
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
  background: #f7f4e8;
  padding: 50rem 0;
  text-align: center;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rem;
  }

  .big-title {
    padding-top: 0;
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
  padding: 30rem 50rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rem;
  min-width: 200rem;
  box-shadow:
    0 1px 0 #ECE4D2,
    0 14px 30px -12px rgba(42, 37, 32, 0.25),
    0 4px 10px -4px rgba(42, 37, 32, 0.10);

  &.destaque {
    border: 2px solid v.$green;
  }

  .label {
    font-size: 14rem;
    text-transform: uppercase;
    font-weight: 700;
    color: #888;
    letter-spacing: 1px;
  }

  .valor {
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
  background: white;
}

.parceiro-card {
  margin-bottom: 30rem;
  padding: 24rem;
  box-shadow:
    0 1px 0 #ECE4D2,
    0 14px 30px -12px rgba(42, 37, 32, 0.25),
    0 4px 10px -4px rgba(42, 37, 32, 0.10);

  .partner-name {
    font-weight: bold;
    font-size: 29rem;
    color: v.$red;
  }

  .links {
    margin-bottom: 4rem;
    padding-top: 15rem;
    flex-wrap: wrap;
    display: flex;
    gap: 16rem;
  }

  .parceiro-link {
    display: inline-flex;
    align-items: center;
    gap: 6rem;
    font-size: 19rem;
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

  .parceiro-campanha {
    margin-top: 25rem;

    .nome {
      margin-bottom: 10rem;
      font-weight: bold;
      font-size: 20rem;
      color: #999;
    }

    .parceiros-galeria {
      columns: 3;
      gap: 6rem;
    }
  }

  .parceiro-card-img {
    display: block;
    width: 100%;
    margin-bottom: 6rem;

    &.campain-hero {
      column-span: all;
    }
  }
}

// Mapa
.secao-mapa {
  padding-top: 10rem;
}
</style>
