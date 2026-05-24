<script lang="ts" setup>
defineProps<{
  service: {
    title: string
    image: string
    to: string
  }
}>();

const { hovered, tiltStyle, onMouseMove, onMouseLeave } = useTiltEffect();
</script>

<template>
  <NuxtLink
    :to="service.to"
    class="card"
    :style="tiltStyle"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div class="wrap-img">
      <nuxt-img
        provider="cloudflare"
        :src="service.image"
        alt="Fotógrafa Lillia Tavares segurando sua câmera fotográfica"
        width="935"
        fetchpriority="high"
        preload
        sizes="100vw sm:50vw md:935px"
        format="webp"
        loading="eager"
        class="img cover"
      />
    </div>
    
    <span class="card-title">{{ service.title }}</span>
  </NuxtLink>
</template>

<style scoped lang="scss">
.card {
  transition: transform .15s cubic-bezier(.2,.7,.2,1), box-shadow .3s ease;
  box-shadow:
    0 1px 0 #ECE4D2,
    0 14px 30px -12px rgba(42, 37, 32, 0.25),
    0 4px 10px -4px rgba(42, 37, 32, 0.10);
  transform-style: preserve-3d;
  will-change: transform;
  background: white;
  flex: 1 1 200rem;
  min-width: 200rem;
  
  @include m.max(sm) {
    flex: auto;
    flex-shrink: 0;
    display: flex;
    width: 100%;
  }

  &:hover {
    box-shadow:
      0 1px 0 #ECE4D2,
      0 28px 50px -16px rgba(42, 37, 32, 0.35),
      0 8px 18px -6px rgba(42, 37, 32, 0.15);

    .wrap-img .cover {
      opacity: 1;
    }
  }
}

.wrap-img {
  aspect-ratio: 2/1.9;
  overflow: hidden;
  width: 100%;
    
  @include m.max(sm) {
    display: none;
  }
  
  .cover {
    transition: opacity .2s, filter .2s;
    padding: 15rem;
    opacity: .6;
    
    @include m.max(sm) {
      padding: 0;
    }
  }
}

.card-title {
  text-transform: uppercase;
  text-align: center;
  font-size: 18rem;
  font-weight: 600;
  line-height: 1.3;
  padding: 0 15rem;
  display: block;
  width: 100%;
    
  @include m.max(sm) {
    margin-top: 12rem;
  }
}
</style>
