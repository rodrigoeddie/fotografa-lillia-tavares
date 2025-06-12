<script setup lang="ts">
    const configPublic = useRuntimeConfig().public;
    const cenarios = [
        {
            title: 'Escritório',
            descricao: 'Nosso escritório no coração de Mogi das Cruzes foi projetado para também ser um cenário, com perfil despojado, seguindo uma palheta de tons claros atende bem todos estilos corporativos, nossa mesa com textura de marmore branco foi desenvolvida exclusivamente para tornar esse ambiente único!',
            imageBg: {
                id: 0,
                src: configPublic.cloudflareURI + "d4e38b52-1ce0-4e1d-03c8-518779aa9800",
                alt: "O escritório, uma parede verde musgo de fundo com quadros, no centro a mesa, e uma estante na direita"
            },
            example: {
                id: 1,
                src: configPublic.cloudflareURI + "50e4339d-3ba4-4f6a-4b0d-c8618632fb00",
                alt: "Mulher branca de cabelos enrolados na altura do pescoço sentada na cadeira de escritório branca ela está sorrindo vestida de blusinha roxa",
                link: '/ensaio-fotografico/corporativo/pollyanna-goncalves',
                title: 'Pollyanna Gonçalves',
                orientation: 'paisagem',
            },
        },
        {
            title: 'Cenário Intimista',
            descricao: 'Desde o início de sua jornada como fotógrafa em 2018, Lillia Tavares trabalha com fotos sensual intimistas, sendo elas grande inspiração para um olhar delicado e de bom gosto, para que os modelos tenham a melhor visão de sua real beleza. Fizemos esse cantinho pensando na estética boho, esse é o único cenário nesse estilo em Mogi das Cruzes.',
            imageBg: {
                id: 2,
                src: configPublic.cloudflareURI + "5aaf4778-101f-4296-bd37-a5e870ea3400",
                alt: "Foto de um comodo com a cortina iluminada de fundo, da esquerda pra direita: um abajour, uma cama e um violão"
            },
            // example: {
            //     src: configPublic.cloudflareURI + "",
            //     alt: "",
            //     link: '',
            //     title: '',
                // orientation: 'paisagem',
            // },
        },
        {
            title: 'Fundos infinitos',
            descricao: 'Atualmemente oferecemos 4 opções de cores de fundos fotográficos dois claros (bege e branco) e dois escuros (grafite e azul marinho), além da iluminação profissional e de alguns acessórios, como banquetas, uma poltrona, e caixas brancas.',
            imageBg: {
                id: 3,
                src: configPublic.cloudflareURI + "b6dc36df-86b3-4485-52de-8b91ba144f00",
                alt: "Um fundo fotográfico com equipamentos fotográficos"
            },
            example: {
                id: 4,
                src: configPublic.cloudflareURI + "9cfdca56-4b5a-4d12-ae0d-2cfc92489f00",
                alt: "Mulher de cabelos enrolados e blazer azul, esla está de pé com uma perna apoiada em um box branco de madeira 30cm x 30cm",
                link: '/ensaio-fotografico/corporativo/vanessa-lima',
                title: 'Vanessa Lima',
                orientation: 'retrato',
            },
        },
        {
            title: 'Cantinho do espelho',
            descricao: 'O canto preferido da fotógrafa Lillia Tavares para suas selfies, a combinação da parede de madeira freijó com o laranja e o verde das plantas trazem uma estética bem agradável para sua fotos.',
            imageBg: {
                id: 5,
                src: configPublic.cloudflareURI + "e8d30eab-936f-45fd-b450-a21295e9a200",
                alt: "Uma parede laranja com 4 estantes brancas suspensas, uma poltrona, um espelho grande e um puff"
            },
            example: {
                id: 6,
                src: configPublic.cloudflareURI + "60ddc9c8-058d-441e-1608-ca6109de1200",
                alt: "Mulher sorrindo de roupa branca, sentada no chão, uma parte da parede é de madeira freijó, outra, é laranja, há um vaso de plantas grande, e um espelho grande",
                link: '/ensaio-fotografico/corporativo/andresa-maia',
                title: 'Andresa Maia',
                orientation: 'paisagem',
            },
        },
        {
            title: 'Sofá da recepção',
            descricao: `A arquiteta <a href="https://www.instagram.com/studiocnmais" target="_blank">Camila Nogueira</a> estava inspirada ao pensar todos as funções do estúdio como um cenário, sim, nosso cantinho da recepção também tem essa função ❤️, os quadros remetem a referências estéticas da fotógrafa.`,
            imageBg: {
                id: 7,
                src: configPublic.cloudflareURI + "de0a3700-d07a-46fd-1f69-8cc47ebca000",
                alt: "Um canto com um sofá e vários quadros na parede verde musgo"
            },
            example: {
                id: 8,
                src: configPublic.cloudflareURI + "ba0f1af3-4673-47e4-ab41-28bf987e9800",
                alt: "Um canto com um sofá e vários quadros na parede verde musgo, Mulher branca de cabelos enrolados na altura do pescoço sentada no sofá ela está sorrindo vestida de blusinha roxa e calça bege, seu braço esquerdo está apoiado nos braços do sofá, o direito segurando uma xícara de café",
                link: '/ensaio-fotografico/corporativo/pollyanna-goncalves',
                title: 'Pollyanna Gonçalves',
                orientation: 'paisagem',
            },
        },
        {
            title: 'Sofá',
            descricao: 'Junto com o cenário intimista, esse é o cenário que mais se beneficia da luz natural e isso traz um grande benefício para a estética de suas fotos, aproveite o período da tarde para tornar suas fotos ainda melhores',
            imageBg: {
                id: 9,
                src: configPublic.cloudflareURI + "8e112adf-8f3a-4ca8-0d95-ea0176b80600",
                alt: "Foto de um comodo com a cortina iluminada de fundo, dois vazos de planta ao fundo, e um sofá redondo na frente, a parede é de madeira freijó."
            },
            example: {
                id: 10,
                src: configPublic.cloudflareURI + "0a37ed18-db3d-49b2-ac20-68f472793f00",
                alt: "",
                link: '/ensaio-fotografico/corporativo/andresa-maia',
                title: 'Andresa Maia',
                orientation: 'paisagem',
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
        <NuxtLink
          class="hero"
          to="cenarios/dia-das-maes-2025">
            <div class="wrap-breadcrumb">
                <div class="container">
                    <div class="wrap-title-hero">
                        <h1 class="title-hero">
                            <span class="day">Dia das</span>
                            <span class="break"></span>
                            <span class="mother">Mães</span>
                            <span class="break"></span>
                            <span class="year">2025</span>
                        </h1>
                    </div>
                </div>
            </div>

            <nuxt-img
              :src='configPublic.cloudflareURI + "49da8cca-e5b8-4c30-8f5d-4807f088da00/public"'
              width="1920"
              height="868"
              class="img-hero"
              alt='Arranjo de flores em um aramado dourado, um sofá, e dois pendentes de madeira' />
        </NuxtLink>

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
                        <span>Conheça os</span>
                    </span>
    
                    <span class="big">Cenários</span>
                </h2>
            </div>
        </div>

        <div
          class="cenario"
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
    top: 115% !important;
    position: absolute;
    left: 35rem;

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
    overflow: hidden;
    // aspect-ratio: 7/1;

    &:before {
        content: '';

        background: radial-gradient(circle, rgba(44, 42, 21, 1) 0%, rgba(255,255,255, 0) 50%);
        position: absolute;
        display: block;
        opacity: .75;
        height: 150%;
        width: 150%;
        z-index: 2;
        left: -65%;
        top: -50%;

        // @media (prefers-color-scheme: light) {
        //     background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255,255,255, 0) 50%);
        //     opacity: .7;
        // }
    }

    &:after {
        content: '';

        background: #611e10;
        position: absolute;
        display: block;
        height: 10px;
        z-index: 4;
        width: 50%;
        right: 0;
        top: 0;
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
            justify-content: flex-end;
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

            // .box {
            //     @media (prefers-color-scheme: dark) {
            //         background: white;
            //         color: #2c2a15;
            //     }
            // }

            // .big {
            //     text-shadow: none;

            //     @media (prefers-color-scheme: dark) {
            //         color: white;
            //     }
            // }
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
        // background: white;

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
        background: rgba(255, 255, 255, .8);

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