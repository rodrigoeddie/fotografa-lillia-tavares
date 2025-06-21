
<script setup lang="ts">

const props = defineProps({
  testimonial: {
    type: Object,
    required: true,
    default: {}
  },
  name: {
    type: String,
    required: true,
    default: {}
  }
});
</script>

<template>
    <div class="wrap-testimonial">
        <nuxt-img
            provider="cloudflare"
            :src='"https://images.fotografalilliatavares.com.br/images/" + testimonial.avatar + "/public"'
            :width="'100'"
            :height="'100'"
            :alt="'' + name"
            :class="'image-testimonial'"
            placeholder
            loading="lazy"/>
        <div class="text-testimonial">
            <p class="description">
                {{ testimonial.text }}
            </p>

            <span class="from">
                Via: <NuxtLink :to="testimonial.link" target="_blank" rel="noopener noreferrer">{{ testimonial.source }}</NuxtLink>
            </span>
        </div>
    </div>
</template>

<style lang="scss">
    .wrap-testimonial {
        padding: 30rem;
        display: flex;

        .image-testimonial {
            box-shadow: 0 0 10rem rgba(0, 0, 0, 0.1);
            margin-right: 20rem;
            border-radius: 50%;
            object-fit: cover;
            height: 70rem;
            width: 70rem;
        }

        .text-testimonial {
            box-shadow: 0 0 10rem rgba(0, 0, 0, 0.1);
            background: #f9f9f9;
            border-radius: 10rem;
            padding: 20rem;

            .description {
                padding-top: 0;
            }

            .from {
                display: block;
                text-align: right;
            }
        }
    }
</style>
