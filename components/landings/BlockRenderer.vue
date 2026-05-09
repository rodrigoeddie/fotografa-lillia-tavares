<script setup lang="ts">
import type { LpBlock } from '~/shared/schemas/landing-page';

const props = defineProps<{
  blocks: LpBlock[];
  /** Slug da LP — passado para componentes que precisam do contexto. */
  lp: string;
  /** Classe SCSS a aplicar em cada bloco (ex: 'lp-corporativo'). */
  lpClass?: string;
}>();

// Mapa tipo → componente Nuxt (auto-import resolve via prefixos `Landings*`/`SectionsGeneral*`).
// Cada componente recebe `data` (= block.dados) e `lp` quando aplicável.
const componentMap: Record<LpBlock['tipo'], string> = {
  hero:           'LandingsHero',
  heroPresentes:  'LandingsHeroPresentes',
  forWho:         'LandingsForWho',
  howWorks:       'LandingsHowWorks',
  prices:         'LandingsPrices',
  testimonials:   'SectionsGeneralTestimonials',
  ctaContact:     'SectionsGeneralCtaContact',
  map:            'LandingsMap',
  portfolioGrid:  'LandingsPortfolio',
  giftGrid:       'LandingsGiftGrid',
  coloracao:      'LandingsColoracao',
  deliverables:   'LandingsDeliverables',
  hubBacklink:    'LandingsHubBacklink',
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
