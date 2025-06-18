import { defineContentConfig, defineCollection, z } from '@nuxt/content'

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
    blog: defineCollection({
      source: 'blog/**/*.md',
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