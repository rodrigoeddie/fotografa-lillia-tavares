<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>

<template>
    <section v-if="props.data" class="pricing-cta" data-ani-type="fade-up">
        <nuxt-img
          v-if="props.data.image"
          class="image-cta"
          provider="cloudflare"
          :src="`https://images.fotografalilliatavares.com.br/images/${props.data.image}/public`"
          :width="props.data.imageWidth ? props.data.imageWidth : '395'"
          :alt="props.data.imageAlt ? props.data.imageAlt : 'Imagem de chamada para ação'"
          placeholder />
        <div class="text">
          <h2 class="title">{{ props.data.title }}</h2>
          <p class="description">{{ props.data.description }}</p>
          <ul>
            <li v-for="feature in props.data.features" :key="feature">{{ feature }}</li>
          </ul>
          <a 
            :href="`https://wa.me/5511911159795?text=${encodeURIComponent(props.data.whatsappMessage)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-cta"
          >
            {{ props.data.buttonText ? props.data.buttonText : 'Agendar Ensaio pelo WhatsApp' }}
          </a>
        </div>
    </section>
</template>

<style scoped lang="scss">
.pricing-cta {
  text-align: center;
  padding: calc(v.$bigSpace * 2) 0;
  margin-bottom: 80rem;
  color: v.$green;
  
  @include m.max(xs) {
    padding: v.$bigSpace 20rem;
    padding-left: 30%;
    text-align: right;
  }

  .description {
    margin-bottom: 20px;
  }

  ul {
    justify-content: center;
    padding-bottom: 40rem;
    flex-wrap: wrap;
    display: flex;
    gap: 15rem;
    max-width: 800rem;
    margin: 0 auto;
  
    @include m.max(xs) {
      justify-content: flex-end;
    }

    li {
      padding: 10rem 20rem;
      border-radius: 8rem;
      font-size: 20rem;
      color: white;
  
      @include m.max(xs) {
        font-size: 18rem;
      }
    }
  }

  .btn-cta {
      transition: box-shadow .3s ease, background .3s ease;
      box-shadow: 5rem 5rem 0 white;
      border-radius: 8rem;
      font-size: 25rem;
      border: 3rem solid white;
      padding: 20rem 30rem;
      align-items: center;
      font-weight: bold;
      display: inline-flex;
      color: white;
      gap: 15rem;
      
      @include m.max(sm) {
          padding: 15rem 21rem;
          font-size: 22rem;
          margin-top: 0;
      }

      .icon {
          font-size: 40rem;
      }
      
      &:hover {
          box-shadow: 10rem 10rem 0 white;
          background: black;
      }
  }
}

.lp-corporativo {
  background: v.$lp-corporativo;

  .image-cta {
    filter: drop-shadow(0 0 31px rgba(73,97,130, 0.7));
    position: absolute;
    bottom: 0;
    left: 25rem;
    height: auto;
    width: 311rem;
    
    @include m.max(xs) {
      width: 280rem;
      left: -74rem;
    }
  }

  .title,
  .description,
  & {
    color: white;
  }

  ul li {
    background-color: rgba(0, 0, 0, 0.3);
  }
}

.lp-dia-das-maes {
  background: v.$lp-dia-das-maes;
  display: flex;
  justify-content: flex-end;

  .text {
    text-align: left;
    padding-right: 40rem;
    max-width: 875rem;

    ul {
      justify-content: flex-start;
      max-width: none;
    }
  }
  
  .image-cta {
    position: absolute;
    object-fit: cover;
    height: 100%;
    width: 100%;
    bottom: 0;
    left: 0;

    @include m.max(xs) {
      object-position: 40%;
    }
  }

  .title,
  .description,
  & {
    color: white;
  }

  ul li {
    background-color: rgba(157, 126, 105, 0.8);
  }

  .btn-cta {
    background: rgba(v.$lp-dia-das-maes, 0.65);

    &:hover {
      border-color: v.$lp-dia-das-maes-dark;
      color: v.$lp-dia-das-maes-dark;
      box-shadow: 10rem 10rem 0 v.$lp-dia-das-maes-dark;
      background: white;
    }
  }
}

.lp-presentes {
  background: v.$lp-presentes;

  .title,
  .description,
  & {
    color: white;
  }

  ul li {
    background-color: rgba(139, 94, 107, 0.8);
  }

  .btn-cta {
    background: rgba(v.$lp-presentes, 0.65);

    &:hover {
      border-color: v.$lp-presentes-dark;
      color: v.$lp-presentes-dark;
      box-shadow: 10rem 10rem 0 v.$lp-presentes-dark;
      background: white;
    }
  }
}
</style>