<script setup lang="ts">
    const configPublic = useRuntimeConfig().public;
    const cenarios = [
        //3a423fad-5856-4554-c680-fe995c0bcb00
        //img - retrato

        {
            title: 'O Cenário',
            descricao: 'Para uma visão geral do cenário que preparamos para o <b>Dia das Mães 2025</b> fizemos um cantinho cheio de sofisticação com cores puxadas para o dourado e off-white.',
            imageBg: {
                id: 0,
                src: configPublic.cloudflareURI + "58acda17-3c27-42e0-227d-e760faa76d00",
                alt: "Nosso cenário para o dia das mães: Um floral em um aramado dourado na esquerda, um sofá off-white redonto, pendentes de madeira, e uma cortina branca"
            },
            example: {
                id: 1,
                src: configPublic.cloudflareURI + "b25c4856-522b-4367-2aac-6f1c36111100",
                alt: "No fundo cenário do dia das mães: Sentadas no sofá da esquerda pra direita: Uma mulher (a mãe) com vestido longo azul, uma mulher mais velha com paletó branco, calça branca e camisa azul (a avó), e uma mulher mais nova com uma blusinha branca e uma camisa listrada azul por cima, e calça azul, as três mulheres são negras de cabelos crespos",
                link: '/ensaio-fotografico/dia-das-maes-2025/lillia-tavares',
                title: 'Dia das Mães - Lillia Tavares',
            },
        },
        {
            title: 'Decoração',
            descricao: 'Um zoom nos detalhes da decoração que escolhemos para o cenário do Dia das Mães.',
            imageBg: {
                id: 2,
                src: configPublic.cloudflareURI + "49636a87-a093-4577-4b61-4b1bed232500",
                alt: ""
            },
        },
        {
            title: 'Floral',
            descricao: 'No <b>Dia das Mães</a> não podem faltar as flores, e demos nosso melhor para que as cores do arranjo converse perfeitamente com todos os elementos do cenário, esperamos que você tenha gostado.',
            imageBg: {
                id: 3,
                src: configPublic.cloudflareURI + "6ea326b0-e9e1-4b05-29c1-46146f52a400",
                alt: ""
            },
            example: {
                id: 4,
                src: configPublic.cloudflareURI + "1754195e-e114-473f-941f-bfd589ab7a00",
                alt: "No fundo cenário do dia das mães: Uma mulher em pé com calça bege, e uma blusinha de manga longa branca, sentada de mãos dadas está uma mulher mais nova com uma blusinha branca e uma camisa listrada azul por cima, e calça azul, as duas mulheres são negras de cabelos crespos",
                link: '/ensaio-fotografico/dia-das-maes-2025/lillia-tavares',
                title: 'Dia das Mães - Lillia Tavares',
                orientation: 'retrato',
            },
        },
        // {
        //     title: '',
        //     descricao: '',
        //     imageBg: {
        //         src: configPublic.cloudflareURI + "",
        //         alt: ""
        //     },
        //     example: {
        //         src: configPublic.cloudflareURI + "",
        //         alt: "",
        //         link: '',
        //         title: '',
        //     },
        // },
    ];

    const visibleRef = ref(false);
    const indexRef = ref(0);

    const imgs = cenarios.flatMap(cenario => {
        const images = [{
            id: cenario.imageBg.id,
            src: cenario.imageBg.src + '/public',
            title: '',
        }];

        if (cenario.example) {
            images.push({
                id: cenario.example.id,
                src: cenario.example.src + '/public',
                title: '',
            });
        }

        return images;
    });

    // imgs.push({
    //     id: 11,
    //     src: configPublic.cloudflareURI + "49da8cca-e5b8-4c30-8f5d-4807f088da00/public",
    //     title: '',
    // });

    const showImg = (index: number) => {
        indexRef.value   = index;
        visibleRef.value = true;
    };

    const onHide = () => (visibleRef.value = false);
</script>

<template>
    <div class="wrapper">
        <div class="hero">
            <div class="wrap-breadcrumb">
                <div class="container">
                    <nav aria-label="breadcrumb">
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">
                                <NuxtLink to="/">Home</NuxtLink>
                            </li>
                            <li class="breadcrumb-item">
                                <NuxtLink to="/estudio">Estúdio</NuxtLink>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">Cenários</li>
                        </ul>
                    </nav>

                    <div class="wrap-title">
                        <h2 class="big-title red centered">
                            <span class="box">
                                <span>Conheça nosso cenário do</span>
                            </span>

                            <span class="big"> dia das mães 2025</span>
                        </h2>
                    </div>
                </div>
            </div>
        </div>

        <div
          class="cenario"
          :class="'cenario-' + index"
          v-for="(cenario, index) in cenarios">
            <div class="container">
                <nuxt-img
                  :src='cenario.imageBg.src + "/public"'
                  width="612"
                  height="408"
                  @click="() => showImg(cenario.imageBg.id)"
                  class="img-cenario"
                  :alt='cenario.imageBg.alt'
                  loading="lazy" />
                <div
                  class="wrap-link-example"
                  v-if='cenario.example'>
                    <nuxt-img
                      :src='cenario.example.src + "/public"'
                      :alt='cenario.example.alt'
                      width="300"
                      height="200"
                      loading="lazy"
                      :class='"img-example " + cenario.example.orientation'
                      @click="() => showImg(cenario.example.id)"/>
                    <NuxtLink
                      v-if='cenario.example.link'
                      class="link-example"
                      :to="cenario.example.link">
                        <span>Acessar trabalho com esse cenário:<br>
                            <strong>{{ cenario.example.title }}</strong>
                        </span>
                    </NuxtLink>
                </div>

                <div class="text">
                    <h3>{{ cenario.title }}</h3>
                    <p class="description" v-html='cenario.descricao'></p>
                </div>
            </div>
        </div>

        <VueEasyLightbox
          :visible="visibleRef"
          :imgs="imgs"
          :index="indexRef"
          :rotateDisabled="true"
          :zoomDisabled="true"
          @hide="onHide"
        />
    </div>
</template>

<style scoped lang="scss">
nav[aria-label=breadcrumb] {
    top: 145% !important;
    position: absolute;
    left: 35rem;

    @media (prefers-color-scheme: light) {
        color: white;
    }

    @include m.max(xs) {
        top: 40% !important;
    }

    .breadcrumb {
        padding: 0 !important;
        z-index: 3;
    }
}

.hero {
    background: #2c2a15;
    height: 200rem;
    // aspect-ratio: 7/1;

    @media (prefers-color-scheme: light) {
        background: white;
    }

    @media (prefers-color-scheme: dark) {
        &:before {
            content: '';

            background: radial-gradient(circle, rgba(44,42,21,1) 0%, rgba(255,255,255, 0) 50%);
            position: absolute;
            left: -65%;
            top: -50%;
            height: 150%;
            display: block;
            opacity: .75;
            width: 150%;
            z-index: 2;
        }

        &:after {
            content: '';

            background: #611e10;
            position: absolute;
            display: block;
            height: 10px;
            z-index: 4;
            width: 67%;
            right: 0;
            top: 0;
        }
    }

    .wrap-breadcrumb {
        position: absolute;
        height: 100%;
        z-index: 3;
        right: 0;
        left: 0;
        top: 0;

        .container {
            height: 100%;
            justify-content: center;
        }
    }

    .wrap-title-hero {
        .title-hero {
            text-transform: uppercase;
            justify-content: center;
            flex-direction: column;
            align-items: flex-end;
            padding-bottom: 20rem;
            font-family: v.$lato;
            font-weight: 900;
            color: white;
            display: flex;
            height: 100%;
            right: 0;

            span {
                background: rgba(169, 122, 9, .7);
                padding: 0 30rem;
                margin: 5rem 0;

                &.break {
                    display: block;
                }
            }

            .day {
                font-size: 48rem;
                // color: #f0deda;
            }
            .mother {
                font-size: 150rem;
            }
            .year {
                font-size: 115rem;
                // color: #f0deda;
            }
        }
    }

    .img-hero {
        display: block;
        margin: 0 auto;
        height: auto;
    }

    .container {
        justify-content: center;
        align-items: flex-end;
        display: flex;
    }

    .wrap-title {
        margin-bottom: -8rem;
        display: inline-flex;
        padding-bottom: 5rem;
        padding-left: 12rem;
        padding-top: 5rem;
        z-index: 2;

        .big-title {
            padding-right: 20rem;
            padding-top: 0;

            @include m.max(sm) {
                padding-right: 0;
            }

            .box {
                @media (prefers-color-scheme: dark) {
                    background: white;
                    color: #2c2a15;
                }
            }

            .big {
                text-shadow: none;

                @media (prefers-color-scheme: dark) {
                    color: white;
                }
            }
        }
    }
}

.cenario {

    .container {
        align-items: center;
        display: flex;
        padding: 20px;
        gap: 30rem;

        @include m.max(md) {
            flex-direction: column;
            max-width: 1024rem;
        }

        @include m.max(xs) {
            max-width: 100%;
        }
    }

    .text {
        @include m.max(md) {
            order: 1;
        }
    }

    .img-cenario {
        max-height: 650rem;
        cursor: zoom-in;
        height: auto;
        width: auto;

        @include m.max(md) {
            max-height: none;
            width: 100%;
            order: 2;
        }
    }

    .wrap-link-example {
        flex-shrink: 0;

        @include m.max(md) {
            margin-top: -100rem;
            order: 3;
        }

        .link-example {
            // position: absolute;
            font-size: 16rem;
            padding: 5rem 10rem;
            background: white;
            margin-top: 10rem;
            display: block;
            color: v.$red;
            width: 100%;
            top: 102%;
            right: 0;
        }

        .img-example {
            border: 3rem solid white;
            cursor: zoom-in;
            display: block;
            height: auto;

            &.paisagem {
                width: 380rem;
            }

            &.retrato {
                width: 285rem;
            }
        }
    }

    &:nth-child(even) {
        background: #892c1a;

        @media (prefers-color-scheme: light) {
            color: white;
        }

        @include m.min(md) {
            padding-right: 30rem;
        }

        .wrap-link-example {
            margin-left: -130rem;

            @include m.max(md) {
                margin-left: 0;
            }
        }
    }

    &:nth-child(odd) {
        background: white;

        @media (prefers-color-scheme: dark) {
            background: #2c2a15;
        }

        @include m.min(md) {
            padding-left: 30rem;
            text-align: right;
        }

        .container {
            @include m.min(md) {
                flex-direction: row-reverse;
            }
        }

        .wrap-link-example {
            margin-right: -100rem;

            @include m.max(md) {
                margin-right: 0;
            }
        }
    }

    &.cenario-0 {
        padding-top: 100rem;
    }

    h3 {
        text-transform: uppercase;
        font-family: v.$lato;
        font-size: 30rem;
        padding-bottom: 10rem;
        font-weight: 900;
    }
}

.description {
    a {
        text-decoration: underline;
    }
}
</style>