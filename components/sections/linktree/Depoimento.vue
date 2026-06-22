<script lang="ts" setup>
const props = defineProps<{
  nome: string;
  texto: string;
  rating: number;
  fotoCfId?: string | null;
  url?: string | null;
  chave?: string;
}>();

const cfImg = useCfImg();
const nuxtLink = resolveComponent('NuxtLink');
const stars = computed(() => Math.max(0, Math.min(5, props.rating || 5)));
</script>

<template>
  <component
    :is="props.url ? nuxtLink : 'div'"
    :to="props.url || undefined"
    class="lt-depoimento"
    :class="{ 'is-link': !!props.url }"
    data-ani-type="fade-up"
    @click="props.url && trackLinktreeClick(props.chave || '')"
  >
    <div class="stars" :aria-label="`${stars} de 5`">
      <Icon v-for="n in stars" :key="n" name="material-symbols:star" />
    </div>
    <p class="texto">{{ props.texto }}</p>
    <div class="autor">
      <img v-if="props.fotoCfId" :src="cfImg(props.fotoCfId, 'thumbnail')" :alt="props.nome" loading="lazy" />
      <span class="nome">{{ props.nome }}</span>
    </div>
  </component>
</template>

<style lang="scss" scoped>
.lt-depoimento {
  display: block;
  width: 100%;
  padding: 20rem;
  border-radius: 16rem;
  background: var(--lt-card-bg);
  border: 1rem solid var(--lt-card-border);
  box-shadow: 0 3rem 12rem var(--lt-shadow);
  color: inherit;
  text-decoration: none;

  &.is-link {
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    &:hover { transform: translateY(-2rem); box-shadow: 0 10rem 26rem var(--lt-shadow); }
  }
}

.stars {
  display: flex;
  gap: 2rem;
  font-size: 18rem;
  color: var(--lt-accent);
  margin-bottom: 10rem;
}

.texto {
  font-size: 15rem;
  line-height: 1.5;
  font-style: italic;
  opacity: 0.9;
  margin-bottom: 14rem;
}

.autor {
  display: flex;
  align-items: center;
  gap: 10rem;

  img { width: 36rem; height: 36rem; border-radius: 50%; object-fit: cover; }
  .nome { font-weight: 700; font-size: 15rem; }
}
</style>
