import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: 'latest',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@vueuse/nuxt',
  ],
  css: ['~/assets/css/theme.css'],
  app: {
    head: {
      title: 'joão procópio',
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        skipLibCheck: true,
      },
    },
  },
  eslint: {
    config: {
      nuxt: {
        sortConfigKeys: true,
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
    plugins: [tailwindcss() as any],
  },
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
})
