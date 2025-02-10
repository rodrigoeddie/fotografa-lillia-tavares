import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    }),
    works: defineCollection({
      source: 'ensaio-fotografico/**/*.json',
      type: 'page',
      schema: z.object({
        date: z.date(),
        category: z.object({
          slug: z.string(),
          title: z.string()
        }),
        local: z.string(),
        colorHighlight: z.string(),
        site: z.string(),
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
  }
})