
<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: {
        title: 'Análise de Coloração Pessoal',
        subtitle: 'Um presente ainda mais especial',
        description: `
            <p>Além do ensaio fotográfico, você pode incluir uma <b>análise de coloração pessoal</b>. Uma experiência única que revela quais cores valorizam a beleza natural, trazendo mais autoestima e confiança.</p>
            <p>Um momento de cuidado, transformação e carinho que vai muito além das fotos.</p>
        `,
    }
  }
});
</script>

<template>
    <section class="container section-lp" data-ani-type="fade-up">
        <div class="wrap-image">
            <nuxt-img
              provider="cloudflare"
              :src='"https://images.fotografalilliatavares.com.br/images/5aaf1433-aaa7-42ed-7198-15626f964000/public"'
              alt="Fotógrafa Lillia Tavares segurando sua câmera fotográfica"
              width="400"
              lazyload="true"
              sizes="100vw sm:50vw md:400px"
              format="webp"
              placeholder
              class="img"/>
        </div>
        <div class="text">
            <h1 class="title" v-html="props.data?.title"></h1>
            <p class="subtitle"><b>{{ props.data?.subtitle }}</b></p>
            <div class="description" v-html="props.data?.description"></div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.section-lp {
    margin-bottom: 70rem;
    padding-bottom: 0;
    padding-top: 0;
    display: flex;
    max-width: 1177rem;
    border-radius: 8rem;
    overflow: hidden;
    gap: 35rem;
}

.wrap-image {
    aspect-ratio: 1 / 1.02;
    flex-shrink: 0;
    width: 35%;

    .img {
        object-position: 50% 75%;
        position: absolute;
        object-fit: cover;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }
}

.text {
    padding-top: 30rem;
    width: 65%;
    align-items: flex-start;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .title {
        text-align: left;
        margin-bottom: 0;
        padding-top: 0;
    }

    .subtitle {
        padding-top: 15rem;
    }
    
    .description {
        padding-bottom: 20rem;
        text-align: left;
    }
}

.lp-dia-das-maes {
    background: v.$lp-dia-das-maes;
    color: white;

    .description {
        color: white;
    }
}
</style>