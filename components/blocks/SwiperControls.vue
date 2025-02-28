<script setup lang="ts">
const props = defineProps({
  swiperContainerRef: {
    type: Object,
    required: true
  }
});

const ariaLabel      = ref('');
const activeIndex    = ref(0);
const isPrevDisabled = ref(false);
const isNextDisabled = ref(false);

const updateAriaLabel = () => {
  if (props.swiperContainerRef) {
    activeIndex.value = props.swiperContainerRef.instance.value.activeIndex;
    ariaLabel.value   = props.swiperContainerRef.instance.value.slides[activeIndex.value].getAttribute('aria-label');

    if(activeIndex.value === 0) {
      isPrevDisabled.value = true;
    } else {
      isPrevDisabled.value = false;

      if(activeIndex.value === props.swiperContainerRef.instance.value.slides.length - 1) {
        isNextDisabled.value = true;
      } else {
        isNextDisabled.value = false;
      }
    }
  }
};

props.swiperContainerRef.instance.value.on('slideChange', updateAriaLabel);

updateAriaLabel();

const prev = () => props.swiperContainerRef.prev()
const next = () => props.swiperContainerRef.next()
</script>

<template>
  <div class="wrap-buttons">
    <button
      class="btnPrev"
      aria-label="Foto Anterior"
      :disabled="isPrevDisabled"
      @click="prev()">
      <nuxt-icon
        name="arrow-right"
        class="icon"/>
    </button>

    <span class="slide-count">{{ ariaLabel }}</span>

    <button
      class="btnNext"
      aria-label="Próxima Foto"
      :disabled="isNextDisabled"
      @click="next()">
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
  font-weight: bold;
  font-size: 28rem;
  height: 50rem;
  display: flex;
  width: 50rem;
  color: v.$red;
  z-index: 3;

  &[disabled] {
    background: #f1f1f1;
    cursor: default;
    color: grey;
    opacity: .4;
  }

  @include m.max(lg) {
    bottom: 14rem;
  }

  &.btnPrev {
    .icon {
      transform: rotate(180deg);
    }
  }
}

.wrap-buttons {
  align-items: center;
  position: absolute;
  display: flex;
  gap: 15rem;
  bottom: 0;
  right: 0;

  &.centered {
    justify-content: center;
    position: absolute;
    margin: 0 auto;
    width: 100%;
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

  &.studio-controls {
    width: 55%;
    bottom: 15rem;

    @include m.max(md) {
      width: 100%;
    }

    .slide-count {
      color: v.$dark-red;

      @include m.max(md) {
        color: white;
      }
    }
  }

  &.from-bgs {
    @include m.min(md) {
      display: none;
    }
  }

  &.from-bgs {
    @include m.max(xs) {
      bottom: 15rem;
    }
  }
}

.slide-count {
  font-weight: bold;
  font-size: 18rem;
  color: white;
  z-index: 3;

  // @include m.max(lg) {
  // }
}
</style>
