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
  imports: {
    dirs: ['~/lib/ui'],
  },
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
    throwOnError: true,
    processCSSVariables: true,
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
