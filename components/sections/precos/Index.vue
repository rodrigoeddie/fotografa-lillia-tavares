<script setup lang="ts">
const { data: allInvestimentos } = await useAsyncData('investimento-categories', () => {
  return queryCollection('investimento').all();
});

const categories = computed(() => {
  if (!allInvestimentos.value) return [];

  return allInvestimentos.value
    .filter((item: any) => item.active === true)
    .map((item: any) => ({
      slug: item.stem,
      name: item.title,
      icon: item.icon,
      description: item.description
    }));
});
</script>

<template>
  <div class="investment-page">
    <div class="container">
      <header class="investment-header">
        <h1 class="investment-header__title">Investimento em Ensaios Fotográficos</h1>
        <p class="investment-header__description">
          Escolha o tipo de ensaio que melhor se encaixa no seu momento especial.
          Cada categoria foi cuidadosamente elaborada para atender suas necessidades.
        </p>
      </header>

      <div class="investment-categories">
        <NuxtLink
          v-for="category in categories"
          :key="category.slug"
          :to="`/precos-ensaios-fotograficos/${category.slug}`"
          class="category-card"
        >
          <div class="category-card__icon">{{ category.icon }}</div>
          <h2 class="category-card__title">{{ category.name }}</h2>
          <p class="category-card__description">{{ category.description }}</p>
          <span class="category-card__link">Ver Pacotes →</span>
        </NuxtLink>
      </div>

      <section class="investment-info">
        <h2 class="investment-info__title">Por que investir em fotografia profissional?</h2>
        <div class="investment-info__grid">
          <div class="info-item">
            <h3 class="info-item__title">Memórias Eternas</h3>
            <p class="info-item__text">
              Momentos especiais merecem ser eternizados com qualidade e profissionalismo.
            </p>
          </div>
          <div class="info-item">
            <h3 class="info-item__title">Experiência Completa</h3>
            <p class="info-item__text">
              Do planejamento à entrega, cuidamos de cada detalhe para sua satisfação.
            </p>
          </div>
          <div class="info-item">
            <h3 class="info-item__title">Qualidade Garantida</h3>
            <p class="info-item__text">
              Equipamentos profissionais e anos de experiência para resultados impecáveis.
            </p>
          </div>
        </div>
      </section>

      <section class="investment-cta">
        <h2>Ainda tem dúvidas?</h2>
        <p>Entre em contato e vamos conversar sobre o pacote ideal para você.</p>
        <a
          href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os pacotes fotográficos"
          target="_blank"
          rel="noopener noreferrer"
          class="investment-cta__button"
        >
          Falar com a Fotógrafa
        </a>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.investment-page {
  padding: 64rem 0;
  min-height: 100vh;
}

.container {
  max-width: 1200rem;
  margin: 0 auto;
  padding: 0 24rem;
}

.investment-header {
  text-align: center;
  margin-bottom: 64rem;
  max-width: 800rem;
  margin-left: auto;
  margin-right: auto;

  &__title {
    font-size: 40rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 16rem;
  }

  &__description {
    font-size: 18rem;
    color: #666;
    line-height: 1.6;
  }
}

.investment-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280rem, 1fr));
  gap: 32rem;
  margin-bottom: 64rem;
}

.category-card {
  background: #fff;
  border: 2rem solid #e5e5e5;
  border-radius: 8rem;
  padding: 32rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    border-color: #333;
    box-shadow: 0 4rem 12rem rgba(0, 0, 0, 0.1);
    transform: translateY(-4rem);
  }

  &__icon {
    font-size: 48rem;
    margin-bottom: 16rem;
  }

  &__title {
    font-size: 24rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 12rem;
  }

  &__description {
    color: #666;
    line-height: 1.5;
    margin-bottom: 24rem;
    flex: 1;
  }

  &__link {
    color: #333;
    font-weight: 600;
    text-decoration: underline;
  }
}

.investment-info {
  background: #f9f9f9;
  border-radius: 8rem;
  padding: 48rem 32rem;
  margin-bottom: 48rem;

  &__title {
    text-align: center;
    font-size: 32rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 32rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250rem, 1fr));
    gap: 32rem;
  }
}

.info-item {
  &__title {
    font-size: 20rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 12rem;
  }

  &__text {
    color: #666;
    line-height: 1.6;
  }
}

.investment-cta {
  text-align: center;
  padding: 48rem 0;

  h2 {
    font-size: 32rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rem;
  }

  p {
    font-size: 18rem;
    color: #666;
    margin-bottom: 32rem;
  }

  &__button {
    display: inline-block;
    padding: 16rem 40rem;
    background: #333;
    color: #fff;
    text-decoration: none;
    border-radius: 4rem;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      background: #000;
      transform: translateY(-2rem);
      box-shadow: 0 4rem 12rem rgba(0, 0, 0, 0.2);
    }
  }
}

@media (max-width: 768rem) {
  .investment-page {
    padding: 32rem 0;
  }

  .investment-header {
    margin-bottom: 32rem;

    &__title {
      font-size: 28rem;
    }

    &__description {
      font-size: 16rem;
    }
  }

  .investment-categories {
    grid-template-columns: 1fr;
    gap: 24rem;
  }

  .investment-info {
    padding: 32rem 24rem;

    &__title {
      font-size: 24rem;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 24rem;
    }
  }

  .investment-cta {
    h2 {
      font-size: 24rem;
    }

    p {
      font-size: 16rem;
    }
  }
}
</style>
