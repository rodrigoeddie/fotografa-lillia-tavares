<script setup lang="ts"></script>

<template>
    <div class="container">
      <section class="depo-pg-hero" data-ani-type="fade-up">
        <div>
          <span class="eyebrow">Depoimentos verificados</span>
          <h1 class="big-title green">
            Cada ensaio vira uma história.
          </h1>

          <p class="description">
            Reuni aqui depoimentos reais, todos verificados publicamente no Google.
            Cada um deles veio de uma sessão completa, clique em <b>"Acesse o ensaio"</b>
            para ver as fotos do depoimento.
          </p>
          <div class="wrap-btns">
            <a class="btn btn-primary" href="https://wa.me/5511911159795">Agendar meu ensaio</a>
            <a class="btn btn-ghost" href="https://g.page/r/CU9H139Hyr99EBM/review" target="_blank">Deixar uma avaliação</a>
          </div>
        </div>

        <aside class="depo-pg-rating">
          <span class="stars">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z"/></svg>
          </span>
          <div class="score">5.0</div>
          <div class="meta">100+ avaliações</div>
        </aside>
      </section>
    </div>
</template>

<style lang="scss" scoped>
.wrap-btns {
  padding-top: 20rem;
  display: flex;
  gap: 20rem;

  @include m.max(sm) {
    align-items: center;
    flex-direction: column;
  }

  .btn {
    @include m.max(sm) {
      width: 390rem;
    }
  }
}

.eyebrow {
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #6b5f55;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    
    @include m.max(sm) {
      justify-content: center;
      width: 100%;
    }
}

  .depo-pg-hero {
    padding: 60rem 0 40rem;
    align-items: center;
    display: flex;
    gap: 50rem;

    @include m.max(sm) {
      flex-direction: column;
    }
  }
  .depo-pg-hero h1 em { font-style: italic; color: v.$green; }

  .depo-pg-rating {
    box-shadow: 0 24px 38px -18px rgba(42, 37, 32, 0.30);
    background: white;
    border-radius: 2px;
    text-align: center;
    position: relative;
    padding: 30rem;
    width: 50%;

    @include m.max(sm) {
      width: 100%;
    }
  }
  .depo-pg-rating::before {
    content: "Avaliações públicas no Google";
    position: absolute;
    top: -12px; left: 50%;
    transform: translateX(-50%);
    background: v.$red;
    color: white;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 999px;
    white-space: nowrap;
  }
  .description {
    padding-top: 0;
    margin-top: 0;

    @include m.max(sm) {
      text-align: center;
    }
  }
  .depo-pg-rating .score {
    font-size: 92px;
    line-height: 1;
    color: v.$red;
    font-weight: bold;
    margin: 20rem 0 10rem;

    @include m.max(sm) {
      font-size: 50px;
    }
  }
  .depo-pg-rating .stars { color: #F5B748; display: inline-flex; gap: 4px; margin-bottom: var(--s-3); }
  .depo-pg-rating .meta { font-size: 12px; color: var(--ink-soft); letter-spacing: 0.18em; text-transform: uppercase; }
  .depo-pg-rating .breakdown {
    margin-top: 30rem;
    padding-top: 30rem;
    border-top: 1px dashed 1px;
    text-align: left;
  }
  .depo-pg-rating .breakdown .row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 13px;
    padding: 4px 0;
    color: black;
  }
  .depo-pg-rating .breakdown .row strong {
    color: v.$green;
    font-weight: 600;
    font-size: 17px;
  }

</style>
