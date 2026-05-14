import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: 'latest',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/content',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],
  css: ['~/assets/css/theme.css'],
  typescript: {
    tsConfig: {
      compilerOptions: {
        skipLibCheck: true,
      },
    },
  },
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
      ],
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['rust'],
        },
      },
    },
  },
  colorMode: {
    storage: 'cookie',
    disableTransition: true,
  },
  fonts: {
    defaults: {
      preload: true,
      weights: [400, 500, 600, 700],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    typedPages: true,
  },
})
