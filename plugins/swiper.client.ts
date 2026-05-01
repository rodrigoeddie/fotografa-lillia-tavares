import { defineNuxtPlugin } from '#imports';
import { register } from 'swiper/element/bundle';

export default defineNuxtPlugin((nuxtApp) => {
  register();

  const isCustomElement = nuxtApp.vueApp.config.compilerOptions.isCustomElement;
  nuxtApp.vueApp.config.compilerOptions.isCustomElement = (tag) =>
    tag.startsWith('swiper-') || isCustomElement?.(tag) || false;
});
