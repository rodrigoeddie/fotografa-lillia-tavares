
<script setup lang="ts">
const props = defineProps({
  lp: {
    type: String,
    default: ''
  }
});

const {
    data: works
} = await useAsyncData(`testimonials-${props.lp}`, () => {
    const query = queryCollection('works');
    query.where('testimonial', '<>', null);

    if (props.lp) {
        query.where('path', 'LIKE', `%${props.lp}%`);
    }

    return query.all();
});

const isFewItems = computed(() => (works.value?.length ?? 0) <= 2);
</script>

<template>
    <div class="wrap-testimonials" data-ani-type="fade-up">
        <h2 :class="props.lp == 'corporativo' ? 'title-lp' : 'title'">
            <NuxtLink
                to="/depoimentos"
                class="link">
                Depoimentos
            </NuxtLink>
        </h2>

        <p class="description-lp" v-if="props.lp == 'corporativo'">
            Avaliação 5 estrelas por clientes sobre os ensaios fotográficos profissionais feitos no estúdio
        </p>
        <p class="description-lp" v-else-if="props.lp == 'dia-das-maes'">
            Avaliação 5 estrelas de famílias que transformaram o Dia das Mães em lembranças para toda a vida
        </p>
        <p class="description" v-else>
            O que clientes dizem sobre os ensaios fotográficos feitos no estúdio
        </p>

        <ClientOnly>
        <div v-if="isFewItems" class="flex-testimonials">
            <div
                v-for="work in works"
                :key="work.id"
                class="swiper-slide">
                    <BlocksTestimonial
                        v-if="work.testimonial"
                        :path="work.path"
                        :name="work.title"
                        :fromList="true"
                        :externalLink="props.lp !== '' ? true : false"
                        :testimonial="work.testimonial" />
            </div>
        </div>
        <swiper-container
            v-else
            class="swiper-testimonials"
            :auto-height="true"
            :allow-touch-move="true"
            :prevent-clicks="false"
            :prevent-clicks-propagation="false"
            :touch-release-on-edges="true"
            :pagination="{
                clickable: true,
            }"
            :slides-per-group="1"
            :slides-per-view="1.20"
            :space-between="8"
            :breakpoints="{
                500: {
                    slidesPerGroup: 2,
                    slidesPerView: 2.20,
                    spaceBetween: 16,
                },
                750: {
                  slidesPerGroup: 3,
                  slidesPerView: 3.20,
                  spaceBetween: 16,
              },
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
                            :externalLink="props.lp !== '' ? true : false"
                            :testimonial="work.testimonial" />
                </swiper-slide>
        </swiper-container>
        </ClientOnly>
    </div>
</template>

<style scoped lang="scss">
    .title {
        color: v.$green;
        display: block;
        text-align: center;
        padding-bottom: 0;
    }

    .title-lp {
        margin-bottom: 0;
        padding-top: 0;
    }

    .description-lp,
    .description {
        text-align: center;
        padding-bottom: 30rem;
    }

    .wrap-testimonials .flex-testimonials {
        display: flex;
        justify-content: center;
        gap: 16rem;
        padding-right: 30rem;
        flex-wrap: wrap;

        .swiper-slide {
            flex: 0 1 47%;

            @include m.max(xs) {
                flex: 0 1 100%;
            }
        }
        .swiper-slide .wrap-testimonial {
            margin-bottom: 0;

            :deep(.text-testimonial) {
                @include m.max(xs) {
                    min-height: auto !important;
                }
            }
        }
    }

    .wrap-testimonials {
        background: rgba(72, 83, 73, 0.14);
        margin-bottom: calc(v.$space * 2);
        width: 100%;
        padding: 30rem 0 30rem 30rem;

        .swiper-slide {
            .wrap-testimonial {
                padding: 0;
                margin-bottom: 30rem;

                :deep(.text-testimonial) {
                    justify-content: center;
                    flex-direction: column;
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

    .lp-corporativo {
        background: transparent;

        .description-lp,
        .title {
            color: v.$lp-corporativo;
        }

        :deep(.wrap-testimonial) {
            .btn {
                background: v.$lp-corporativo;
                color: white;

                &:hover {
                    background: #eaeaea;
                    color: v.$lp-corporativo;
                }
            }

            .description {
                color: v.$lp-corporativo;
            }

            .text-testimonial {
                box-shadow: 0 0 10rem rgba(0, 0, 0, 0.25);
                background: #f7f7f7;
            }
        }
    }

    .lp-dia-das-maes {
        background: transparent;

        .description-lp,
        .title {
            color: v.$lp-dia-das-maes;
        }

        :deep(.wrap-testimonial) {
            .btn {
                background: v.$lp-dia-das-maes-dark;
                color: white;

                &:hover {
                    background: #eaeaea;
                    color: v.$lp-dia-das-maes;
                }
            }

            .description {
                color: v.$lp-dia-das-maes-dark;
            }

            .text-testimonial {
                box-shadow: 0 0 10rem rgba(0, 0, 0, 0.25);
                background-color: v.$lp-dia-das-maes-ultralight;
            }
        }
    }

    .lp-presentes {
        background: transparent;

        .description-lp,
        .title {
            color: v.$lp-presentes;
        }

        :deep(.wrap-testimonial) {
            .btn {
                background: v.$lp-presentes-dark;
                color: white;

                &:hover {
                    background: #eaeaea;
                    color: v.$lp-presentes;
                }
            }

            .description {
                color: v.$lp-presentes-dark;
            }

            .text-testimonial {
                box-shadow: 0 0 10rem rgba(0, 0, 0, 0.25);
                background-color: v.$lp-presentes-ultralight;
            }
        }
    }
</style>
