// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  ssr: false,

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ['flowbite']
    }
  },

  modules: ["@pinia/nuxt"],
  build: {
    transpile: ['flowbite-vue']
  },

});