<script setup lang="ts">
import type { LpBlockType, LpBlock } from '~/shared/schemas/landing-page';

const props = defineProps<{
  tipo: LpBlockType;
  modelValue: LpBlock['dados'];
}>();
const emit = defineEmits<{ (e: 'update:modelValue', v: LpBlock['dados']): void }>();

// Dispatch para o editor certo por tipo. `resolveComponent` necessário porque
// runtime-only do Nuxt não aceita string em `:is` (mesma razão do BlockRenderer).
const editorMap: Record<LpBlockType, ReturnType<typeof resolveComponent>> = {
  hero:           resolveComponent('AdminLandingPagesBlocksHeroEditor'),
  heroPresentes:  resolveComponent('AdminLandingPagesBlocksHeroPresentesEditor'),
  forWho:         resolveComponent('AdminLandingPagesBlocksForWhoEditor'),
  howWorks:       resolveComponent('AdminLandingPagesBlocksHowWorksEditor'),
  prices:         resolveComponent('AdminLandingPagesBlocksPricesEditor'),
  testimonials:   resolveComponent('AdminLandingPagesBlocksTestimonialsEditor'),
  ctaContact:     resolveComponent('AdminLandingPagesBlocksCtaContactEditor'),
  map:            resolveComponent('AdminLandingPagesBlocksMapEditor'),
  portfolioGrid:  resolveComponent('AdminLandingPagesBlocksPortfolioGridEditor'),
  giftGrid:       resolveComponent('AdminLandingPagesBlocksGiftGridEditor'),
  coloracao:      resolveComponent('AdminLandingPagesBlocksColoracaoEditor'),
  deliverables:   resolveComponent('AdminLandingPagesBlocksDeliverablesEditor'),
  hubBacklink:    resolveComponent('AdminLandingPagesBlocksHubBacklinkEditor'),
  faq:            resolveComponent('AdminLandingPagesBlocksFaqEditor'),
};
</script>

<template>
  <component
    :is="editorMap[tipo]"
    :model-value="modelValue"
    @update:model-value="(v: any) => emit('update:modelValue', v)"
  />
</template>
