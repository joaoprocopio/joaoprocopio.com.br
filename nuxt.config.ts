export default defineNuxtConfig({
  ssr: false,

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/eslint',
  ],

  devtools: {
    enabled: true
  },
})