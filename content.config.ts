import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import type Testimonial from './components/blocks/Testimonial.vue'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.{md,json}'
    }),
    works: defineCollection({
      source: 'ensaio-fotografico/**/*.json',
      type: 'page',
      schema: z.object({
        home: z.boolean(),
        date: z.date(),
        category: z.object({
          slug: z.string(),
          title: z.string()
        }),
        testimonial: z.object({
          text: z.string(),
          avatar: z.string(),
          link: z.string(),
          source: z.string()
        }),
        local: z.string(),
        colorHighlight: z.string(),
        site: z.string(),
        video: z.string(),
        instagram: z.object({
          uri: z.string(),
          title: z.string()
        }),
        album: z.object({
          imageId: z.string(),
          format: z.string(),
          alt: z.string()
        }),
      })
    }),
    blog: defineCollection({
      source: 'blog/**/*.{md,json}',
      type: 'page',
      schema: z.object({
        title: z.string(),
        date: z.date(),
        category: z.string(),
        categoryTitle: z.string(),
        works: z.string(),
        image: z.string(),
      })
    }),
  }
})