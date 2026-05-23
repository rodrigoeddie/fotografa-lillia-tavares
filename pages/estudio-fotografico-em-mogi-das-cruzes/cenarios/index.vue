<script setup lang="ts">
const configPublic = useRuntimeConfig().public;
const cfUrl = configPublic.cloudflareURI as string;

const { data: rawData } = await useFetch('/api/public/cenarios?slug=estudio');

const cenarios = computed(() => {
  const pagina = rawData.value as any;
  if (!pagina?.cenarios) return [];
  let imgIdx = 0;
  return (pagina.cenarios as any[])
    .slice()
    .sort((a, b) => a.ordem - b.ordem)
    .map((c) => {
      const bgIdx = imgIdx++;
      const hasExample = !!c.imagem_exemplo_cf_id;
      const exIdx = hasExample ? imgIdx++ : -1;
      return {
        title: c.titulo,
        descricao: c.descricao ?? '',
        imageBg: {
          id: bgIdx,
          src: cfUrl + c.imagem_bg_cf_id,
          alt: c.imagem_bg_alt ?? '',
        },
        example: hasExample ? {
          id: exIdx,
          src: cfUrl + c.imagem_exemplo_cf_id,
          alt: c.imagem_exemplo_alt ?? '',
          link: c.imagem_exemplo_link ?? '',
          title: c.imagem_exemplo_titulo ?? '',
          orientation: c.imagem_exemplo_orientacao ?? '',
        } : null,
      };
    });
});

const imgs = computed(() =>
  cenarios.value.flatMap((cenario) => {
    const images: any[] = [];
    if (cenario.imageBg?.src) images.push({ src: cenario.imageBg.src + '/public', title: '' });
    if (cenario.example?.src) images.push({ src: cenario.example.src + '/public', title: '' });
    return images;
  })
);

const visibleRef = ref(false);
const indexRef = ref(0);

const showImg = (index: number) => {
  indexRef.value = index;
  visibleRef.value = true;
};

const onHide = () => (visibleRef.value = false);
</script>

<template>
    <div class="wrapper">
        <div class="container">
            <BlocksBreadcrumb :items="[
              { label: 'Home', to: '/' },
              { label: 'Estúdio', to: '/estudio-fotografico-em-mogi-das-cruzes' },
              { label: 'Cenários' },
            ]" />

            <div class="wrap-title">
                <h2 class="big-title green centered">
                    <span>Conheça os Cenários</span>
                </h2>
            </div>
        </div>

        <div
          class="cenario"
          v-for="cenario in cenarios">
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
                      @click="() => showImg(cenario.example!.id)"/>
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
.hero {
    overflow: hidden;

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
            color: v.$green;
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
        color: v.$green;
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