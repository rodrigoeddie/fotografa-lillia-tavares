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
  <div class="slider-wrap-buttons">
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
</style>
