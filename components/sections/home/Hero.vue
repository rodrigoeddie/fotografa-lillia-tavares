<script lang="ts" setup>
const cfImg = useCfImg()

const heroPhoto = cfImg('29312476-e688-4fbe-f905-e7adafc52500')

const services = [
  { num: '01', title: 'Ensaios fotográficos', to: '/ensaio-fotografico', highlight: true },
  { num: '02', title: 'Aluguel do estúdio', to: '/estudio-fotografico-em-mogi-das-cruzes/aluguel' },
  { num: '03', title: 'Análise de coloração pessoal', to: '/analise-coloracao-pessoal-em-mogi' },
]
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="container">
      <div class="shell">
        <div class="intro">
          <p class="eyebrow">Mogi das Cruzes · Alto Tietê</p>

          <h1 id="hero-title" class="lead">
            Fotógrafa
            <span>em Mogi das Cruzes</span>
          </h1>

          <div class="body">
            <p>Especialista em retratos femininos, fotografia corporativa e reposicionamento de imagem. Transformo cada ensaio fotográfico em uma experiência acolhedora, criando imagens que comunicam autenticidade, confiança e profissionalismo.</p>
            <p>
              <NuxtLink to="/estudio-fotografico-em-mogi-das-cruzes">Estúdio próprio e atendimento para todo o Alto Tietê.</NuxtLink>
            </p>
          </div>

          <div class="actions">
            <NuxtLink
              to="/agende-seu-ensaio"
              class="btn primary"
              data-track-event="cta-agendar-home">
              <span>Agendar meu ensaio</span>
              <Icon name="icons:arrow-right" class="icon" />
            </NuxtLink>

            <div class="quick-links">
              <NuxtLink
                to="/ensaio-fotografico"
                data-track-event="cta-ver-portfolio">
                <Icon name="icons:image-regular" class="icon" />
                <span>Ver meus trabalhos</span>
              </NuxtLink>

              <NuxtLink
                to="/estudio-fotografico-em-mogi-das-cruzes"
                data-track-event="cta-ver-estudio">
                <Icon name="icons:location-pin-solid" class="icon" />
                <span>Conhecer o estúdio</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="aside">
          <nav class="services-panel" aria-label="Serviços">
            <NuxtLink
              v-for="service in services"
              :key="service.num"
              :to="service.to"
              class="service"
              :class="{ highlight: service.highlight }">
              <span class="num">{{ service.num }}</span>
              <span class="name">{{ service.title }}</span>
            </NuxtLink>

            <NuxtLink to="/agende-seu-ensaio" class="panel-cta">
              <span>Agendar agora</span>
              <Icon name="icons:arrow-right" class="icon" />
            </NuxtLink>
          </nav>

          <div class="photo">
            <nuxt-img
              provider="cloudflare"
              :src="heroPhoto"
              alt="Fotógrafa Lillia Tavares em seu estúdio em Mogi das Cruzes"
              sizes="100vw md:30vw"
              width="700"
              height="900"
              format="avif"
              fetchpriority="high"
              preload
              loading="eager"
              class="img cover" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use 'sass:color';

/* painel sage: escurece o verde da marca p/ garantir contraste AA do texto branco */
$panel: color.adjust(v.$green, $lightness: -7%);
$olive-light: color.adjust(v.$green, $lightness: 15%);

.hero {
  margin-top: 15rem;

  .shell {
    @include m.card-shadow;
    background: white;
    overflow: hidden;
    min-height: 480rem;
    display: flex;

    @include m.max(md) {
      flex-direction: column;
      min-height: 0;
    }
  }
}

.intro {
  flex: 0 0 50%;
  flex-direction: column;
  justify-content: center;
  padding: 44rem;
  display: flex;
  gap: 16rem;

  @include m.max(md) {
    flex: none;
    padding: 32rem 24rem;
  }

  @include m.max(xs) {
    padding: 24rem 18rem;
  }
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: .18em;
  align-items: center;
  color: $olive-light;
  font-weight: 700;
  font-size: 13rem;
  display: flex;
  gap: 10rem;

  &::before {
    background: $olive-light;
    content: '';
    height: 1px;
    width: 28rem;
  }
}

.lead {
  color: v.$dark-green;
  font-weight: 900;
  font-size: clamp(34rem, 4.2vw, 46rem);
  line-height: 1.08;

  span {
    color: $olive-light;
    font-weight: 300;
    font-size: clamp(22rem, 3vw, 30rem);
    display: block;
  }
}

.body {
  color: v.$green;
  font-size: 17rem;
  line-height: 1.7;

  p + p {
    margin-top: 10rem;
  }

  a {
    transition: border-color .2s;
    border-bottom: 1px solid $olive-light;

    &:hover {
      border-color: v.$green;
    }
  }
}

.actions {
  flex-direction: column;
  align-items: flex-start;
  margin-top: 6rem;
  display: flex;
  gap: 16rem;
}

.primary {
  gap: 10rem;

  .icon {
    font-size: 16rem;
  }
}

.quick-links {
  flex-direction: column;
  display: flex;
  gap: 2rem;

  a {
    transition: border-color .2s, color .2s;
    border-bottom: 1px solid transparent;
    align-items: center;
    color: v.$green;
    padding: 8rem 0;
    font-size: 16rem;
    display: flex;
    gap: 10rem;

    &:hover {
      border-color: $olive-light;
      color: v.$dark-green;
    }

    .icon {
      font-size: 18rem;
      opacity: .7;
    }
  }
}

.aside {
  flex: 0 0 50%;
  overflow: hidden;
  display: flex;

  @include m.max(md) {
    flex: none;
  }

  @include m.max(sm) {
    flex-direction: column-reverse;
  }
}

.services-panel {
  flex-direction: column;
  justify-content: center;
  background: $panel;
  position: relative;
  padding: 32rem 26rem;
  overflow: hidden;
  flex: 0 0 42%;
  display: flex;

  @include m.max(sm) {
    flex: none;
  }

  &::before {
    background-image: radial-gradient(circle, rgba(255, 255, 255, .06) 1px, transparent 1px);
    background-size: 16rem 16rem;
    pointer-events: none;
    position: absolute;
    content: '';
    inset: 0;
  }

  .service {
    border-bottom: 1px solid rgba(255, 255, 255, .16);
    transition: padding-left .2s;
    position: relative;
    align-items: baseline;
    padding: 14rem 0;
    color: white;
    display: flex;
    gap: 12rem;
    z-index: 1;

    &:hover {
      padding-left: 6rem;
    }

    &.highlight .name {
      color: v.$light-green;
      font-weight: 700;
    }

    .num {
      color: rgba(255, 255, 255, .7);
      font-weight: 700;
      font-size: 14rem;
      flex-shrink: 0;
    }

    .name {
      font-size: 20rem;
      line-height: 1.3;
    }
  }

  .panel-cta {
    transition: gap .2s;
    text-transform: uppercase;
    letter-spacing: .1em;
    align-items: center;
    margin-top: 20rem;
    font-weight: 700;
    font-size: 15rem;
    color: white;
    display: flex;
    z-index: 1;
    gap: 8rem;

    .icon {
      font-size: 14rem;
    }

    &:hover {
      gap: 12rem;
    }
  }
}

.photo {
  position: relative;
  overflow: hidden;
  flex: 1;

  @include m.max(sm) {
    aspect-ratio: 3 / 2;
    flex: none;
  }

  .cover {
    object-position: center top;
  }
}

@media (prefers-reduced-motion: reduce) {
  .service,
  .panel-cta,
  .quick-links a,
  .body a {
    transition: none;
  }
}
</style>
