<script lang="ts" setup>
const props = defineProps<{
  url: string;
  label: string;
  descricao?: string;
  icone?: string;
  imageCfId?: string | null;
  corDestaque?: string | null;
  chave?: string;
}>();

const cfImg = useCfImg();
const nuxtLink = resolveComponent('NuxtLink');
const isExternal = computed(() => /^https?:\/\//.test(props.url));
const hasImage = computed(() => !!props.imageCfId);
</script>

<template>
  <component
    :is="isExternal ? 'a' : nuxtLink"
    :to="isExternal ? undefined : props.url"
    :href="isExternal ? props.url : undefined"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    class="lt-link-card"
    :class="{ 'has-image': hasImage }"
    data-ani-type="fade-up"
    data-ani-batch="lt-links"
    data-ani-stagger="0.05"
    @click="trackLinktreeClick(props.chave || '')"
  >
    <span v-if="hasImage" class="thumb" :style="{ backgroundColor: props.corDestaque || undefined }">
      <img :src="cfImg(props.imageCfId, 'thumbnail')" :alt="props.label" loading="lazy" />
    </span>
    <span v-else-if="props.icone" class="icon">
      <Icon :name="props.icone" />
    </span>

    <span class="body">
      <span class="label">{{ props.label }}</span>
      <span v-if="props.descricao" class="desc" v-html="props.descricao"></span>
    </span>

    <span class="arrow" aria-hidden="true">
      <Icon name="lucide:arrow-right" />
    </span>
  </component>
</template>

<style lang="scss" scoped>
.lt-link-card {
  display: flex;
  align-items: center;
  gap: 14rem;
  width: 100%;
  padding: 14rem 18rem;
  border-radius: 16rem;
  text-decoration: none;
  color: inherit;
  background: var(--lt-card-bg);
  border: 1rem solid var(--lt-card-border);
  box-shadow: 0 3rem 12rem var(--lt-shadow);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-2rem);
    box-shadow: 0 10rem 26rem var(--lt-shadow);
    border-color: var(--lt-accent);

    .arrow { transform: translateX(3rem); opacity: 1; color: var(--lt-accent); }
  }

  &:active { transform: translateY(0); }

  &.has-image { padding: 10rem 18rem 10rem 10rem; }
}

.thumb {
  width: 64rem;
  height: 64rem;
  border-radius: 12rem;
  overflow: hidden;
  flex-shrink: 0;

  img { width: 100%; height: 100%; object-fit: cover; display: block; }
}

.icon {
  width: 44rem;
  height: 44rem;
  border-radius: 12rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lt-accent-soft);
  font-size: 24rem;
  color: var(--lt-accent);
}

.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
}

.label {
  font-weight: 700;
  font-size: 17rem;
  line-height: 1.25;
}

.desc {
  font-size: 14rem;
  opacity: 0.7;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  font-size: 20rem;
  opacity: 0.45;
  transition: transform 0.18s ease, opacity 0.18s ease;
}

@include m.max(sm) {
  .label { font-size: 16rem; }
}
</style>
