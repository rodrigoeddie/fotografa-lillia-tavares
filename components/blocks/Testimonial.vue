
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
    default: ''
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
            :provider="testimonial.avatar ? 'cloudflare' : undefined"
            :src="testimonial.customAvatar || 'https://images.fotografalilliatavares.com.br/images/' + testimonial.avatar + '/public'"
            :width="'100'"
            :height="'100'"
            :alt="'' + name"
            :class="'image-testimonial'"
            placeholder
            loading="lazy"/>
        <div class="text-testimonial">
            <span class="stars" v-if="testimonial.rating"><template v-for="n in testimonial.rating" :key="n">★</template> - <span class="review-card__date">{{ testimonial.date }}</span></span>

            <p class="description" v-html="testimonial.text"></p>

            <span class="from">
                Via: <NuxtLink :to="testimonial.link" target="_blank" rel="noopener noreferrer">{{ testimonial.source }}</NuxtLink>
            </span>
        </div>

        <div v-if="fromList && path" class="wrap-cta">
            <NuxtLink :to="path" class="name btn btn-green">Acesse o ensaio</NuxtLink>
        </div>
    </div>
</template>

<style lang="scss">
    .stars {
        padding-bottom: 10rem;
        letter-spacing: 2px;
        color: #f9a825;
        font-size: 20rem;
        display: block;
        
        .review-card__date {
            font-size: 15rem;
        }
    }

    .wrap-testimonial {
        justify-content: center;
        flex-wrap: wrap;
        padding: 30rem;
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
