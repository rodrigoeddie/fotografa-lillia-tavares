<script setup lang="ts">
    const swiper = useSwiper();
</script>

<template>
  <button
    class="btnPrev"
    aria-label="Foto Anterior"
    @click="swiper.slideNext()">
    <nuxt-icon
      name="arrow-right"
      class="icon"/>
  </button>

  <button
    class="btnNext"
    aria-label="Próxima Foto"
    @click="swiper.slidePrev()">
    <nuxt-icon
      name="arrow-right"
      class="icon"/>
  </button>
</template>


<style scoped lang="scss">
button {
  justify-content: center;
  border: 2px solid v.$red;
  background: white;
  align-items: center;
  border-radius: 50%;
  position: absolute;
  font-weight: bold;
  font-size: 28rem;
  height: 50rem;
  display: flex;
  width: 50rem;
  color: v.$red;
  z-index: 3;
  bottom: 20rem;

  .icon svg {
    height: 17rem;
    width: 27rem;
    fill: v.$red;
  }

  &.btnPrev {
    right: 90rem;

    .icon {
      transform: rotate(180deg);
    }
  }
  &.btnNext {
    right: 20rem;
  }
}
</style>
