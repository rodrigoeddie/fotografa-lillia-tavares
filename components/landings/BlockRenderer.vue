<script setup lang="ts">
import type { Component } from 'vue';
import type { LpBlock } from '~/shared/schemas/landing-page';

const props = defineProps<{
  blocks: LpBlock[];
  /** Slug da LP — passado para componentes que precisam do contexto. */
  lp: string;
  /** Classe SCSS a aplicar em cada bloco (ex: 'lp-corporativo'). */
  lpClass?: string;
}>();

// `resolveComponent` resolve nomes Nuxt auto-imported em runtime; necessário
// porque `:is="'LandingsHero'"` (string) não funciona com runtime-only build.
const componentMap: Record<LpBlock['tipo'], Component | string> = {
  hero:           resolveComponent('LandingsHero'),
  heroPresentes:  resolveComponent('LandingsHeroPresentes'),
  forWho:         resolveComponent('LandingsForWho'),
  howWorks:       resolveComponent('LandingsHowWorks'),
  prices:         resolveComponent('LandingsPrices'),
  testimonials:   resolveComponent('SectionsGeneralTestimonials'),
  ctaContact:     resolveComponent('SectionsGeneralCtaContact'),
  map:            resolveComponent('LandingsMap'),
  portfolioGrid:  resolveComponent('LandingsPortfolio'),
  giftGrid:       resolveComponent('LandingsGiftGrid'),
  coloracao:      resolveComponent('LandingsColoracao'),
  deliverables:   resolveComponent('LandingsDeliverables'),
  hubBacklink:    resolveComponent('LandingsHubBacklink'),
  faq:            resolveComponent('LandingsFaq'),
};
</script>

<template>
  <component
    v-for="(block, i) in props.blocks"
    :is="componentMap[block.tipo]"
    :key="`${block.tipo}-${i}`"
    :class="props.lpClass"
    :lp="props.lp"
    :data="block.dados"
  />
</template>
