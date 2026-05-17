<script setup lang="ts">
import type { z } from 'zod';
import type { FaqDataSchema } from '~/shared/schemas/landing-page';

defineProps<{
  lp: string;
  data: z.infer<typeof FaqDataSchema>;
}>();

const { data: rawFaq } = await useFetch('/api/public/faq');
const categories = computed(() => (rawFaq.value ?? []).map(adaptFaqCategoria));
</script>

<template>
  <SectionsFaqSection :categories="categories" :slug="data.slug" />
</template>
