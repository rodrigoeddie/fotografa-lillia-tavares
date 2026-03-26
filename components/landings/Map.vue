
<script setup>
import { data } from 'autoprefixer';

const props = defineProps({
  lp: {
    type: String,
    required: true,
    default: ''
  },
  data: {
    type: Object,
    required: false,
    default: {
        title: 'Estúdio Fotográfico em Mogi das Cruzes',
        description: '<p>Estamos localizados em frente ao estacionamento da Prefeitura de Mogi das Cruzes, com fácil acesso para toda a região do Alto Tietê. Estamos próximos às principais vias de acesso, pontos de ônibus e à estação de trem Estudantes.</p>',
        finalDescription: ``,
    }
  }
});
</script>

<template>
    <section>
        <div class="container wrapper-map">
            <div class="image">
                <a href="https://maps.app.goo.gl/2NPyJTUvUs9z12fW7" target="_blank">
                    <nuxt-img
                        provider="cloudflare"
                        :src='"https://images.fotografalilliatavares.com.br/images/11cdaead-933f-4b58-cb28-68e29ed44900/public"'
                        width="380"
                        height="342"
                        class="map"
                        :alt="'mapa de localização do estúdio em Mogi das Cruzes'"
                        format="webp"
                        placeholder />
                </a>
            </div>

            <div class="text">
                <h1 class="title-lp">
                    {{ props.data.title }}
                </h1>
                <div class="description" v-html="props.data.description"></div>
                <h2>Endereço</h2>
                <p class="description">
                    <a href="https://maps.app.goo.gl/2NPyJTUvUs9z12fW7" target="_blank">
                        Av. Ver. Narciso Yague Guimarães, 124 - Sala 21<br>
                        Vila Partenio - Mogi das Cruzes - SP<br>
                        CEP: 08780-200
                    </a>
                </p>
                <h3>Atendemos toda a região do Alto Tietê:</h3>
                <p>Recebemos clientes para ensaio fotográfico em Mogi das Cruzes e cidades próximas, como:</p>
                <ul>
                    <li>Mogi das Cruzes</li>
                    <li>Suzano</li>
                    <li>Arujá</li>
                    <li>Poá</li>
                    <li>Guararema</li>
                    <li>Biritiba Mirim</li>
                    <li>Ferraz de Vasconcelos</li>
                    <li>Itaquaquecetuba</li>
                </ul>
            </div>
            <div
              class="description description-final"
              v-if="props.data.finalDescription"
              v-html="props.data.finalDescription"></div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.wrapper-map {
    padding-bottom: 30rem;
    flex-wrap: wrap;
    display: flex;
    gap: 40rem;
    
    @include m.max(xs) {
        flex-direction: column;
        padding-bottom: 50rem;
        max-width: 340px;
    }

    .image {
        flex-shrink: 0;

        @include m.max(sm) {
            width: 40%;
        }

        @include m.max(xs) {
            width: 100%;
        }

        .map {
            aspect-ratio: 380 / 342;
            height: auto;
        }
    }

    .text {
        width: calc(100% - 421px);

        @include m.max(sm) {
            width: 100%;
        }
    }

    .title-lp {
        text-align: left;
        padding-top: 0;
        margin-bottom: 0;

        @include m.max(xs) {
            padding-left: 0;
        }
    }

    .description {
        padding-top: 10rem;

        @include m.max(sm) {
            font-size: 19rem;
        }
    }

    .description-final {
        text-align: center;
        width: 100%;
    }

    ul {
        padding-left: 15rem;
        padding-top: 15rem;
        column-count: 2;
        max-width: 483rem;

        li {
            list-style: disc;
            font-size: 19rem;
        }
    }

    h2 {
        font-weight: bold;
        padding-top: 20rem;
        font-size: 25rem;
    }
    
    h3 {
        padding-top: 20rem;
        font-size: 20rem;
        font-weight: bold;
    }
}

.lp-corporativo {
    color: v.$lp-corporativo;

    .description {
        color: v.$lp-corporativo;
    }
}

.lp-dia-das-maes {
    color: v.$lp-dia-das-maes;

    .description {
        color: v.$lp-dia-das-maes;
    }
}

.lp-presentes {
    color: v.$lp-presentes;

    .description {
        color: v.$lp-presentes;
    }
}
</style>

