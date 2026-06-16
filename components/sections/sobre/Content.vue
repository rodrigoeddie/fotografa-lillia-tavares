<script setup lang="ts">
const cfImg = useCfImg()

const image = {
  id: "5aaf1433-aaa7-42ed-7198-15626f964000",
  alt: "Fotógrafa Lillia Tavares segurando sua câmera fotográfica",
  width: 935,
  height: 935,
};
</script>

<template>
  <div class="sobre-page">
    <div class="container">

      <header class="sobre-header">
        <h1 class="big-title green centered">
          Sobre a Fotógrafa Lillia Tavares
        </h1>
      </header>

      <!-- Bio -->
      <div class="sobre-bio">
        <div class="sobre-bio__image">
          <nuxt-img
            provider="cloudflare"
            :src="cfImg(image?.id || '5aaf1433-aaa7-42ed-7198-15626f964000')"
            :alt="image?.alt || 'Fotógrafa Lillia Tavares'"
            :width="image?.width || 935"
            :height="image?.height || 935"
            sizes="100vw sm:50vw md:935px"
            format="webp"
            placeholder
            class="img-sobre"
          />
        </div>

        <div class="description">
          <p>
            Sou fotógrafa em Mogi das Cruzes e consultora de imagem, formada pela Etec de Artes e pelo Senac. Sou especialista em retratos femininos, fotografia corporativa e reposicionamento de imagem, capturando fotografias com intenção, presença e identidade.
          </p>
          <p>
            Cresci cercada pela fotografia, em uma família que sempre fez questão de registrar e
            guardar cada momento vivido. Aprendi desde cedo que imagens não são apenas registros,
            são memórias que atravessam o tempo. Esse olhar atento para os detalhes, para a luz e
            para as emoções me acompanha em cada ensaio.
          </p>
          <p>
            Atuo profissionalmente desde 2019, transformando a fotografia em uma ferramenta de
            fortalecimento da autoestima e construção de imagem. Em junho de 2024, inaugurei meu primeiro estúdio fotográfico em Mogi das Cruzes, criando um espaço pensado para acolher, direcionar e revelar o melhor de cada pessoa.
          </p>
          <p>
            Cada ensaio é uma experiência guiada. Eu direciono poses, expressões e postura de
            forma natural, respeitando a individualidade de cada cliente. Meu objetivo é que você
            se sinta confiante, confortável e verdadeiramente representada nas suas fotos.
          </p>
        </div>
      </div>

      <!-- Serviços -->
      <section class="sobre-servicos">
        <h2 class="title">O que eu ofereço</h2>

        <div class="servicos-grid">

          <!-- Principal: Ensaios -->
          <NuxtLink
            to="/ensaio-fotografico"
            class="servico-card servico-card--principal"
            data-ani-type="fade-up"
          >
            <span class="servico-card__tag">Produto principal</span>
            <h3 class="servico-card__titulo">Ensaios Fotográficos em Mogi das Cruzes</h3>
            <p class="servico-card__desc">
              Retratos femininos, corporativos, gestantes, família e debutantes. Cada sessão é
              conduzida com direção de poses, expressão e postura — tudo para revelar sua melhor
              versão com autenticidade.
            </p>

            <p>Como fotógrafa em Mogi das Cruzes, meu propósito é criar retratos que fortaleçam a autoestima, comuniquem identidade e gerem conexão verdadeira.</p>
            <br>
            <span class="servico-card__cta">Ver tipos de ensaio</span>
          </NuxtLink>

          <!-- Secundário: Estúdio -->
          <NuxtLink
            to="/estudio-fotografico-em-mogi-das-cruzes/aluguel"
            class="servico-card"
            data-ani-type="fade-up"
          >
            <h3 class="servico-card__titulo">Estúdio Fotográfico</h3>
            <p class="servico-card__subtitulo">Aluguel de espaço em Mogi das Cruzes</p>
            <p class="servico-card__desc">
              Sete cenários modernos e sofisticados, do corporativo elegante ao intimista delicado.
              Fácil acesso, ótimas opções de estacionamento e infraestrutura completa para
              fotógrafos e criadores de conteúdo.
            </p>
            <span class="servico-card__cta">Conhecer o espaço</span>
          </NuxtLink>

          <!-- Secundário: Consultoria -->
          <div class="servico-card" data-ani-type="fade-up">
            <h3 class="servico-card__titulo">Consultoria de Imagem</h3>
            <p class="servico-card__desc">
              Análise e reposicionamento de imagem pessoal, disponível de forma independente ou
              como parte do pacote <strong>Do Tom ao Clique</strong>, que une consultoria ao
              ensaio fotográfico em uma experiência única.
            </p>
            <NuxtLink
              to="/analise-coloracao-pessoal-em-mogi"
              class="servico-card__sub-link"
            >
              Análise de Coloração Pessoal
            </NuxtLink>
          </div>

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
