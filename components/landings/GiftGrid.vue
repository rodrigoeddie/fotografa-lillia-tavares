<script setup lang="ts">
const NuxtLink = resolveComponent('NuxtLink');

const props = defineProps({
  lp: {
    type: String,
    default: 'presentes'
  },
  data: {
    type: Object,
    required: false,
    default: () => ({
      title: 'Ideias de presente com ensaio fotográfico',
      description: 'Escolha a ocasião perfeita para presentear com uma experiência única e inesquecível.',
      items: [
        {
          title: 'Dia das Mães',
          description: 'Um presente que eterniza o amor entre mãe e filho. Fotos profissionais que ela vai guardar para sempre.',
          link: '/presente-ensaio-fotografico-mogi/dia-das-maes',
          icon: '🌸',
          active: true
        },
        {
          title: 'Aniversário',
          description: 'Celebre a vida com um ensaio fotográfico especial. Um presente que valoriza quem você ama.',
          link: '',
          icon: '🎂',
          active: false
        },
        {
          title: 'Casais & Namorados',
          description: 'Eternize o amor do casal com fotos profissionais. Perfeito para Dia dos Namorados ou qualquer data especial.',
          link: '',
          icon: '💕',
          active: false
        },
        {
          title: 'Natal',
          description: 'Presente de Natal inesquecível: um ensaio fotográfico profissional para toda a família.',
          link: '',
          icon: '🎄',
          active: false
        }
      ]
    })
  }
});
</script>

<template>
  <section class="container section-lp gift-grid" data-ani-type="fade-up">
    <h2 class="title-lp">{{ props.data.title }}</h2>
    <p class="description-lp">{{ props.data.description }}</p>

    <div class="grid">
      <component
        :is="item.active ? NuxtLink : 'div'"
        v-for="(item, index) in props.data.items"
        :key="index"
        :to="item.active ? item.link : undefined"
        class="card"
        :class="{ 'card--active': item.active, 'card--soon': !item.active }"
        :data-ani-type="'fade-up'"
        :data-ani-delay="`${0.1 * (index + 1)}s`"
        :data-track-event="item.active ? 'cta-presente-grid' : undefined"
        :data-track-params="item.active ? JSON.stringify({ label: item.title }) : undefined"
      >
        <span class="card__icon">{{ item.icon }}</span>
        <h3 class="card-title">{{ item.title }}</h3>
        <p class="card-description">{{ item.description }}</p>
        <span v-if="item.active" class="card__link">Ver pacotes →</span>
        <span v-else class="card__badge">Em breve</span>
      </component>
    </div>
  </section>
</template>

<style scoped lang="scss">
.gift-grid {
  padding-top: 40rem;
}

.title-lp {
  text-align: center;
  margin-bottom: 15rem;
}

.description-lp {
  text-align: center;
  margin: 0 auto 50rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25rem;
  max-width: 1200rem;
  margin: 0 auto;

  @include m.max(sm) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15rem;
  }
}

.card {
  border-radius: 8rem;
  padding: 20rem 10rem;
  text-align: center;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__icon {
    font-size: 50rem;
    margin-bottom: 20rem;
    display: block;
  }

  &__link {
    font-weight: 700;
    font-size: 17rem;
    text-decoration: underline;
  }

  &__badge {
    font-size: 14rem;
    font-weight: 600;
    padding: 5rem 15rem;
    border-radius: 20rem;
    opacity: 0.7;
  }

  &--active {
    cursor: pointer;

    &:hover {
      transform: translateY(-4rem);
      box-shadow: 0 8rem 24rem rgba(0, 0, 0, 0.12);
    }
  }

  &--soon {
    opacity: 0.6;
  }
}

.lp-presentes {
    .title-lp,
    .description-lp,
    .card-title,
    .card-description {
        color: v.$lp-presentes;
    }

    .card {
        background: white;
        color: v.$lp-presentes-dark;

        &--active {
            border: 2rem solid v.$lp-presentes-light;

            &:hover {
                border-color: v.$lp-presentes;
            }
        }

        &--soon {
            border: 2rem dashed v.$lp-presentes-light;
        }

        &__link {
            color: v.$lp-presentes;
        }

        &__badge {
            background: v.$lp-presentes-ultralight;
            color: v.$lp-presentes;
        }
    }
}
</style>
