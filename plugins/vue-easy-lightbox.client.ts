export default defineNuxtPlugin(async (nuxtApp) => {
  // Importar dinamicamente no lado do cliente
  if (process.client) {
    const { default: VueEasyLightbox } = await import('vue-easy-lightbox')
    nuxtApp.vueApp.component('VueEasyLightbox', VueEasyLightbox)
  }
})