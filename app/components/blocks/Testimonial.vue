
<script setup lang="ts">

const props = defineProps({
  testimonial: {
    type: Object,
    required: true,
    default: {}
  },
  path: {
    type: String,
    required: false,
    default: {}
  },
  name: {
    type: String,
    required: true,
    default: {}
  },
  fromList: {
    type: Boolean,
    required: false,
    default: false
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

        <div v-if="fromList" class="wrap-cta">
            <NuxtLink :to="path" class="name btn btn-red">Acesse o ensaio</NuxtLink>
        </div>
    </div>
</template>

<style lang="scss">
    .wrap-testimonial {
        justify-content: center;
        padding: 30rem;
        flex-wrap: wrap;
        display: flex;

        .image-testimonial {
            box-shadow: 0 0 10rem rgba(0, 0, 0, 0.1);
            margin-right: -10rem;
            border-radius: 50%;
            object-fit: cover;
            height: 70rem;
            flex-shrink: 0;
            width: 70rem;
            z-index: 2;
        }

        .text-testimonial {
            box-shadow: 0 0 10rem rgba(0, 0, 0, 0.1);
            background: #f9f9f9;
            border-radius: 10rem;
            padding: 20rem;
            width: 87%;

            .description {
                padding-top: 0;
            }

            .from {
                padding-top: 5rem;
                text-align: right;
                display: block;
            }
        }

        .wrap-cta {
            justify-content: center;
            padding-bottom: 20rem;
            display: flex;
            width: 100%;

            .btn {
                margin-top: -15rem;
            }
        }
    }
</style>
