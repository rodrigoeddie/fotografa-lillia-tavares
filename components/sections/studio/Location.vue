<script setup lang="ts">
const cfImg = useCfImg();
const configPublic = useRuntimeConfig().public;

const mapLoaded = ref(false);

const MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14634.106001989638!2d-46.1804627!3d-23.5135586!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cdd92db136d28b%3A0x7dbfca477fd7474f!2sEst%C3%BAdio%20fotogr%C3%A1fico%20Lillia%20Tavares%20em%20Mogi%20das%20Cruzes!5e0!3m2!1spt-BR!2sbr!4v1724005767992!5m2!1spt-BR!2sbr';
</script>

<template>
  <section class="loc" aria-labelledby="loc-title">
    <div
      class="loc-map"
      :class="{ 'is-loaded': mapLoaded }"
      @click="mapLoaded = true"
      data-track-event="clique-abrir-mapa"
      data-track-screen="estudio-mapa">
        <iframe
          v-if="mapLoaded"
          :src="MAP_SRC"
          width="100%"
          height="600"
          class="iframe-map"
          style="border:0;"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          title="Estúdio fotográfico Lillia Tavares em Mogi das Cruzes"
        />
        <div v-else class="map-placeholder" aria-label="Clique para carregar o mapa">
            <Icon name="icons:location-pin-solid" class="pin-icon" />
            <span class="placeholder-label">Estúdio Lillia Tavares · Mogi das Cruzes, SP</span>
            <span class="btn">Clique para ver no mapa</span>
            <div class="map">
                <nuxt-img
                    provider="cloudflare"
                    :src="cfImg('73237b0c-51ef-4c36-99d1-787235393900')"
                    width="1579"
                    height="494"
                    class="img-map"
                    alt="Mapa de localização do estúdio em Mogi das Cruzes"
                    format="webp"
                    loading="lazy"
                    placeholder />
            </div>
        </div>
    </div>

    <div class="loc-info">
      <span class="eyebrow">Onde fica</span>
      <h2 id="loc-title" class="loc-h2">No coração de Mogi das Cruzes</h2>

      <div class="rows">
        <div class="row-item">
          <span class="ic" aria-hidden="true">
            <Icon name="icons:location-pin-solid" />
          </span>
          <div class="txt">
            <strong>Endereço</strong>
            <span>Centro · Mogi das Cruzes, SP</span>
          </div>
        </div>

        <div class="row-item">
          <span class="ic" aria-hidden="true">
            <Icon name="icons:calendar-regular" />
          </span>
          <div class="txt">
            <strong>Funcionamento</strong>
            <span>Exclusivo por agendamento · seg a sáb</span>
          </div>
        </div>

        <div class="row-item">
          <span class="ic" aria-hidden="true">
            <Icon name="icons:external-link" />
          </span>
          <div class="txt">
            <strong>Como chegar</strong>
            <span>Ótimas opções de estacionamento e transporte por perto.</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <a
          href="https://maps.app.goo.gl/2NPyJTUvUs9z12fW7"
          target="_blank"
          rel="noopener"
          class="btn-rose">
            <Icon name="icons:location-pin-solid" class="icon" />
            Ver no Google Maps
        </a>
        <NuxtLink to="/agende-seu-ensaio" class="btn-ghost">
          Agende seu ensaio
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.loc {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    min-height: 480rem;

    @include m.max(md) {
        grid-template-columns: 1fr;
    }
}

.loc-map {
    position: relative;
    background: #d7d6cd;
    min-height: 360rem;
    overflow: hidden;
    cursor: pointer;

    @include m.max(md) {
        min-height: 300rem;
        aspect-ratio: 16 / 10;
    }

    &.is-loaded {
        cursor: default;
    }
}

.iframe-map {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
}

.map-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12rem;
    background: #e8e0d0;
    transition: background-color 0.2s;

    > * {
        z-index: 1;
    }

    &:hover {
        background-color: #ddd6c5;
    }

    .pin-icon {
        font-size: 48rem;
        color: v.$green;
        filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2));
    }

    .placeholder-label {
        font-size: 20rem;
        font-weight: 700;
        color: v.$green;
        text-align: center;
        padding: 0 15rem;
    }

    .map {
        position: absolute;
        inset: 0;
        z-index: 0;

        .img-map {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        &:before {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(4px);
            z-index: 2;
        }
    }
}

.loc-info {
    background: v.$panel;
    color: white;
    padding: clamp(40rem, 5vw, 64rem) clamp(24rem, 4vw, 52rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 28rem;
}

.eyebrow {
    font-size: 12rem;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: v.$panel-tan;
}

.loc-h2 {
    color: white;
    font-family: v.$lato;
    font-size: clamp(22rem, 2.4vw, 30rem);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    line-height: 1.2;
}

.rows {
    display: flex;
    flex-direction: column;
    gap: 20rem;
}

.row-item {
    display: flex;
    gap: 14rem;
    align-items: flex-start;

    .ic {
        flex-shrink: 0;
        width: 36rem;
        height: 36rem;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        color: v.$panel-tan;
        font-size: 16rem;
    }

    .txt {
        font-size: 15rem;
        line-height: 1.5;

        strong {
            display: block;
            color: white;
            font-weight: 700;
            margin-bottom: 2rem;
        }

        span {
            color: rgba(255, 255, 255, 0.82);
        }
    }
}

.actions {
    display: flex;
    gap: 16rem;
    flex-wrap: wrap;
}

.btn-rose {
    background: v.$rose;
    color: #3a281f;
    font-size: 14rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 15rem 28rem;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 8rem;
    transition: background 0.2s, transform 0.12s;

    &:hover {
        background: #cba297;
        transform: translateY(-2rem);
    }

    &:focus-visible {
        outline: 3px solid white;
        outline-offset: 3px;
    }

    .icon {
        font-size: 14rem;
    }
}

.btn-ghost {
    border: 1.5px solid rgba(255, 255, 255, 0.4);
    color: white;
    font-size: 14rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 15rem 26rem;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 8rem;
    transition: border-color 0.2s, background 0.2s;

    &:hover {
        border-color: white;
        background: rgba(255, 255, 255, 0.08);
    }

    &:focus-visible {
        outline: 3px solid white;
        outline-offset: 3px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .loc-map,
    .btn-rose,
    .btn-ghost {
        transition: none;
    }

    .btn-rose:hover {
        transform: none;
    }
}
</style>
