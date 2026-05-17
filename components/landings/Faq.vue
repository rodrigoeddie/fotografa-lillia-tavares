<script setup lang="ts">
import type { z } from 'zod';
import type { FaqDataSchema } from '~/shared/schemas/landing-page';

defineProps<{
  lp: string;
  data: z.infer<typeof FaqDataSchema>;
}>();
</script>

<template>
  <SectionsFaqBlock :slug="data.slug" />
</template>
