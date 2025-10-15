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
        colorHighlight: z.string(),
        showSchedule: z.boolean().optional(),
        title: z.string(),
        date: z.string(),
        description: z.string(),
        category: z.object({
          slug: z.string(),
          title: z.string()
        }),
        image: z.object({
          imageId: z.string(),
          width: z.number(),
          height: z.number(),
          format: z.string(),
          customClass: z.string(),
          alt: z.string(),
        }),
        works: z.string(),
        page: z.string(),
        content: z.array(z.string()).optional(),
        contentImages: z.array(z.object({
          imageId: z.string(),
          width: z.number(),
          height: z.number(),
          format: z.string(),
          customClass: z.string().optional(),
          alt: z.string().optional(),
          nome: z.string().optional(),
          ratio: z.string().optional(),
          instagram: z.string().optional(),
          showAtEnd: z.boolean().optional(),
        })).optional(),
        album: z.array(z.object({
          imageId: z.string(),
          width: z.number(),
          height: z.number(),
          format: z.string(),
          customClass: z.string().optional(),
          alt: z.string().optional(),
          nome: z.string().optional(),
          ratio: z.string().optional(),
          instagram: z.string().optional(),
        })).optional(),
      })
    }),
  }
})