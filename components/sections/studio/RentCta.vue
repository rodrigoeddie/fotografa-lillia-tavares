<script setup lang="ts">
</script>

<template>
  <section class="rent-cta" aria-labelledby="rent-cta-title" data-ani-type="fade-up">
    <div class="container">
      <div class="panel">
        <div class="text">
          <p class="eyebrow">Para fotógrafos e criadores</p>
          <h2 id="rent-cta-title" class="title">Alugue o estúdio para as suas produções</h2>
          <p class="description">
            Espaço equipado em Mogi das Cruzes com fundo infinito, cenários montados e
            luz natural — por hora ou diária.
          </p>
        </div>

        <NuxtLink
          to="/estudio-fotografico-em-mogi-das-cruzes/aluguel"
          class="btn-rent"
          data-track-event="cta-aluguel-estudio">
          <span>Ver valores e cenários</span>
          <Icon name="icons:arrow-right" class="icon" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use 'sass:color';

/* mesmo olive-dark do painel do hero/footer — texto branco passa AA */
$panel: color.adjust(v.$green, $lightness: -15%);

.rent-cta {
  padding: 40rem 0;

  .panel {
    justify-content: space-between;
    background: $panel;
    align-items: center;
    padding: 40rem 44rem;
    display: flex;
    gap: 32rem;

    @include m.max(sm) {
      flex-direction: column;
      align-items: flex-start;
      padding: 32rem 24rem;
    }
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: .16em;
    color: v.$light-green;
    margin-bottom: 8rem;
    font-weight: 700;
    font-size: 13rem;
  }

  .title {
    color: white;
    font-weight: 900;
    font-size: 28rem;
    line-height: 1.2;
    text-wrap: balance;
  }

  .description {
    color: rgba(255, 255, 255, .8);
    margin-top: 10rem;
    max-width: 560rem;
    font-size: 16rem;
    line-height: 1.6;
  }

  .btn-rent {
    transition: background .2s, transform .12s;
    text-transform: uppercase;
    letter-spacing: .06em;
    border-radius: 999px;
    background: v.$cream;
    align-items: center;
    flex-shrink: 0;
    padding: 16rem 28rem;
    font-weight: 900;
    font-size: 15rem;
    color: $panel;
    display: inline-flex;
    gap: 10rem;

    .icon {
      font-size: 14rem;
    }

    &:hover {
      transform: translateY(-2px);
      background: white;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .rent-cta .btn-rent {
    transition: none;
  }
}
</style>
