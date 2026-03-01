
<script setup lang="ts">
const {
    data: works
} = await useAsyncData(() => {
    const query = queryCollection('works');
    query.where('testimonial', '!=', null);

    return query.all();
});
</script>

<template>
    <div
      class="wrap-testimonials"
      data-ani-type="fade-up">
        <h2 class="title">
            <NuxtLink
                to="/depoimentos"
                class="link">
                Depoimentos
            </NuxtLink>
        </h2>
        <swiper-container
            class="swiper-testimonials"
            :effect="'flip'"
            :auto-height="true"
            :allow-touch-move="true"
            :prevent-clicks="false"
            :prevent-clicks-propagation="false"
            :touch-release-on-edges="true"
            :autoplay="{
                delay: 4000,
                disableOnInteraction: false
            }"
            :pagination="{
                clickable: true,
            }">
                <swiper-slide
                    v-for="work in works"
                    :key="work.id"
                    class="swiper-slide">
                        <BlocksTestimonial
                            v-if="work.testimonial"
                            :path="work.path"
                            :name="work.title"
                            :fromList="true"
                            :testimonial="work.testimonial" />
                </swiper-slide>
        </swiper-container>
    </div>
</template>

<style scoped lang="scss">
    .title {
        color: v.$dark-red;
        display: block;
        text-align: center;
    }

    .wrap-testimonials {
        background: rgba(72, 83, 73, 0.2);
        margin-bottom: calc(v.$space * 2);
        padding: 30rem 30rem 20rem 30rem;
        width: 100%;

        @include m.max(sm) {
            padding: 20px 3% 3% 3%;
        }

        .swiper-slide {
            padding: 0 80rem;

            @include m.max(sm) {
                padding: 0;
            }

            .wrap-testimonial {
                @include m.max(sm) {
                    padding: 20px 0;
                }
                
                :deep(.text-testimonial) {
                    justify-content: center;
                    flex-direction: column;
                    padding-right: 30rem;
                    padding-left: 30rem;
                    min-height: 180rem;
                    display: flex;

                    @include m.max(sm) {
                        min-height: 318rem;
                    }
                    
                    a {
                        pointer-events: auto;
                        position: relative;
                        z-index: 10;
                    }
                }
                
                :deep(.wrap-cta) {
                    a {
                        pointer-events: auto;
                        position: relative;
                        z-index: 10;
                    }
                }
            }
        }
    }
</style>
