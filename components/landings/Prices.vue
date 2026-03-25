<script lang="ts" setup>
const props = defineProps({
  lp: {
    type: String,
    default: false
  }
});

// O conteúdo fica em /investimento/{slug} mas a URL é /precos-ensaios-fotograficos/{slug}
const { data: pageData } = await useAsyncData(`investimento-${props.lp}`, () => {
  return queryCollection('investimento').path(`/investimento/${props.lp}`).first();
});
</script>

<template >
    <section class="container" data-ani-type="fade-up">
      <h1 class="title-lp title-precos">
        Confira nossos preços
      </h1>
      <p class="description-lp">
        Pacotes para ensaio fotográfico profissional em Mogi das Cruzes
      </p>

      <SectionsGeneralPricingGrid :data="pageData" :lp="props.lp" class="from-lp-corporativo" />
    </section>
</template>

<style lang="scss" scoped>
.title-precos {
  margin-bottom: 0rem;
}

.lp-corporativo {
  .title-precos {
    color: v.$lp-corporativo;
  }

  .description-lp {
    color: v.$lp-corporativo;
  }
}

.lp-dia-das-maes {
  .title-precos {
    color: v.$lp-dia-das-maes;
  }

  .description-lp {
    color: v.$lp-dia-das-maes;
  }
}
</style>
