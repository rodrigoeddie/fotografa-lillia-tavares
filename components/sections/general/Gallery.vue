
<script setup lang="ts">
const props = defineProps({
  album: {
    type: Object,
    required: true,
    default: {}
  }
});

const visibleRef = ref(false);
const indexRef = ref(0);
const imgs = ref([]);

props.album.map(item => {
  imgs.value.push({
    src: `https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/${item.imageId}/${item.format}`,
    title: "",
  });
});

const showImg = (index) => {
  indexRef.value = index;
  visibleRef.value = true;
};

const onHide = () => (visibleRef.value = false);
</script>

<template>
    <div class="portfolio-images">
      <template v-for="item in album">
        <div class="item" :class="[item.format, item.customClass]" :style="'--ratio:' + (item.ratio || 'auto')">
          <nuxt-img
              provider="cloudflare"
              :src='"https://images.fotografalilliatavares.com.br/images/" + item.imageId + "/public"'
              :sizes="'100vw md:50vw lg:' + item.width + 'px'"
              :width="item.width"
              :height="item.height"
              :alt="item.alt"
              placeholder
              @click="() => showImg(item.index)"
              loading="lazy"/>

          <div class="info" v-if="item.nome && item.instagram">
            <p class="description">
              <a :href="item.instagram" target="_blank" rel="noopener noreferrer">
                <Icon
                  name="icons:instagram"
                  class="icon icon-instagram"/>
                <span>{{ item.nome }}</span>
              </a>
            </p>
          </div>
        </div>
      </template>

      <div class="empty"></div>
      <div class="empty"></div>
    </div>

    <VueEasyLightbox
      :visible="visibleRef"
      :imgs="imgs"
      :index="indexRef"
      :rotateDisabled="true"
      :zoomDisabled="true"
      @hide="onHide"
    />
</template>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
}

.empty {
  min-width: 33%;
  height: 1px;
}

.info {
  height: 100rem;
}

.portfolio-images {
  background-color: white;
  justify-content: space-between;
  flex-wrap: wrap;
  display: flex;

  img {
    aspect-ratio: var(--ratio, auto);
    object-fit: cover;
    height: 100%;
    
    @include m.max(sm) {
        width: 100%;
    }
  }

  .paisagem {
    &.w50 {
      width: calc(100% / 2);

      @include m.max(sm) {
        width: 100%;
      }
    }
  }

  .retrato {
    width: calc(100% / 3);

    &.square {
      aspect-ratio: 1;
    }

    &.w50 {
      width: 50%;

      @include m.max(sm) {
        width: 100%;
      }
    }

    &.w25 {
      width: 25%;

      @include m.max(sm) {
        width: 100%;
      }
    }

    @include m.max(sm) {
      width: 100%;
    }
  }
}
</style>
