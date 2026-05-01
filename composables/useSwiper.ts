import { computed, nextTick, onMounted, ref, watch, type Ref } from 'vue';

export function useSwiper(swiperContainerRef: Ref<HTMLElement | null>, options?: Record<string, unknown>) {
  const swiper = ref<any>();

  const isBeginning    = computed(() => swiper.value?.isBeginning ?? true);
  const isEnd          = computed(() => swiper.value?.isEnd ?? false);
  const activeIndex    = computed(() => swiper.value?.activeIndex ?? 0);
  const realIndex      = computed(() => swiper.value?.realIndex ?? 0);
  const slides         = computed(() => swiper.value?.slides ?? []);
  const slidesPerView  = computed(() => swiper.value?.slidesPerViewDynamic() ?? 0);
  const progress       = computed(() => swiper.value?.progress ?? 0);
  const getNumberOfSlides = computed(() => swiper.value?.slides.length ?? 0);

  const next = (...params: unknown[]) => {
    if (!swiper.value) return;
    params.length === 0 ? swiper.value.slideNext() : swiper.value.slideNext(...params);
  };
  const prev = (...params: unknown[]) => {
    if (!swiper.value) return;
    params.length === 0 ? swiper.value.slidePrev() : swiper.value.slidePrev(...params);
  };
  const to = (...params: unknown[]) => {
    if (!swiper.value) return;
    swiper.value.slideTo(...params);
  };
  const reset = (...params: unknown[]) => {
    if (!swiper.value) return;
    params.length === 0 ? swiper.value.slideReset() : swiper.value.slideReset(...params);
  };

  const _initialize = () => {
    if (swiperContainerRef.value && options !== undefined) {
      Object.assign(swiperContainerRef.value, options);
      (swiperContainerRef.value as any)?.initialize();
    }
    swiper.value = (swiperContainerRef.value as any)?.swiper;
  };

  watch(swiper, () => {
    if (swiper.value !== null && swiperContainerRef.value?.nodeName !== 'SWIPER-CONTAINER' && !options) {
      console.warn('"useSwiper()" requires a ref on a <swiper-container> element.');
    }
  });

  onMounted(() => nextTick(() => _initialize()));

  return {
    instance: swiper,
    isBeginning,
    isEnd,
    activeIndex,
    realIndex,
    slides,
    slidesPerView,
    progress,
    getNumberOfSlides,
    next,
    prev,
    to,
    reset,
  };
}
