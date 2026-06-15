<script lang="ts" setup>
const props = defineProps<{
  service: {
    title: string
    image: string
    to: string
  }
  eager?: boolean
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
        width="400"
        sizes="xs:25vw sm:33vw lg:260px"
        format="avif"
        :fetchpriority="props.eager ? 'high' : 'low'"
        :preload="props.eager"
        :loading="props.eager ? 'eager' : 'lazy'"
        class="img cover"
      />
    </div>
    
    <span class="card-title">{{ service.title }}</span>
  </NuxtLink>
</template>

<style scoped lang="scss">
.card {
  transition: transform .15s cubic-bezier(.2,.7,.2,1), box-shadow .3s ease;
  @include m.card-shadow;
  transform-style: preserve-3d;
  width: calc(33% -  8rem);
  will-change: transform;
  flex-direction: column;
  background: white;
  display: flex;
  
  @include m.max(sm) {
    flex-direction: row;
    flex-shrink: 0;
    display: flex;
    flex: auto;
    width: 100%;
  }

  &:hover {
    @include m.card-shadow-hover;

    .wrap-img .cover {
      opacity: 1;
    }
  }
}

.wrap-img {
  aspect-ratio: 2/1.9;
  overflow: hidden;
  flex-shrink: 0;
  width: 100%;

  @include m.max(md) {
    aspect-ratio: 1.4 / 1;
  }

  @include m.max(sm) {
    width: 25%;
  }

  .cover {
    transition: opacity .2s, filter .2s;
    margin-bottom: 15rem;
    opacity: .6;

    @include m.max(sm) {
      margin-bottom: 0;
      padding: 0;
    }
  }
}

.card-title {
  text-transform: uppercase;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20rem;
  font-weight: 600;
  line-height: 1.3;
  padding: 15rem;
  margin-bottom: 0;
  display: flex;
  height: 100%;
  width: 100%;
  
  @include m.max(sm) {    
    justify-content: left;
    text-align: left;
  }
}
</style>
