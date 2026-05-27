<script lang="ts" setup>
const formatDate = (dateString: string) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
});

const { hovered, tiltStyle, onMouseMove, onMouseLeave } = useTiltEffect();
</script>

<template>
<div class="thumb thumb-vertical" :class="{ hover: hovered }" :style="tiltStyle">
    <div class="inner-thumb">
    <div class="slider">
        <ClientOnly>
            <NuxtLink
              :to="item.path"
              class="link-card"
              @mousemove="onMouseMove"
              @mouseenter="hovered = true"
              @mouseleave="onMouseLeave">
              <swiper-container
                class="swiper"
                :slides-per-view="1"
                :effect="'flip'"
                :pagination="{
                clickable: true,
                }"
                :navigation="true">
                <swiper-slide
                  v-for="slide in item.photos['retrato']"
                  :key="slide.id"
                  :class="'wrap-img ' + slide.format">
                    <nuxt-img
                      provider="cloudflare"
                      :src='"https://images.fotografalilliatavares.com.br/images/" + slide.imageId + "/public"'
                      width="551"
                      height="646"
                      sizes="'100vw md:50vw lg:551px"
                      class="bg-thumb"
                      :alt="slide.alt"
                      format="avif"
                      placeholder
                      loading="lazy"/>
                </swiper-slide>
              </swiper-container>
            </NuxtLink>
        </ClientOnly>
    </div>

    <div class="wrap-info">
        <div class="wrap-text">
            <h2 class="title">
            {{ item.title }}
            </h2>

            <ul class="info-list">
                <li class="category" v-if="item.category && item.category.slug">
                    <NuxtLink
                    :to="'/ensaio-fotografico/' + item.category.slug">
                    <span>{{ item.category.title }}</span>
                    </NuxtLink>
                </li>
                <li class="place">
                    <Icon
                    name="icons:location-pin-solid"
                    class="icon icon-location-pin"/>
                    <span v-html="item.local"></span>
                </li>
                <li class="place" v-if="item.date">
                    <Icon
                    name="icons:location-pin-solid"
                    class="icon icon-location-pin"/>
                    <span v-html="formatDate(item.date)"></span>
                </li>
            </ul>

            <div class="ac pt10 wrap-link">
                <NuxtLink
                  :to="item.path"
                  class="btn tiny">
                  Acessar Ensaio
                </NuxtLink>
            </div>
        </div>
    </div>
    </div>
</div>
</template>

<style scoped lang="scss">
.thumb {
    transition: transform .15s cubic-bezier(.2,.7,.2,1), box-shadow .3s ease;
    box-shadow:
      0 1px 0 #ECE4D2,
      0 14px 30px -12px rgba(42, 37, 32, 0.25),
      0 4px 10px -4px rgba(42, 37, 32, 0.10);
    transform-style: preserve-3d;
    will-change: transform;

    &.hover {
        box-shadow:
            0 1px 0 #ECE4D2,
            0 28px 50px -16px rgba(42, 37, 32, 0.35),
            0 8px 18px -6px rgba(42, 37, 32, 0.15);
    }

    .inner-thumb {
        flex-direction: column;
        display: flex;
        height: 100%;
    }
    
    .wrap-info {
        color: v.$green;
        padding: 15rem 15rem 0 15rem;
        height: 100%;
        
        .wrap-text {
            position: static;
        }
        
        .title {
            font-size: 20rem;
        }
        
        .info-list {
            line-height: 28rem;
            padding-top: 10rem;
            font-size: 19rem;
            
            li {
                padding-left: 25rem;
            }
            
            li.category {
                &:before {
                    content: '';
                    
                    background-color: v.$green;
                    display: inline-block;
                    position: absolute;
                    border-radius: 50%;
                    height: 12rem;
                    width: 12rem;
                    left: 2rem;
                    top: 11rem;
                    
                    @include m.max(sm) {
                        top: 9rem;
                    }
                }
            }
            
            li.place .icon {
                position: absolute;
                left: -1rem;
                top: 7rem;
                
                @include m.max(sm) {
                    top: -2rem;
                }
            }
            
            :deep(a) {
                display: block;
                padding: 2px 0;
                
                @include m.max(sm) {
                    padding: 0;
                }
            }
        }
        
        .ensaio-description {
            padding-bottom: 40rem;
        }
    }

    .wrap-link {
        bottom: -16rem;
    }
    
    .link {
        text-decoration: underline;
        align-items: flex-end;
        padding-top: 30rem;
        font-size: 30rem;
        color: v.$green;
        display: flex;
    }
        
    &.lenght-items-6 {
        width: calc(16.6667% - 7rem);
        
        @include m.max(sm) {
            width: 48%;
        }
    }
        
    &.lenght-items-5 {
        width: calc(20% - 12rem);
        
        @include m.max(sm) {
            width: 48%;
        }
    }

    &.lenght-items-4 {
        width: calc(25% - 15rem);
        
        @include m.max(sm) {
            width: 49%;
        }
    }

    &.lenght-items-3 {
        width: calc(33% - 7rem);
        
        @include m.max(sm) {
            width: 96%;
        }
    }

    &.lenght-items-2 {
        width: calc(50% - 7rem);
        
        @include m.max(sm) {
            width: 96%;
        }
    }
}

:deep(.swiper) {
    --swiper-navigation-size: 30rem !important;
}
.slider {
    aspect-ratio: 384/543;
    background: #f6f6f6;
    overflow: hidden;
    flex-shrink: 0;
    width: 100%;
}
.swiper {
    height: 100%;
    width: 100%;
    
    .wrap-img {
        height: 100%;
        
        img {
            position: absolute;
            object-fit: cover;
            height: 100%;
            width: 100%;
        }
    }
}
</style>