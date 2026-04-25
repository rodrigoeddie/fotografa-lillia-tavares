<script lang="ts" setup>
const props = defineProps({
  lp: {
    type: String,
    default: false
  }
});

const { data: rawProdutos } = await useFetch('/api/public/investimento');
const pageData = computed(() => {
  const found = (rawProdutos.value as any[] | null)?.find((p: any) => p.slug === props.lp || p.lp_slug === props.lp);
  return found ? adaptProduto(found) : null;
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

.lp-presentes {
  .title-precos {
    color: v.$lp-presentes;
  }

  .description-lp {
    color: v.$lp-presentes;
  }
}
</style>
