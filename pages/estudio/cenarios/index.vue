<script setup lang="ts">
    const configPublic = useRuntimeConfig().public;

    const visibleRef = ref(false);
    const indexRef = ref(0);
    const imgs = [
        {
            src: configPublic.cloudflareURI + "d4e38b52-1ce0-4e1d-03c8-518779aa9800/public",
            title: ""
        },
        {
            src: configPublic.cloudflareURI + "5aaf4778-101f-4296-bd37-a5e870ea3400/public",
            title: ""
        },
        {
            src: configPublic.cloudflareURI + "b6dc36df-86b3-4485-52de-8b91ba144f00/public",
            title: ""
        },
        {
            src: configPublic.cloudflareURI + "e8d30eab-936f-45fd-b450-a21295e9a200/public",
            title: ""
        },
        {
            src: configPublic.cloudflareURI + "de0a3700-d07a-46fd-1f69-8cc47ebca000/public",
            title: ""
        },
        {
            src: configPublic.cloudflareURI + "8e112adf-8f3a-4ca8-0d95-ea0176b80600/public",
            title: ""
        },
        //
        {
            src: configPublic.cloudflareURI + "0a37ed18-db3d-49b2-ac20-68f472793f00/public",
            title: ""
        },
        {
            src: configPublic.cloudflareURI + "ba0f1af3-4673-47e4-ab41-28bf987e9800/public",
            title: ""
        },
        {
            src: configPublic.cloudflareURI + "50e4339d-3ba4-4f6a-4b0d-c8618632fb00/public",
            title: ""
        },
        {
            src: configPublic.cloudflareURI + "60ddc9c8-058d-441e-1608-ca6109de1200/public",
            title: ""
        },
    ];

    const showImg = (index) => {
        indexRef.value   = index;
        visibleRef.value = true;
    };

    const onHide = () => (visibleRef.value = false);
</script>

<template>
    <div class="wrapper">
        <div class="hero">
            <div class="container">
                <div class="wrap-title">
                    <h1 class="big-title red centered">
                        <span class="box">
                            <span>Conheça os</span>
                        </span>
    
                        <span class="big">Cenários</span>
                    </h1>
                </div>

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
            </div>
        </div>

        <div class="cenario">
            <div class="container">
                <nuxt-img
                  :src='configPublic.cloudflareURI + "d4e38b52-1ce0-4e1d-03c8-518779aa9800/public"'
                  width="612"
                  height="408"
                  @click="() => showImg(0)"
                  class="img-cenario"
                  alt="O escritório, uma parede verde musgo de fundo com quadros, no centro a mesa, e uma estante na direita"
                  loading="lazy" />
                <div class="wrap-link-example">
                    <nuxt-img
                      :src='configPublic.cloudflareURI + "50e4339d-3ba4-4f6a-4b0d-c8618632fb00/public"'
                      alt="Mulher branca de cabelos enrolados na altura do pescoço sentada na cadeira de escritório branca ela está sorrindo vestida de blusinha roxa"
                      width="300"
                      height="200"
                      class="img-example"
                      @click="() => showImg(8)"/>
                    <NuxtLink
                      class="link-example"
                      to="/ensaio-fotografico/corporativo/pollyanna-goncalves">
                            <span>Acessar trabalho com esse cenário:<br>
                                <strong>Pollyanna Gonçalves</strong>
                            </span>
                    </NuxtLink>
                </div>

                <div class="text">
                    <h2>Escritório</h2>
                    <p class="description">
                        Nosso escritório foi projetado para também ser um cenário, com perfil despojado, seguindo uma palheta de tons claros atende bem todos estilos corporativos, nossa mesa com textura de marmore branco foi desenvolvida exclusivamente para tornar esse ambiente único!
                    </p>
                </div>
            </div>
        </div>

        <div class="cenario">
            <div class="container">
                <nuxt-img
                :src='configPublic.cloudflareURI + "5aaf4778-101f-4296-bd37-a5e870ea3400/public"'
                width="612"
                height="408"
                @click="() => showImg(1)"
                class="img-cenario"
                alt="O escritório, uma parede verde musgo de fundo com quadros, na esquerda um sofá, no centro a mesa, e uma estante na direita"
                loading="lazy" />
                <div class="text">
                    <h2>Cenário Intimista</h2>
                    <p class="description">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. At obcaecati magni, magnam expedita fuga maiores mollitia, rerum veritatis facere odit praesentium suscipit nemo maxime quod voluptatem consequuntur enim labore libero.
                    </p>
                </div>
            </div>
        </div>

        <div class="cenario">
            <div class="container">
                <nuxt-img
                :src='configPublic.cloudflareURI + "b6dc36df-86b3-4485-52de-8b91ba144f00/public"'
                alt="Um fundo fotográfico com equipamentos fotográficos"
                width="612"
                height="408"
                @click="() => showImg(2)"
                class="img-cenario"
                fetchpriority="high"/>
                <div class="text">
                    <h2>Fundos infinitos</h2>
                    <p class="description">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. At obcaecati magni, magnam expedita fuga maiores mollitia, rerum veritatis facere odit praesentium suscipit nemo maxime quod voluptatem consequuntur enim labore libero.
                    </p>
                </div>
            </div>
        </div>

        <div class="cenario">
            <div class="container">
                <nuxt-img
                :src='configPublic.cloudflareURI + "e8d30eab-936f-45fd-b450-a21295e9a200/public"'
                alt="Um fundo fotográfico com equipamentos fotográficos"
                width="612"
                height="408"
                class="img-cenario"
                @click="() => showImg(3)"
                fetchpriority="high"/>
                <nuxt-img
                :src='configPublic.cloudflareURI + "60ddc9c8-058d-441e-1608-ca6109de1200/public"'
                alt="Um fundo fotográfico com equipamentos fotográficos"
                width="300"
                height="200"
                class="img-example"
                @click="() => showImg(9)"
                fetchpriority="high"/>
                <div class="text">
                    <h2>teste</h2>
                    <p class="description">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. At obcaecati magni, magnam expedita fuga maiores mollitia, rerum veritatis facere odit praesentium suscipit nemo maxime quod voluptatem consequuntur enim labore libero.
                    </p>
                </div>
            </div>
        </div>

        <div class="cenario">
            <div class="container">
                <nuxt-img
                :src='configPublic.cloudflareURI + "de0a3700-d07a-46fd-1f69-8cc47ebca000/public"'
                alt="Um fundo fotográfico com equipamentos fotográficos"
                width="612"
                height="408"
                class="img-cenario"
                @click="() => showImg(4)"
                fetchpriority="high"/>
                <nuxt-img
                :src='configPublic.cloudflareURI + "ba0f1af3-4673-47e4-ab41-28bf987e9800/public"'
                alt="Um fundo fotográfico com equipamentos fotográficos"
                width="300"
                height="200"
                class="img-example"
                @click="() => showImg(7)"
                fetchpriority="high"/>
                <div class="text">
                    <h2>teste</h2>
                    <p class="description">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. At obcaecati magni, magnam expedita fuga maiores mollitia, rerum veritatis facere odit praesentium suscipit nemo maxime quod voluptatem consequuntur enim labore libero.
                    </p>
                </div>
            </div>
        </div>

        <div class="cenario">
            <div class="container">
                <nuxt-img
                :src='configPublic.cloudflareURI + "8e112adf-8f3a-4ca8-0d95-ea0176b80600/public"'
                alt="Um fundo fotográfico com equipamentos fotográficos"
                width="612"
                height="408"
                class="img-cenario"
                @click="() => showImg(5)"
                fetchpriority="high"/>
                <nuxt-img
                :src='configPublic.cloudflareURI + "0a37ed18-db3d-49b2-ac20-68f472793f00/public"'
                alt="Um fundo fotográfico com equipamentos fotográficos"
                width="300"
                height="200"
                class="img-example"
                @click="() => showImg(6)"
                fetchpriority="high"/>
                <div class="text">
                    <h2>teste</h2>
                    <p class="description">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. At obcaecati magni, magnam expedita fuga maiores mollitia, rerum veritatis facere odit praesentium suscipit nemo maxime quod voluptatem consequuntur enim labore libero.
                    </p>
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
    top: 90% !important;
    position: absolute;
    left: 35rem;

    .breadcrumb {
        padding: 0 !important;
        display: flex;
        z-index: 3;

        li,
        a {
            font-size: 19rem;

            @include m.max(sm) {
                font-size: 16rem;
            }

            &.active {
                font-weight: bold;
            }
        }

        a:hover {
            text-decoration: underline;
        }

        li:not(:last-child)::after {
            display: inline-block;
            margin: 0 10rem;
            content: "→";
        }
    }
}

.hero {
    background: #2c2a15;
    // aspect-ratio: 7/1;

    .container {
        justify-content: center;
        align-items: flex-end;
        height: 250rem;
        display: flex;
    }

    .wrap-title {
        margin-bottom: -8rem;
        display: inline-flex;
        padding-bottom: 5rem;
        padding-left: 12rem;
        padding-top: 5rem;
        z-index: 2;

        // @include m.max(sm) {
        // }

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
    }

    .img-cenario {
        cursor: zoom-in;
    }

    .wrap-link-example {
        flex-shrink: 0;

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
            aspect-ratio: 1920/1280;
            cursor: zoom-in;
            display: block;
        }
    }

    &:nth-child(even) {
        background: #892c1a;
        padding-right: 30rem;

        .wrap-link-example {
            margin-left: -130rem;
        }
    }

    &:nth-child(odd) {
        background: #2c2a15;
        padding-left: 30rem;
        text-align: right;

        .container {
            flex-direction: row-reverse;
        }

        .wrap-link-example {
            margin-right: -100rem;
        }
    }

    h2 {
        text-transform: uppercase;
        font-family: v.$lato;
        font-size: 30rem;
        padding-bottom: 10rem;
        font-weight: 900;
    }
}
</style>