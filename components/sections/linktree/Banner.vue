<script lang="ts" setup>
const props = defineProps<{
  imageCfId: string;
  label?: string;
  url?: string | null;
  chave?: string;
}>();

const cfImg = useCfImg();
const nuxtLink = resolveComponent('NuxtLink');
const isExternal = computed(() => !!props.url && /^https?:\/\//.test(props.url));
const tag = computed(() => {
  if (!props.url) return 'div';
  return isExternal.value ? 'a' : nuxtLink;
});
</script>

<template>
  <component
    :is="tag"
    :to="props.url && !isExternal ? props.url : undefined"
    :href="props.url && isExternal ? props.url : undefined"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    class="lt-banner"
    :class="{ 'is-link': !!props.url }"
    data-ani-type="zoom-in"
    @click="props.url && trackLinktreeClick(props.chave || '')"
  >
    <img :src="cfImg(props.imageCfId, 'public')" :alt="props.label || 'Banner'" loading="lazy" />
    <span v-if="props.label" class="caption">{{ props.label }}</span>
  </component>
</template>

<style lang="scss" scoped>
.lt-banner {
  display: block;
  position: relative;
  width: 100%;
  border-radius: 16rem;
  overflow: hidden;
  box-shadow: 0 3rem 12rem var(--lt-shadow);
  color: #fff;
  text-decoration: none;

  img { width: 100%; height: auto; display: block; }

  &.is-link { transition: transform 0.18s ease; &:hover { transform: translateY(-2rem); } }
}

.caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rem 16rem 14rem;
  font-weight: 700;
  font-size: 17rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), transparent);
}
</style>
