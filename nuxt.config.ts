export default defineNuxtConfig({
  ssr: false,

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-08-10",

  modules: ["@nuxt/eslint"],

  devtools: {
    enabled: true,
  },

  eslint: {
    checker: true,
    config: {
      stylistic: false,
    },
  },
})
