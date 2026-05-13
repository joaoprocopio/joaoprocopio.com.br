import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    writing: defineCollection({
      type: 'page',
      source: '*',
      schema: z.object({
        authors: z.array(z.string()),
        written_at: z.date(),
        summary: z.string(),
        cover: z.object({
          src: z.string(),
          alt: z.string(),
        }),
      }),
    }),
  },
})
