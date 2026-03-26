
<script setup lang="ts">
import { data } from 'autoprefixer';

const props = defineProps({
  lp: {
    type: String,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  }
});

const {
    data: works
} = await useAsyncData('work-'+ props.lp, () => {
    const query = queryCollection('works');

    if (props.lp) {
        query.where('path', 'LIKE', `%${props.lp}%`);
    }

    return query.all();
});

const images = computed(() => {
    if (!works.value) return []

    const picked = works.value.map((work: any) => {
        const retratos = (work.album ?? []).filter((img: any) => img.format === 'retrato')
        const chosen =
            retratos.find((img: any) => img.canbethumb && img.highlight) ??
            retratos.find((img: any) => img.highlight) ??
            retratos.find((img: any) => img.canbethumb) ??
            retratos[0]
        return chosen ? { ...chosen, _workTitle: work.title } : null
    }).filter(Boolean)

    return picked.slice(0, 4)
})

</script>

<template>
    <div class="portfolio section-lp" data-ani-type="fade-up" data-ani-delay="0.6s">
        <h1 class="title-lp">{{ props.data.title }}</h1>
        <p class="description-lp">
            {{ props.data.description }}
        </p>

        <div class="wrap">
            <nuxt-img
                v-for="(img, i) in images" :key="img.imageId + i"
                provider="cloudflare"
                :src='"https://images.fotografalilliatavares.com.br/images/" + img.imageId + "/public"'
                width="551"
                height="646"
                sizes="'100vw md:50vw lg:551px"
                class="thumb"
                :alt="img.alt || img._workTitle"
                format="webp"
                placeholder
                fetchpriority="high" />
        </div>
            
        <div class="ac" v-if="props.data.buttonLink && props.data.buttonText">
            <nuxt-link
                :to="props.data.buttonLink"
                class="btn-hero"
                target="_blank"
                :aria-label="props.data.buttonLabel || props.data.buttonText">
                <span>{{ props.data.buttonText }}</span>

                <Icon
                    name="icons:external"
                    class="icon icon-external"/>
            </nuxt-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .wrap {
        display: flex;
        gap: 5rem;

        @include m.max(xs) {
            flex-wrap: wrap;
            justify-content: center;
        }

        img {
            aspect-ratio: 861/1292;
            height: auto;
            width: 25%;

            @include m.max(xs) {
                width: calc(50% - 5rem);
            }
        }
    }

    .title-lp {
        margin-bottom: 0;
    }

    .description-lp {
        padding-bottom: 20px;
    }

    .btn-hero {
        transition: box-shadow .3s ease, background .3s ease;
        border-radius: 8rem;
        align-items: center;
        font-weight: bold;
        display: inline-flex;
        margin: 40rem auto 0;
        gap: 15rem;
        padding: 5rem 15rem;
        font-size: 19rem;
        
        @include m.max(sm) {
            margin-top: 30rem;
            font-size: 22rem;
        }

        .icon {
            font-size: 40rem;
        }

        svg {
            width: 24rem;
        }
        
        &:hover {
            background: #eaeaea;
        }
    }

    .lp-corporativo {
        color: v.$lp-corporativo;

        .description-lp {
            color: v.$lp-corporativo;
        }

        .btn-hero {
            box-shadow: 3rem 3rem 0 v.$lp-corporativo;
            border: 3rem solid v.$lp-corporativo;
            color: v.$lp-corporativo;
            
            &:hover {
                box-shadow: 5rem 5rem 0 v.$lp-corporativo;
            }
        }
    }

    .lp-dia-das-maes {
        color: v.$lp-dia-das-maes;

        .description-lp {
            color: v.$lp-dia-das-maes;
        }

        .wrap {
            justify-content: center;
        }

        .btn-hero {
            box-shadow: 3rem 3rem 0 v.$lp-dia-das-maes;
            border: 1px solid v.$lp-dia-das-maes;
            color: v.$lp-dia-das-maes;
            
            &:hover {
                border-color: v.$lp-dia-das-maes-dark;
                color: v.$lp-dia-das-maes-dark;
                box-shadow: 5rem 5rem 0 v.$lp-dia-das-maes-dark;
                background: white;
            }
        }
    }
</style>
