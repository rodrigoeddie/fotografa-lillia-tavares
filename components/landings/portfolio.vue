
<script setup lang="ts">
const props = defineProps({
  lp: {
    type: String,
    default: false
  }
});

const {
    data: works
} = await useAsyncData(() => {
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
        const highlighted = retratos.find((img: any) => img.highlight)
        const chosen = highlighted ?? retratos[0]
        return chosen ? { ...chosen, _workTitle: work.title } : null
    }).filter(Boolean)

    return picked.slice(0, 4)
})
</script>

<template>
    <div class="portfolio section-lp" data-ani-type="fade-up" data-ani-delay="0.6s">
        <h1 class="title-lp">Fotos corporativas feitas no estúdio</h1>
        <p class="description-lp">
            Mais de 288 clientes atendidos em Mogi das Cruzes
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
            
        <div class="ac">
            <nuxt-link
                to="/ensaio-fotografico/corporativo"
                class="btn-hero"
                target="_blank"
                aria-label="Ver portfólio completo de fotos corporativas feitas no estúdio">
                <span>Ver Portifólio Completo</span>
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
        box-shadow: 5rem 5rem 0 v.$lp-corporativo;
        border-radius: 8rem;
        font-size: 25rem;
        border: 3rem solid v.$lp-corporativo;
        padding: 20rem 30rem;
        align-items: center;
        font-weight: bold;
        display: inline-flex;
        color: v.$lp-corporativo;
        margin: 40rem auto 0;
        gap: 15rem;
        
        @include m.max(sm) {
            margin-top: 30rem;
            font-size: 22rem;
        }

        .icon {
            font-size: 40rem;
        }
        
        &:hover {
            box-shadow: 10rem 10rem 0 v.$lp-corporativo;
            background: #eaeaea;
        }
    }

    .lp-corporativo {
        color: v.$lp-corporativo;

        .description-lp {
            color: v.$lp-corporativo;
        }
    }
</style>
