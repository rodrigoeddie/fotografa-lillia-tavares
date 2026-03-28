
<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  lp: {
    type: String,
    default: ''
  }
});
</script>

<template>
    <div class="pricing-grid">
        <ClientOnly>
          <swiper-container
            class="pricing-swiper"
            :slides-per-view="1.40"
            :space-between="8"
            :breakpoints="{
              500: {
                slidesPerView: 2.40,
                spaceBetween: 16,
                // slidesPerGroup: 2,
              },
              750: {
                slidesPerView: 3.40,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 16,
              }
            }"
            :pagination="{
              clickable: true,
            }"
            :navigation="false">
            <swiper-slide
              v-for="(pkg, index) in data.packages"
              :key="index">
              <BlocksPricingCard
                :title="pkg.title"
                :subtitle="pkg.subtitle"
                :price="pkg.price"
                :features="pkg.features"
                :numParcelas="pkg.numParcelas"
                :priceParcelas="pkg.priceParcelas"
                :type="data.title"
                :bonus="pkg.bonus"
                :is-recommended="pkg.isRecommended"
                :class="props.lp"
              />
            </swiper-slide>
          </swiper-container>
        </ClientOnly>
    </div>
</template>

<style scoped lang="scss">
:deep(swiper-container) {
  --swiper-pagination-bottom: 0rem;
}

.pricing-grid {
  padding-top: v.$bigSpace;
  margin-bottom: v.$bigSpace;
  position: relative;

  @include m.max(xs) {
    padding-top: 15rem;
  }
  
  .pricing-swiper {
    swiper-slide {
      margin-bottom: 60rem;
      display: flex;
      height: auto;
    }
  }
}
</style>
