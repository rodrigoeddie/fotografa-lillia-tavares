<script setup lang="ts">
const path = useRoute().path

const { data: work } = await useAsyncData(path, () => {
  return queryCollection('works').path(path).first()
})

const highlight = work.value.body.album.filter(item => item.highlight);
</script>

<template>
  <div class="container no-padding">
    <div class="wrap-hero">
      <div class="text">
        <div class="about-text text-slide">
          <h2 class="title" v-html="work.title"></h2>
          <div class="description" v-html="work.description"></div>
        </div>
      </div>

      <div :class="{'has-two': highlight[1]}" class="wrap-img-hero">
        <nuxt-img
          :src='"https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/" + highlight[0].uri + "/public"'
          width="1920"
          loading="lazy"/>
        <nuxt-img
          v-if="highlight[1]"
          :src='"https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/" + highlight[1].uri + "/public"'
          width="1920"
          loading="lazy"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap-hero {
  display: flex;

  .wrap-img-hero {
    flex-shrink: 0;
    display: flex;
    width: 55%;
    
    &.has-two {
      height: 80dvh;
      width: auto;

      img {
        flex-shrink: 0;
        height: 100%;
        width: auto;
      }
    }
  }

  .text {
    justify-content: flex-end;
    flex-direction: column;
    background: white;
    display: flex;
    width: 45%;
  }

  .about-text {
    padding: 180rem v.$space v.$space;

    .description {
      padding-top: 0;

      p {
        padding-top: 15rem !important;
      }

      strong,
      b {
        background: #892c1a;
        color: white;
        padding-right: 3rem;
        padding-left: 3rem;
      }
    }

    &.text-slide {
      .title {
        padding-top: 20rem;
        padding-bottom: 30rem;
      }

      .description {
        padding-bottom: 20rem;

        p {
          padding-top: 0 !important;
        }
      }
    }
  }

  .about-ctas {
    justify-content: center;
    padding: 20rem v.$space;
    background: #892c1a;
    align-items: center;
    height: 150rem;
    display: flex;

    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      top: 0;

      &:hover {
        background-color: #6d1d0b !important;
        color: white;
      }
    }
  }
}
</style>
