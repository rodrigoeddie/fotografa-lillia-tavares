
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
  },
  externalLink: {
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
            <NuxtLink :to="testimonial.link" target="_blank" rel="noopener noreferrer">                
                <span class="stars" v-if="testimonial.rating">
                    <template v-for="n in Math.min(Math.max(Number(testimonial.rating) || 5, 1), 5)" :key="n">★</template> - <span class="review-card__date">{{ testimonial.data }}</span>
                </span>
            </NuxtLink>

            <p class="description" v-html="testimonial.text"></p>

            <span class="from">
                <NuxtLink
                  :to="testimonial.link"
                  target="_blank"
                  class="link-source"
                  rel="noopener noreferrer">
                    <span>Via:</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-label="Google">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>{{ testimonial.source }}</span>
                </NuxtLink>
            </span>
        </div>

        <div v-if="fromList && path" class="wrap-cta">
            <NuxtLink
              :to="path"
              class="name btn btn-green"
              :target="props.externalLink ? '_blank' : '_self'"
              :rel="props.externalLink ? 'noopener noreferrer' : ''">
                <span>Acesse o ensaio</span>

                <Icon
                    v-if="props.externalLink"
                    name="icons:external"
                    class="icon icon-external"/>
            </NuxtLink>
        </div>
    </div>
</template>

<style lang="scss">
    .link-source {
        display: flex;
        gap: 4px;
    }

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
            background: white;
            border-radius: 10rem;
            padding: 20rem;
            width: 87%;
  
            @include m.max(xs) {
                width: 95%;
            }

            .description {
                padding-top: 0;
  
                @include m.max(xs) {
                    font-size: 16rem;
                }
            }

            .from {
                padding-top: 5rem;
                text-align: right;
                display: block;
                display: flex;
                justify-content: flex-end;
            }
        }

        .wrap-cta {
            justify-content: center;
            padding-bottom: 20rem;
            display: flex;
            width: 100%;

            .btn {
                margin-top: -10rem;
                border-radius: 5rem;
                text-transform: none;
                padding: 6rem 12rem;
                gap: 5rem;
            }
        }
    }
</style>
