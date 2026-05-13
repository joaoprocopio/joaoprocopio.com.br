import { defineContentConfig, defineCollection } from '@nuxt/content'
import * as z from 'zod'

export default defineContentConfig({
  collections: {
    writing: defineCollection({
      type: 'page',
      source: '**/*',
      schema: z.object({
        written_at: z.date(),
        cover: z.object({
          src: z.string(),
          alt: z.string(),
        }),
      }),
    }),
  },
})
