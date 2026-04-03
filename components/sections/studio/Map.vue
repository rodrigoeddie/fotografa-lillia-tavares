<script setup lang="ts">
const mapLoaded = ref(false)

const MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14634.106001989638!2d-46.1804627!3d-23.5135586!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cdd92db136d28b%3A0x7dbfca477fd7474f!2sEst%C3%BAdio%20fotogr%C3%A1fico%20Lillia%20Tavares%20em%20Mogi%20das%20Cruzes!5e0!3m2!1spt-BR!2sbr!4v1724005767992!5m2!1spt-BR!2sbr'
</script>

<template>
    <div class="wrap-map">
        <h2 class="title title-map">Estamos localizados em <a href="https://maps.app.goo.gl/2NPyJTUvUs9z12fW7" target="_blank" class="highlight light"><span>Mogi das cruzes, SP</span>. <Icon name="icons:external-link" class="icon"/></a></h2>

        <!-- Facade: iframe só carrega quando o usuário clicar -->
        <div class="map-facade" :class="{ 'is-loaded': mapLoaded }" @click="mapLoaded = true">
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
                <Icon name="mdi:map-marker" class="pin-icon" />
                <span class="placeholder-label">Estúdio Lillia Tavares · Mogi das Cruzes, SP</span>
                <span class="placeholder-cta">Clique para ver no mapa</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .wrap-map {
        padding-top: 30rem;
        padding-bottom: 30rem;
        overflow: hidden;
        width: 100%;

        @include m.max(md) {
            height: 100vw;
        }
    }

    .map-facade {
        position: relative;
        aspect-ratio: 16/5;
        width: 100%;
        overflow: hidden;
        cursor: pointer;

        @include m.max(md) {
            aspect-ratio: 1/1;
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
        gap: 10rem;
        background: #e8e0d0;
        background-image:
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px);
        background-size: 40rem 40rem;
        transition: background-color 0.2s;

        &:hover {
            background-color: #ddd6c5;
        }

        .pin-icon {
            font-size: 48rem;
            color: v.$green;
            filter: drop-shadow(0 2px 6px rgba(0,0,0,.2));
        }

        .placeholder-label {
            font-size: 16rem;
            font-weight: 600;
            color: #3a3a3a;
        }

        .placeholder-cta {
            font-size: 13rem;
            color: #777;
            border: 1px solid #bbb;
            border-radius: 20rem;
            padding: 6rem 16rem;
            background: white;
        }
    }

    .title-map {
        padding: 40rem 0 20rem;
        text-align: center;
        display: block;
        width: 100%;

        .icon {
            font-size: 14rem;
            top: -2rem;
        }

        a {
            transition: background-color 0.2s, color 0.2s;
            background: #f4f2e9;
            padding: 3rem 7rem;

            span {
                text-decoration: underline;
            }

            &:hover {
                background-color: v.$green;
                color: white;
            }
        }
    }
</style>