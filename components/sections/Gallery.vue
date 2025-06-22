
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
        <nuxt-img
            provider="cloudflare"
            :src='"https://images.fotografalilliatavares.com.br/images/" + item.imageId + "/public"'
            :sizes="'100vw md:50vw lg:' + item.width + 'px'"
            :width="item.width"
            :height="item.height"
            :alt="item.alt"
            :class="[item.format, item.customClass]"
            placeholder
            @click="() => showImg(item.index)"
            loading="lazy"/>
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

<style lang="scss">
.empty {
  min-width: 33%;
  height: 1px;
}

.portfolio-images {
  justify-content: space-between;
  flex-wrap: wrap;
  display: flex;

  img {
    // border: 1px solid white;
    object-fit: cover;
    height: auto;
  }

  .paisagem {
    &.w50 {
      width: 50%;

      @include m.max(sm) {
        width: 100%;
      }
    }
  }

  .retrato {
    width: 33.3%;

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
