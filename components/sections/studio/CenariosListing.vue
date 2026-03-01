<script setup lang="ts">
const configPublic = useRuntimeConfig().public;

interface CenarioExample {
  id: number;
  imageId: string;
  alt: string;
  link?: string;
  title?: string;
  orientation?: string;
}

interface CenarioItem {
  title: string;
  descricao: string;
  imageBg: {
    id: number;
    imageId: string;
    alt: string;
  };
  example?: CenarioExample;
}

const props = defineProps<{
  cenarios: CenarioItem[];
}>();

const visibleRef = ref(false);
const indexRef   = ref(0);

const imgs = computed(() =>
  props.cenarios.flatMap(cenario => {
    const images: Array<{ id: number; src: string; title: string }> = [
      {
        id:    cenario.imageBg.id,
        src:   configPublic.cloudflareURI + cenario.imageBg.imageId + '/public',
        title: '',
      },
    ];

    if (cenario.example) {
      images.push({
        id:    cenario.example.id,
        src:   configPublic.cloudflareURI + cenario.example.imageId + '/public',
        title: '',
      });
    }

    return images;
  })
);

const showImg = (id: number) => {
  const idx = imgs.value.findIndex(img => img.id === id);
  if (idx !== -1) {
    indexRef.value   = idx;
    visibleRef.value = true;
  }
};

const onHide = () => (visibleRef.value = false);

const imgSrc = (imageId: string) => configPublic.cloudflareURI + imageId + '/public';
</script>

<template>
  <div class="cenarios-listing">
    <div
      v-for="(cenario, index) in cenarios"
      :key="index"
      class="cenario"
      :class="'cenario-' + index"
    >
      <div class="container">
        <nuxt-img
          :src="imgSrc(cenario.imageBg.imageId)"
          width="612"
          height="408"
          class="img-cenario"
          :alt="cenario.imageBg.alt"
          loading="lazy"
          @click="showImg(cenario.imageBg.id)"
        />

        <div v-if="cenario.example" class="wrap-link-example">
          <nuxt-img
            :src="imgSrc(cenario.example.imageId)"
            :alt="cenario.example.alt"
            width="300"
            height="200"
            loading="lazy"
            :class="'img-example ' + (cenario.example.orientation ?? '')"
            @click="showImg(cenario.example.id)"
          />
          <NuxtLink
            v-if="cenario.example.link"
            class="link-example"
            :to="cenario.example.link"
          >
            <span>
              Acessar trabalho com esse cenário:<br>
              <strong>{{ cenario.example.title }}</strong>
            </span>
          </NuxtLink>
        </div>

        <div class="text">
          <h3>{{ cenario.title }}</h3>
          <p class="description" v-html="cenario.descricao" />
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
    background: rgba(255, 255, 255, 0.8);

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
  :deep(a) {
    text-decoration: underline;
  }
}
</style>
