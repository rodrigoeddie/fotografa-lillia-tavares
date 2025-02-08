<script setup lang="ts">
    const swiper = useSwiper();
</script>

<template>
  <div class="wrap-buttons">
    <button
      class="btnPrev"
      aria-label="Foto Anterior"
      @click="swiper.slidePrev()">
      <nuxt-icon
        name="arrow-right"
        class="icon"/>
    </button>

    <button
      class="btnNext"
      aria-label="Próxima Foto"
      @click="swiper.slideNext()">
      <nuxt-icon
        name="arrow-right"
        class="icon"/>
    </button>
  </div>
</template>

<style lang="scss">
.btnPrev .icon,
.btnNext .icon {
  align-items: center;
  display: flex;

  svg {
    margin-bottom: 0;
  }
}
</style>

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

  @include m.max(lg) {
    bottom: 14rem;
  }

  &.btnPrev {
    right: 90rem;

    @include m.max(lg) {
      right: 101rem;
    }

    .icon {
      transform: rotate(180deg);
    }
  }

  &.btnNext {
    right: 20rem;

    @include m.max(lg) {
      right: 31rem;
    }
  }
}

.wrap-buttons {
  &.centered {
    justify-content: center;
    position: absolute;
    margin: 0 auto;
    display: flex;
    width: 200rem;
    gap: 15rem;
    bottom: 0;

    .btnPrev {
      position: relative;
      bottom: auto;
      right: auto;
    }
    .btnNext {
      position: relative;
      bottom: auto;
      right: auto;
    }
  }

  &.from-bgs {
    @include m.min(md) {
      display: none;
    }
  }
}
</style>
